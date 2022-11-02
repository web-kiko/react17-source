/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-26 16:54:33
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-02 23:48:56
 */





//jsx的实现

/* import React from "react";
import ReactDOM from "react-dom";

let jsx = React.createElement("div", null,
  React.createElement("h1", null, "你好"),
  React.createElement("div", {
    className: "class_0",
    style: {
    color: "red"
  },
  key: "1"
}, "前端小伙子"), 
  React.createElement(MountFunctionComponent, {
    name: "真帅"
}), 
  React.createElement(MountClassComponent, {
  name: "还有钱"
}));

 */




//虚拟dom的创建和render的实现，并对函数组件和类组件进行了简单的处理

/* 
import React from "./source/vNode/react";
import ReactDOM from "./source/vNode/react-dom";

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
 */




//类组件的具体实现和组件更新

import React from "react";
import ReactDOM from "react-dom";

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
    <MountClassComponent  name="还有钱" />
  </div>
);


console.log(jsx);

ReactDOM.render(jsx, document.getElementById("root"));