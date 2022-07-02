import Block from "dxc-flex";
import React from "react";
import styles from "./Header.css";
import Githup from "./Githup";
class Header extends React.PureComponent {
  render() {
    return (
      <Block vertical='center' className={styles.Header}>
        <div>SVG to React</div>
        <div style={{ flex: 1 }}></div>
        <Githup href='https://github.com/dxcweb/svg-to-react' />
      </Block>
    );
  }
}
export default Header;
