import React from "react";
import styles from "./Options.css";
import Checkbox from "./Checkbox";
import Warning from "./Warning";
class Options extends React.PureComponent {
  onClick = (key) => {
    const { options } = this.props;
    this.props.onChange({ [key]: !options[key] });
  };
  render() {
    const { options } = this.props;
    return (
      <div className={styles.Options}>
        <Checkbox className={styles.checkbox} checked={options.memo} onClick={this.onClick.bind(this, "memo")}>
          React.memo
        </Checkbox>
        <Checkbox className={styles.checkbox} checked={options.removeXMLNS} onClick={this.onClick.bind(this, "removeXMLNS")}>
          删除xmlns属性
        </Checkbox>
        <Checkbox className={styles.checkbox} checked={options.removeEmptyAttrs} onClick={this.onClick.bind(this, "removeEmptyAttrs")}>
          删除空属性
        </Checkbox>

        <Checkbox className={styles.checkbox} checked={options.minifyStyles} onClick={this.onClick.bind(this, "minifyStyles")}>
          {`压缩<style>元素内容`} <Warning />
        </Checkbox>
        <Checkbox className={styles.checkbox} checked={options.collapseGroups} onClick={this.onClick.bind(this, "collapseGroups")}>
          折叠无用的组 <Warning />
        </Checkbox>
      </div>
    );
  }
}
export default Options;
