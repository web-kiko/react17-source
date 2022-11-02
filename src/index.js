/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-26 16:54:33
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-02 17:16:48
 */
import React from "./source/react";
import ReactDOM from "./source/react-dom";

function MountFunctionComponent(props) {
  return <div className="title2" >函数组件表示:{props.name}</div>;
}

class MountClassComponent extends React.Component {
  render() {
    return (
      <div className="title1" >类组件表示:{this.props.name}</div>
    );
  }

}


let jsx = (
  <div>
    <h1 >你好</h1>
    <div className="title" style={{color:"red"}} key="1">前端小伙子</div>
    <MountFunctionComponent name="真帅" />
    <MountClassComponent  name="还有钱" />
  </div>
);


// let jsx = React.createElement("div", null,
//   React.createElement("h1", null, "你好"),
//   React.createElement("div", {
//     className: "class_0",
//     style: {
//     color: "red"
//   },
//   key: "1"
// }, "前端小伙子"), 
//   React.createElement(MountFunctionComponent, {
//     name: "真帅"
// }), 
//   React.createElement(MountClassComponent, {
//   name: "还有钱"
// }));
console.log(jsx);

ReactDOM.render(jsx, document.getElementById("root"));