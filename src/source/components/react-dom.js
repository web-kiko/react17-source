//初始化
function render(VNode, container) {
    let newDom = createDOM(VNode)
    console.log(newDom);
    //根据虚拟DOM生成真实DOM
    container.appendChild(newDom)
}

//创建Dom
function createDOM(VNode) {
    //如果是文本类型的，就直接创建文本节点，也是递归的出口
    if (Object(VNode) !== VNode) {
        return document.createTextNode(VNode)
    }

    let { type, props } = VNode
    //真实dom
    let DOM

    if (typeof type === "function") {
        if (type.isClassComponent) {   //判断是类式组件还是函数式组件，分别处理
            return mountClassComponent(VNode) //类组件
        }
        return mountFunctionComponent(VNode) //函数组件
    } else {
        DOM = document.createElement(type)
    }
    // 处理props
    if (props) {
        //更新
        updateProps(DOM, {}, props) //真实dom和旧属性，新属性
        //处理children
        let { children } = props
        if (children) { //span 不显示  写一个handleChildren方法处里children 
            handleChildren(DOM, children)
        }

    }
    return DOM
}

//处理类组件
function mountClassComponent(VNode) {
    let { type, props } = VNode
    let classInstance = new type(props)//类的实例

    let cVNode = classInstance.render()    //获取类组件VNode
    classInstance.oldRenderVNode =cVNode   //为了关联更新时候拿到旧时的
    return createDOM(cVNode)
}

//处理函数组件
function mountFunctionComponent(VNode) {
    let { type, props } = VNode
    let fVNode = type(props)       //函数执行的返回值就是虚拟DOM
    return createDOM(fVNode)
}

//更新props
function updateProps(DOM, oldProps, newProps) {  //props:{children, className, style, onXXX}
    if (newProps) {
        for (let key in newProps) {
            if (key === "children") {
                continue
            } else if (key === "style") {
                let styleObject = newProps[key]
                for (let item in styleObject) {
                    DOM.style[item] = styleObject[item]
                }

            } else if (key.startsWith("on")) {
                DOM[key.toLocaleLowerCase()] = newProps[key]
            } else {
                DOM[key] = newProps[key]
            }
        }
    }

    if (oldProps) {
        for (let key in oldProps) {
            if (!newProps[key]) DOM[key] = null
        }
    }
}

//更新children
function handleChildren(DOM, children) {
    
    if (children instanceof Array) {
        children.forEach(child => render(child, DOM))
    } else {
        render(children, DOM)
    }
}


//实现更新
export function twoVNode (parentDom,oldVNode,newVNode){
    //获取到新的真实dom
    let newDom =createDOM(newVNode)
    let oldDom =createDOM(oldVNode)
    //更新
    parentDom.replaceChild(newVNode,oldVNode)


}
const ReactDOM = {
    render
}

export default ReactDOM