import React from "react";
import styles from "./Githup.css";
import GithupIcon from "./GithupIcon.png";
import Block from "dxc-flex";
class Githup extends React.PureComponent {
  render() {
    return (
      <a href={this.props.href} target='_blank' rel='noopener noreferrer'>
        <Block vertical='center' horizontal='center' className={styles.Githup}>
          <img src={GithupIcon} alt='' />
          Star
        </Block>
      </a>
    );
  }
}
export default Githup;
