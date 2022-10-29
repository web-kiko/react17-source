/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-26 16:54:33
 * @LastEditors: kiko
 * @LastEditTime: 2022-10-29 16:24:04
 */
import React from 'react';
import ReactDOM from 'react-dom';

//let element1 =<h1 className='title' style={{color:'red'}}>hello react </h1>

//jsx通过babel转化成React.createElement的方法而他的返回值就是VNode
let element2 =React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello react ");
console.log(element2);
//挂在
ReactDOM.render(
  // element1,
  element2,
  document.getElementById("root"));