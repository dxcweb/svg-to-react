import React from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/jsx/jsx";
import transform from "./transform";
import Header from "./Header";
import Block from "dxc-flex";
import Options from "./Options";
import Footer from "./Footer";
import styles from "./App.css";
import data from "./data";
import ClipboardJS from "clipboard";
import message from "dxc-message";
import Upload from "dxc-upload";
class App extends React.PureComponent {
  state = {};
  constructor(props) {
    super(props);

    this.storageKey = "dxc-svg-to-react";
    const storage = localStorage.getItem(this.storageKey);
    let options = {
      memo: true,
      removeXMLNS: true,
      collapseGroups: false,
      removeEmptyAttrs: false,
      minifyStyles: false,
    };
    if (storage && storage !== "") {
      const storageOptions = JSON.parse(storage);
      if (typeof storageOptions === "object") {
        options = storageOptions;
      }
    }
    this.state = {
      options,
    };
  }
  componentDidMount() {
    this.inputEdt = CodeMirror(this.input, {
      value: data,
      lineNumbers: true,
      mode: "jsx",
    });
    this.inputEdt.on("change", this.inputChange);
    this.outputEdt = CodeMirror(this.output, {
      value: "",
      readOnly: true,
      lineNumbers: true,
      mode: "jsx",
    });
    const clipboard = new ClipboardJS("#output");
    clipboard.on("success", (e) => {
      message.success("复制成功", 2000);
    });
    this.inputVal = data;
    this.transform();
  }

  inputChange = (e) => {
    const vlaue = e.getValue();
    this.inputVal = vlaue;
    this.transform();
  };
  transform = () => {
    const { options } = this.state;
    const output = transform(this.inputVal, options);
    this.outputEdt.setValue(output);
    this.setState({ output });
  };
  onPaste = () => {
    navigator.clipboard.readText().then((clipText) => {
      this.inputEdt.setValue(clipText);
    });
  };
  onChangeOptions = (state) => {
    const { options } = this.state;
    const newOptions = { ...options, ...state };
    localStorage.setItem(this.storageKey, JSON.stringify(newOptions));
    this.setState({ options: newOptions }, this.transform);
  };
  onUpload = (files) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      this.inputEdt.setValue(reader.result);
    };
    reader.readAsText(files[0]);
  };
  render() {
    const { output, options } = this.state;
    return (
      <Block layout='vertical' style={{ height: "100vh" }}>
        <Header />
        <Block style={{ flex: 1 }}>
          <div className={styles.OptionsWp}>
            <Block vertical='center' className={styles.title}>
              选项
            </Block>
            <Options options={options} onChange={this.onChangeOptions} />
          </div>
          <div className={styles.inputWp}>
            <Block vertical='center' className={styles.title}>
              <div style={{ flex: 1 }}>SVG</div>
              <Upload accept='image/svg+xml' onChange={this.onUpload}>
                <div className={styles.button}>选择文件</div>
              </Upload>
              {navigator.clipboard ? (
                <div style={{ marginLeft: 15 }} onClick={this.onPaste} className={styles.button}>
                  粘贴
                </div>
              ) : null}
            </Block>
            <div className={styles.editor} ref={(me) => (this.input = me)}></div>
          </div>
          <div className={styles.outputWp}>
            <Block vertical='center' className={styles.title}>
              <div style={{ flex: 1 }}>JSX</div>
              <div id='output' data-clipboard-text={output} className={styles.button}>
                复制
              </div>
            </Block>
            <div className={styles.editor} ref={(me) => (this.output = me)}></div>
          </div>
        </Block>
        <Footer />
      </Block>
    );
  }
}

export default App;
