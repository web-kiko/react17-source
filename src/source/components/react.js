/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-11-02 12:18:06
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-02 12:42:25
 */
import { REACT_ELEMENT } from "./static"
import Component from "./component"

function createElement(type, config, children){   // 标签类别  config   标签内容
    let key = null, ref = null

    if(config){
        key = config.key
        ref = config.ref
        //删除属性
        delete config.key
        delete config.ref
    }

    let props = {...config}

    if(arguments.length > 3){
        props.children = Array.from(arguments).slice(2)
    }else if(arguments.length === 3){
        props.children = children
    }


    return {
        $$typeof: REACT_ELEMENT,
        type,
        ref,
        key,
        props,
    }
}

const React = {
    createElement,
    Component       //class Xx extends React.Component
}

export default React