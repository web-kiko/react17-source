<!--
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-27 20:40:35
 * @LastEditors: kiko
 * @LastEditTime: 2022-10-29 13:48:48
-->
# virtual Dom

一句话概括就是，用 js 对象表示 dom 信息和结构，更新时重新渲染更新后的对象对应的 dom，这个对象就是 React.createElement()的返回结果

virtual Dom 是一种编程方式，它以对象的形式保存在内存中，它描述了我们 dom 的必要信息，并且用类似 react-dom 等模块与真实 dom 同步，这一过程也叫协调(reconciler)，这种方式可以声明式的渲染相应的 ui 状态，让我们从 dom 操作中解放出来，在 react 中是以 fiber 树的形式存放组件树的相关信息，在更新时可以增量渲染相关 dom，所以 fiber 也是 virtual Dom 实现的一部分

为什么要用 virtual Dom

大量的 dom 操作慢，很小的更新都有可能引起页面的重新排列，js 对象优于在内存中，处理起来更快，可以通过 diff 算法比较新老 virtual Dom 的差异，并且批量、异步、最小化的执行 dom 的变更，以提高性能

另外就是可以跨平台，jsx --> ReactElement 对象 --> 真实节点，有中间层的存在，就可以在操作真实节点之前进行对应的处理，处理的结果反映到真实节点上，这个真实节点可以是浏览器环境，也可以是 Native 环境

virtual Dom 真的快吗？其实 virtual Dom 只是在更新的时候快，在应用初始的时候不一定快。

下面我们加代码和图片解释一下


![虚拟dom](https://s2.loli.net/2022/10/27/exvshAEXy2BkzlU.png)
