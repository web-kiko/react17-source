<!--
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2023-02-16 16:19:17
 * @LastEditors: kiko
 * @LastEditTime: 2023-02-18 01:14:55
-->
jsx处理机制

第一步：我们把jsx语法，先编译成虚拟Dom对象[vDOM]
    虚拟DOM对象:框架构建自己内部的一套体系（对象的相关成员都是有React内部规定的）,基于这写成员描述出，我们所构建视图中DOM节点的相关特征，

    @1.基于babel-preset-react-app 把jsx编译成react.createElement()这种方式！！只要是元素节点必须是react.createElement
    React.createElement(ele,props,...children)
      ele:元素标签名（组件）
      props:元素属性集合（对象）如果没有任何属性，就返回null
      children:第三个参数，都是当前元素的子节点

    @2.再把createElement方法执行，创建出虚拟DOM对象，也成为jsx对象，react对象
      vDOM={
        $$typeof:Symbol(react.element),
        ref: null
        key:null
        type:标签名（组件）
        props:{
            children:子节点信息，没有节点就没有这个属性，属性可能是一个或者多个，一个则为对象多个是数组形式的
        }
      }
第二不：再把虚拟DOM渲染成真实DOM
补充部分:第一次渲染视图是从VDOM->真实DOM，但是后期视图更新需要经过DOM_DIFF算法进行比较，计算出补丁包PATCH(视图差异的部分)，然后渲染把补丁包渲染出来