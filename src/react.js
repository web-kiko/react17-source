import { REACT_ELEMENT } from "./static"

/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-28 21:05:22
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-01 22:32:06
 */
function createElement(type, config, children){
    let key = null, ref = null

    if(config){
        key = config.key
        ref = config.ref
        //key,ref不在props
        delete config.key
        delete config.ref
    }

    let props = {...config}

    if(arguments.length > 3){  //说明children有多个，应该封装成数组
        let arr = [...arguments]
        props.children = arr.slice(2)
    }else if(arguments.length === 3){//说明只有一个子节点，直接添加
        props.children = children
    }

    return {
        $$typeof: REACT_ELEMENT,
        props,
        key, 
        ref,
        type
    }
}

const React = {
    createElement,
}

export default React