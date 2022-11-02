
//初始化
function render(VDOM, container){
    let DOM = createDOM(VDOM)
    console.log(DOM);
    //根据虚拟DOM生成真实DOM
    container.appendChild(DOM)
}


function createDOM(VDOM){

    if(Object(VDOM) !== VDOM){
        return document.createTextNode(VDOM)
    }

    let {type, props} = VDOM

    let DOM =null
    
    if(typeof type === "function"){          
        if(type.isClassComponent){          //判断是类式组件还是函数式组件，分别处理
            return handleClassComponent(VDOM)
        }
        return handleFunctionComponent(VDOM)
    }else{
        DOM = document.createElement(type)
    } 
    
    updateProps(DOM, null, props)

    let {children} = props
    if(children){
        handleChildren(DOM, children)
    }

    return DOM
}

function handleClassComponent(VDOM){     //对于类式组件
    let {type, props} = VDOM
    let classInstance = new type(props)
    let realVDOM = classInstance.render()    //render()的返回值才是JSX，也就是虚拟DOM
    return createDOM(realVDOM)
}


function handleFunctionComponent(VDOM){
    let {type, props} = VDOM
    let realVDOM = type(props)       //函数执行的返回值就是虚拟DOM
    return createDOM(realVDOM)
}


function updateProps(DOM, oldProps, newProps){     //props:{children, className, style, onXXX}
    if(newProps){
        for(let key in newProps){
            if(key === "children"){
                continue
            }else if(key === "style"){
                let styleObject = newProps[key]
                for(let item in styleObject){
                    DOM.style[item] = styleObject[item]
                }
    
            }else if(key.startsWith("on")){
                DOM[key.toLocaleLowerCase()] = newProps[key]
            }else{
                DOM[key] = newProps[key]
            }
        }
    }
    

    if(oldProps){
        for(let key in oldProps){
            if(!newProps[key]) DOM[key] = null
        }
    }
}

function handleChildren(DOM, children){
    if(children instanceof Array){
        children.forEach(child => render(child, DOM) )
    }else{
        render(children, DOM)
    }
}


const ReactDOM = {
    render
}

export default ReactDOM