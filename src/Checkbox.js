import React from "react";
import styles from "./Checkbox.css";
import classNames from "classnames/bind";
import Block from "dxc-flex";
const cx = classNames.bind(styles);
class Checkbox extends React.PureComponent {
  render() {
    const { children, checked, onClick, className } = this.props;
    return (
      <div onClick={onClick} className={cx("checkbox_wp", className)}>
        <div className={cx("checkbox", { checked })}></div>
        <Block vertical='center'>{children}</Block>
      </div>
    );
  }
}
export default Checkbox;
