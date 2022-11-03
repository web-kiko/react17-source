//初始化
function render(vdom, container) {
    // 本质就是挂载，因container本身存在于文档之中，所以挂载操作会触发渲染
    mount(vdom, container);
}

function mount(vdom, container) {
    // 将第一个参数变成真实DOM，插入到第二个参数挂载元素上
    const DOM = createDOM(vdom);
    container.append(DOM);
}

export function createDOM(vdom) {
    const type = getType(vdom);
    const getDom = typeMap.get(type);
    // @ts-ignore
    let DOM = getDom(vdom);
    // vdom和DOM一一对应，这里的vdom是四种类型
    type !== 'text' && (vdom.dom = DOM);
    console.log(vdom);
    return DOM;
}

const typeMap = new Map([
    ['text', handleTextType],
    ['element', handleElementType],
    ['function', handleFunctionType],
    ['class', handleClassType],
]);
// vdom有四种类型
// 1. "直接就是字符串"
const handleTextType = (vdom) => document.createTextNode(vdom || '');
// 2. {type:'div',props:{...}}  type是字符串，组件根元素是原生标签
const handleElementType = (vdom) => createElementDOM(vdom);
// 3. {type:function X(){ return <h1/>},props:{...}}，type是函数，返回值才是vdom
const handleFunctionType = (vdom) => {
    const {
        type: fn,
        props
    } = vdom;
    const vdomReturn = fn(props);
    return createElementDOM(vdomReturn);
};
// 4. {type: class x ...{ render(){return <h1/>} },props:{///}}，type是函数，
// 但是静态属性有isClassComponent，实例的render函数返回值才是vdom
const handleClassType = (vdom) => {
    const {
        type: classFn,
        props
    } = vdom;
    const instance = new classFn(props);
    // 这里将本身的vdom 绑定到实例上（不是vdomReturn，不然找不到curRenderVdom）
    instance.curRenderVdom = vdom;
    console.log('执行');
    const vdomReturn = instance.render(props);
    return createElementDOM(vdomReturn);
};
// 根据vdom得到类型，从而根据类型，调用相应的方法生成真实DOM
const getType = (vdom) => {
    const isTextNode =
        typeof vdom === 'string' || typeof vdom === 'number' || vdom == null;
    if (isTextNode) return 'text';

    const isObject = typeof vdom === 'object';
    const isElementNode = isObject && typeof vdom.type === 'string';
    if (isElementNode) return 'element';

    const isFn = isObject && typeof vdom.type === 'function';
    return isFn && vdom.type.isClassComponent ? 'class' : 'function';
};

function createElementDOM(vdom) {
    const {
        type,
        props
    } = vdom;
    let DOM = document.createElement(type);
    if (props) {
        updateProps(DOM, props);
        const {
            children
        } = props;
        children && updateChildren(DOM, children);
    }
    return DOM;
}
//处理props
function updateProps(DOM, props) {
    // 正常遍历就好，特殊的特殊处理
    for (const key in props) {
        if (key === 'children') continue;
        // 事件处理！！
        if (/on[A-Z]+/.test(key)) {
            DOM[key.toLowerCase()] = props[key];
            continue;
        }
        if (key === 'style') {
            updateStyle(DOM, props[key]);
            continue;
        }
        DOM[key] = props[key];
    }

    function updateStyle(DOM, styleObj) {
        for (const key in styleObj) {
            DOM.style[key] = styleObj[key];
        }
    }
}
//处理children
function updateChildren(DOM, children) {
    // 单个节点，直接插入（挂载）到DOM上; 多个节点，遍历插入
    const isOneChildren = !Array.isArray(children);
    isOneChildren
        ?
        mount(children, DOM) :
        children.forEach((child) => mount(child, DOM));
}

const ReactDOM = {
    render,
};
export default ReactDOM;