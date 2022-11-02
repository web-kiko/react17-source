/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-11-02 12:19:27
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-02 21:45:05
 */

import {twoVNode }from "./react-dom"
// 更新器获取到最新的数据
class updater {
    constructor(classInstance) {
        this.classInstance = classInstance //保存类的实例以便获取vNode
        this.paddingState = [] //用来保存数据的
    }
    //添加数据
    addState(partialState) {
        this.paddingState.push(partialState)
        //更新数据
        this.emitUpdate()
    }
    //更新数据
    emitUpdate() {
        //更新组件
        this.updateComponent()
    }
    //更新组件
    updateComponent() {
        //获取数据然后跟新组件
        let { paddingState , classInstance } =this
        if(paddingState.length > 0){
            shouldUpdate(classInstance,this.getState())
        }
    }
        //获取到最新的状态
        getState(){
            let { paddingState , classInstance } =this //classInstance实例
            let { state } = classInstance //获取到旧的数据
            paddingState.forEach(nextState=>{
                state ={ ...state, nextState} //获取到最新的数据
            })
            //清空数据和返回最新state
            paddingState.length =0
            return state
        }

}

/**
 *  实现react组件更新
 *  原理就是:跟新的时候获取最新的状态，在把这个状态变成vNode（render方法可以实现）再把这个vNode变成真实dom,再用这个真实dom替换掉以前的真实dom
 */

function shouldUpdate( classInstance, nextState) {
    classInstance.state =nextState  //拿到最新数据
    //实现组件更新
    classInstance.forceUpdate()



}
class Component {
    static isClassComponent = true //静态属性，表示这个是类式组件

    constructor(props) {
        this.props = props
        this.state = {}
        //创建一个跟新器
        this.updater = new this.updater(this)
    }
    setState(partialState) {
        updater.addState(partialState)
    }
    //实现组件更新
    forceUpdate(){
        let newVNode = this.render()
        let oldVNode =  //初始化有旧的vNode

        twoVNode() //需要3个参数 1.旧的真实元素 2.旧的vNode  3.新的vNode
    }
}

export default Component