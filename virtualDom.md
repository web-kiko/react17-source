<!--
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2023-02-16 16:19:17
 * @LastEditors: kiko
 * @LastEditTime: 2023-02-19 23:40:20
-->
# 剖析 React 源码：先热个身

这是我的 React 源码解读课的第一篇文章，首先来说说为啥要写这个系列文章：

- 现在工作中基本都用 React 了，由此想了解下内部原理
- 市面上 Vue 的源码解读数不胜数，但是反观 React 相关的却寥寥无几，也是因为 React 源码难度较高，因此我想来攻克这个难题
- 自己觉得看懂并不一定看懂了，写出来让读者看懂才是真懂了，因此我要把我读懂的东西写出来

React源码讲解我会以**React 版本为 17**给大家讲解一下我理解的东西

```!
开始进入正文前先说下这个系列中我的行文思路：1. 代码尽量通过图片展示，既美观又方便阅读，反正不需要大家复制代码。2. 文章中只会讲我认为重要或者有意思的代码，对于其他代码请自行阅读我的仓库，反正已经注释好代码了。3. 对于流程长的函数调用会使用流程图的方式来总结。4. 不会干巴巴的只讲代码，会结合实际来聊聊这些 API 能帮助我们解决什么问题。

# React.createElement

大家在写 React 代码的时候肯定写过 JSX，但是为什么一旦使用 JSX 就必须引入 React 呢？

这是因为我们的 JSX 代码会被 Babel 编译为 `React.createElement`，不引入 React 的话就不能使用 `React.createElement` 了。

# jsx处理机制

第一步：我们把jsx语法，先编译成虚拟Dom对象[vDOM]

    虚拟DOM对象:框架构建自己内部的一套体系（对象的相关成员都是有React内部规定的）,基于这写成员描述出，我们所构建视图中DOM节点的相关特征，

    @1.基于babel-preset-react-app 把jsx编译成`react.createElement()`这种方式！！只要是元素节点必须是react.createElement

    React.createElement(ele,props,...children)

      ele:元素标签名（组件）

      props:元素属性集合（对象）如果没有任何属性，就返回null

      children:第三个参数，都是当前元素的子节点


    @2.再把createElement方法执行，创建出虚拟DOM对象，也成为jsx对象，react对象

```jsx
      vDOM={
        $$typeof:Symbol(react.element),
        ref: null
        key:null
        type:标签名（组件）
        props:{
            children:子节点信息，没有节点就没有这个属性，属性可能是一个或者多个，一个则为对象多个是数组形式的
        }
```

第二不：再把虚拟DOM渲染成真实DOM

他是基于ReactDOM.render方法处理的

  V16是基于容器
  ```jsx
  ReactDOM.render{
    <>XXX</>,
    document.getElementById('root')
  }
```
  V18是基于root对象
  ```jsx
  const root=ReactDOM.createRoot( document.getElementById('root'));

  root.render{
    <>xxx</>
  }
  ```


补充部分:第一次渲染视图是从VDOM->真实DOM，但是后期视图更新需要经过DOM_DIFF算法进行比较，计算出补丁包PATCH(视图差异的部分)，然后渲染把补丁包渲染出来