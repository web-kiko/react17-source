/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-11-02 12:19:27
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-03 14:25:00
 */

class Component {
    static isClassComponent = true    //静态属性，表示这个是类式组件
    
    constructor(props){
        this.props = props
    }
    setState(partialState) {
        this.state = { ...this.state, ...partialState };
        this.updateDom();
    }
    updateDom() {
        // 找到组件挂载的元素，也就是父元素
        // 重新生成组件的DOM，然后替换掉 现在的DOM，就更新啦
        const curDom = this.curRenderVdom.dom;
        const parentNode = curDom.parentNode;
    
        console.log('setState', this.curRenderVdom, curDom);
    
        // render是类组件必须有的，返回JSX，本质就是React.createElement()，返回值跟参数七七八八，也是有{type:class xx,props:{}}
        const newVdom = this.render();
        const newDom = createDOM(newVdom);
    
        // 这里注意，需要手动将curRenderVdom替换
        this.curRenderVdom = newVdom;
    
        // 替换
        parentNode.replaceChild(newDom, curDom);
    }
}

export default Component