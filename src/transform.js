import { parse } from "svg-parser";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHtml from "prettier/parser-html";
import svgo from "svgo/dist/svgo.browser";
window.svgo = svgo;
class Transform {
  size = null;
  start = (svg, options = {}) => {
    this.options = options;
    const cleaned = this.clean(svg);
    if (!cleaned || cleaned === "") return "";
    const parsed = parse(cleaned);
    const transformed = this.transform(parsed.children[0]);
    const structured = this.structure(transformed);
    const formatted = this.format(structured);
    const replaced = this.replace(formatted);
    return replaced;
  };
  clean = (svg) => {
    const plugins = [
      "cleanupAttrs", // 清除换行符、尾随和重复空格的属性
      "mergeStyles", // 将多个样式元素合并为一个
      "removeDoctype", //删除doctype声明
      "removeXMLProcInst", //删除 XML 处理指令
      "removeComments", //删除评论
      "removeMetadata", //删除<metadata>
      "removeMetadata", //删除<metadata>
      "removeTitle", //删除<metadata>
      "removeDesc", //删除<desc>
      // "removeEditorsNSData", //删除编辑器命名空间、元素和属性
      // "removeHiddenElems", // 删除隐藏元素
      // "removeEmptyText", // 删除空的文本元素
      // "removeEmptyContainers", // 移除空的 Container 元素
      // "removeViewBox", // 尽可能删除viewBox属性
      // "cleanupEnableBackground", // 尽可能删除或清理enable-background属性
      // "convertColors", // 转换颜色 rgb() 转化为 #rrggbb
      "convertPathData", // 将路径数据转换为相对或绝对数据（以较短者为准），将一段转换为另一段，修剪无用的分隔符，智能舍入等等
      "convertTransform", // 将多个转换合并为一个，将矩阵转换为短别名等等
      "removeUnknownsAndDefaults", // 移除未知元素内容和属性，移除具有默认值的属性
      "removeNonInheritableGroupAttrs", //删除不可继承组的“表示”属性
      "removeUselessStrokeAndFill", //删除无用stroke和fill属性
      "removeUnusedNS", //删除未使用的命名空间声明
      "cleanupIDs", //删除未使用的并缩小使用的 ID
      "cleanupNumericValues", //将数值四舍五入到固定精度，删除默认px单位
      "moveElemsAttrsToGroup", //将元素的属性移动到它们的封闭组
      "moveGroupAttrsToElems", //将一些组属性移动到包含的元素
      "mergePaths", //将多个路径合并为一个
      "convertShapeToPath", //将一些基本形状转换为<path>
      "convertEllipseToCircle", //将非偏心转换<ellipse>为<circle>
      "sortDefsChildren", //排序子<defs>级以提高压缩率
      "removeUselessDefs", //删除没用的<defs>

      "convertStyleToAttrs", // 将样式转换为属性
    ];
    const optionsList = [
      "removeXMLNS", //删除xmlns属性
      "minifyStyles", // 使用CSSO缩小<style>元素内容
      "removeEmptyAttrs", // 删除空属性
      // "inlineStyles", // 将样式从<style>元素移动和合并到元素style属性 有bug
      "collapseGroups", //折叠无用的组
    ];
    optionsList.forEach((key) => {
      if (this.options[key]) {
        plugins.push(key);
      }
    });
    svg = svg.replaceAll("mix-blend-mode:passthrough", "");
    const cleaned = svgo.optimize(svg, {
      multipass: true, // boolean. false by default
      plugins: [
        ...plugins,
        {
          name: "prefixIds",
          params: {
            delim: "_dxc-svg-to-react_",
          },
        },
      ],
    });
    this.cleaned = cleaned.data;
    return cleaned.data;
  };
  transform = ({ tagName, properties, children, ...xxx }) => {
    const props = this.getProps(properties, tagName);
    let jsx = `<${tagName} ${props}`;
    if (children.length !== 0) {
      jsx += ">";
      children.forEach((row) => {
        jsx += "\n";
        if (typeof row === "string") {
          jsx += "{`" + row + "`}";
        } else if (row.type === "text") {
          jsx += "{`" + row.value + "`}";
        } else {
          jsx += this.transform(row);
        }
      });
      jsx += `</${tagName}>`;
    } else {
      jsx += "/>\n";
    }
    return jsx;
  };
  format = (src) => {
    return prettier.format(src, {
      parser: "babel",
      plugins: [parserBabel, parserHtml],
    });
  };
  getProps = (properties, tagName) => {
    let propsArr = [];
    let props;
    if (tagName === "svg") {
      const { width, height, ...other } = properties;
      if (width) {
        if (width === height) {
          this.size = width;
          propsArr.push(`width={size}`);
          propsArr.push(`height={size}`);
        } else {
          this.width = width;
          this.height = height;
          propsArr.push(`width={width}`);
          propsArr.push(`height={height}`);
        }
      }
      props = other;
    } else {
      props = properties;
    }

    for (let key in props) {
      if (key === "fill" && props[key] !== "none") {
        if (props[key] === "") {
          props[key] = "emptyFill";
        }
        if (!this.fill) {
          this.fill = props[key];
        } else if (this.fill !== props[key]) {
          this.fill = null;
        }
      }
      if (key === "class" || key === "className") {
        const regExp = new RegExp(props[key], "gim");
        if (this.cleaned.match(regExp).length === 1) {
          break;
        }
      }
      //   str.match(/ab/igm).length
      propsArr.push(`${this.transformKey(key)}="${props[key]}"`);
    }
    if (tagName === "svg") {
      propsArr.push(`{...ExtraProps}`);
    }
    return propsArr.join(" ");
  };
  transformKey = (key) => {
    if (key === "class") return "className";
    return this.toCamelCase(key);
  };
  structure = (src) => {
    const propsArr = [];
    if (this.size) {
      propsArr.push(`size="${this.size}"`);
    }
    if (this.width) {
      propsArr.push(`width="${this.width}"`);
    }
    if (this.height) {
      propsArr.push(`height="${this.height}"`);
    }
    if (this.fill) {
      propsArr.push(`fill="fillVal"`);
    }
    let props = "";
    if (propsArr.length !== 0) {
      propsArr.push("...other");
      props = `{${propsArr.join(",")}}`;
      this.extraProps = "other";
      //   src = src.replace("ExtraProps", "...other");
    } else {
      props = "props";
      this.extraProps = "props";
    }
    const { memo } = this.options;
    if (memo) {
      return `import React from 'react';

      const Icon = (${props}) => {
        return ${src};
      };
      export default React.memo(Icon);
      `;
    }
    return `const Icon = (${props}) => {
        return ${src};
      };
      export default Icon`;
  };
  toCamelCase = (str) => {
    var pattern = /-([a-z])/g;
    return str.replace(pattern, function (all, letter) {
      return letter.toUpperCase();
    });
  };
  replace = (src) => {
    src = src.replace("ExtraProps", this.extraProps).replaceAll("prefix_dxc-svg-to-react_", "");
    if (this.fill) {
      src = src.replaceAll(`"${this.fill}"`, "{fill}");
      src = src.replace(`fillVal`, this.fill === "emptyFill" ? "" : this.fill);
    }
    return src;
  };
}

export default (svg, options) => {
  const transform = new Transform();
  return transform.start(svg, options);
};
