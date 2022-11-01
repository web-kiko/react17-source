/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-11-01 20:00:37
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-01 22:32:14
 */
import { REACT_TEXT } from "./static"

//初始化
function render(VNode, container) {
    mount(VNode, container)
}

function mount(VNode, container){
    let newDom = createDOM(VNode)       //根据虚拟DOM生成真实DOM
    container.appendChild(newDom)      //将真实DOM挂载到了页面
}

function createDOM(VNode){ //VNode=>真实DOM
    let {type,  props} = VNode
    let dom //真实dom
    //判断类型是文本还是元素
    if(type===REACT_TEXT){
        dom = document.createTextNode(type)  //如果是文本，就直接创建文本节点
    }else{
        dom = document.createElement(type)   //如果是元素，就直接创建元素
    } 
    //处理props
    if(props){
        updateProps(dom, null, props)
            //处理children
        let children = props.children
        if(children){           // <span></span>  这种情况的话 props:  
        handleChildren(dom, children)
    }
    }


    return dom
}


//更新属性
function updateProps(dom, oldProps, newProps){

    for(let key in newProps){//处理props时候注意children, className, style
        if(key === "children"){
            continue
        }else if(key === "style"){
            let styleObject = newProps[key]
            for(let item in styleObject){
                //给真实dom添加样式
                dom.style[key] = styleObject[item]
            }
        }else if(key.startsWith("on")){     //说明是绑定的事件
            dom[key.toLocaleLowerCase()] = newProps[key]
        }else{
            dom[key] = newProps[key]
        }
    }

    if(oldProps){           //更新处理。如果旧的属性在新的属性中不存在，那么就删除
        for(let key in oldProps){
            if(!newProps[key])  delete oldProps[key]
        }
    }
}

//处理  children
function handleChildren(dom, children){   
    if(typeof children ==='object' &&children.type){
        mount(children,dom)
    }if( Array.isArray(children)){
        children.forEach( item=> mount(item, dom))
    }
    
}


const ReactDOM={
    render
}
export default ReactDOM