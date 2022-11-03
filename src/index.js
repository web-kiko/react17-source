/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-26 16:54:33
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-03 19:23:22
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

/* import React from "./source/vNode/react";
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
); */



//类组件的具体实现和组件更新setState

import React from "./source/componentSetState/react";
import ReactDOM from "./source/componentSetState/react-dom";


class MountClassComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num:0
    }
  }

  handleClick = () =>{
    //类组件改变state状态只有一种方法就是setState（）
    this.setState({num:this.state.num+1})
    console.log('第一次setState',this.state)//0
    this.setState({num:this.state.num+1})
    console.log('第二次setState',this.state);//0
    this.setState({num:this.state.num+1})
    console.log('第三次setState',this.state)//0
    setTimeout(() => {
      this.setState({ num: this.state.num + 1 })
      console.log('第一次setState',this.state) //2
      this.setState({ num: this.state.num + 1 })
      console.log('第二次setState',this.state) //3
      this.setState({ num: this.state.num + 1 })
      console.log('第三次setState',this.state) //4
    })

  }
  render() {
    return (
      <div>
        <h1 className="title1" >类组件表示:{this.state.num}</h1>
      <button onClick={this.handleClick}> + </button>
      </div>
    );
  }
}

let jsx = (
  <div>
    <MountClassComponent  name="还有钱" />
  </div>
);

console.log(jsx);

ReactDOM.render(jsx, document.getElementById("root"));