/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-26 16:54:33
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-02 13:57:10
 */
import React from "./source/react";
import ReactDOM from "./source/react-dom";

class MyClassCmp extends React.Component {
  render() {
    return (
      <div className="class_2" >类组件表示:{this.props.name}</div>
    );
  }

}

function MyFuncCmp(props) {
  return <div className="class_1" >函数组件表示:{props.name}</div>;
}


let jsx = (
  <div>
    <h1 >你好</h1>
    <div className="class_0" style={{color:"red"}} key="1">前端小伙子</div>
    <MyFuncCmp name="真帅" />
    <MyClassCmp name="还有钱" />
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
//   React.createElement(MyFuncCmp, {
//     name: "真帅"
// }), 
//   React.createElement(MyClassCmp, {
//   name: "还有钱"
// }));
console.log(jsx);

ReactDOM.render(jsx, document.getElementById("root"));