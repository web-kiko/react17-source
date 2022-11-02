//初始化
function render(vNode, container) {
    let newDom = createDOM(vNode)
    console.log(newDom);
    //根据虚拟DOM生成真实DOM
    container.appendChild(newDom)
}


function createDOM(vNode) {
    //如果是文本类型的，就直接创建文本节点，也是递归的出口
    if (Object(vNode) !== vNode) {
        return document.createTextNode(vNode)
    }

    let { type, props } = vNode
    //真实dom
    let DOM

    if (typeof type === "function") {
        if (type.isClassComponent) {       //判断是类式组件还是函数式组件，分别处理
            return handleClassComponent(vNode)
        }
        return handleFunctionComponent(vNode)
    } else {
        DOM = document.createElement(type)
    }

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

function handleClassComponent(vNode) {     //对于类式组件
    let { type, props } = vNode
    let classInstance = new type(props)
    let realvNode = classInstance.render()    //render的返回值才虚拟DOM
    return createDOM(realvNode)
}


function handleFunctionComponent(vNode) {
    let { type, props } = vNode
    let realvNode = type(props)       //函数执行的返回值就是虚拟DOM
    return createDOM(realvNode)
}


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

function handleChildren(DOM, children) {
    if (children instanceof Array) {
        children.forEach(child => render(child, DOM))
    } else {
        render(children, DOM)
    }
}


const ReactDOM = {
    render
}

export default ReactDOM