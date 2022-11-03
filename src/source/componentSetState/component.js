
/*
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-11-02 12:19:27
 * @LastEditors: kiko
 * @LastEditTime: 2022-11-03 19:45:08
 */
class Component {
    static isClassComponent = true //静态属性，表示这个是类式组件

    constructor(props) {
        this.props = props
        this.state = {}
        //创建一个跟新器每个类都是一个实例都有updater（）更新器
        this.updater = new Updater(this)
    }
    //定义setState
    setState(partialState, callback) {
        this.updater.addState(partialState, callback)
    }
    //调用及更新，即使state
    forceUpdate() {
        console.log("我应该刷新了");
    }
}

class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance //保存类的实例以便获取vNode
        this.paddingState = [] //保存将要更新的队列
        this.callbacks = [] //保存将要将要执行的回调函数比如setState的第二个参数
    }
    //添加数据
    addState(partialState, callback) {
        this.paddingState.push(partialState) //将更新的状态放入队列
        if (typeof callback === 'function') {
            this.callbacks.push(callback) //将有回调函数放入队列
        }
        //触发更新
        this.emitUpdate()
    }
    //更新数据
    emitUpdate() {
        //更新组件
        this.updateComponent()
    }
    //更新组件
    updateComponent() {
        let {
            paddingState,
            classInstance
        } = this //获取数据然后跟新组件
        if (paddingState.length > 0) {
            shouldUpdate(classInstance, this.getState()) //有等待的更新则跟新
        }
    }
    //根据老状态和paddingState这个队列来跟新state，就相当于之前reduce
    getState() {
        let {
            paddingState,
            classInstance,
            callbacks
        } = this //classInstance实例
        let {
            state
        } = classInstance //从组件中获取老的state

        //遍历paddingState返回最新的状态
        const computedState =paddingState.reduce((newState,currentItem)=>{
            if(typeof currentItem ==="function"){
                //如果是一个函数
                return {...newState,...currentItem(state)}
            }else{
                return {...newState,...currentItem }
            }
        },state)
        callbacks.forEach(item => {item()}); //回调函数也一并执行
        //清空数据和返回最新state
        this.paddingState.length =[]
        this.callbacks = []
        return computedState
    }

}
function shouldUpdate(classInstance, nextState) {
    classInstance.state = nextState //拿到真正修改实例的state
    //实现组件更新
    classInstance.forceUpdate() //调用实例的updateComponent

}

export default Component


