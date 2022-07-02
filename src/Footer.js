import React from "react";
import Block from "dxc-flex";
import styles from "./Footer.css";
class Footer extends React.PureComponent {
  render() {
    return (
      <Block vertical='center' className={styles.Footer}>
        <a href='https://beian.miit.gov.cn/#/Integrated/index' target='_blank' rel='noopener noreferrer'>
          滇ICP备16003914号-1
        </a>
        <div style={{ flex: 1 }}></div>
        <a href='https://github.com/dxcweb/svg-to-react/issues' target='_blank' rel='noopener noreferrer'>
          BUG以及优化反馈
        </a>
        <a href='https://convert.dxcweb.com/' target='_blank' rel='external noreferrer'>
          在线视频压缩
        </a>
        <a href='http://watermark.dxcweb.com/' target='_blank' rel='external noreferrer'>
          图片加水印
        </a>
      </Block>
    );
  }
}
export default Footer;
