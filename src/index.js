/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-26 16:54:33
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-01 21:36:47
 */

//引入自己的react和react-dom
import React from "./react"
import ReactDOM from "./react-dom"


//jsx语法
let element1 =React.createElement("h1", {
  className: "title",
  style: {
    color: "red"
  },
  key: "1"
}, "hello, react", React.createElement("span", {style:{color:'pink'}}, "this is span"));

ReactDOM.render(element1, document.getElementById("root"))
