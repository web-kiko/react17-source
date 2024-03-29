# react源码开篇
在真正的代码学习之前，我们需要在大脑中有一个react源码的地图，知道react渲染的大致流程和框架，这样才能从上帝视角看react是怎么更新的，来吧！少年卷起来
![react总体流程图01](https://s2.loli.net/2022/10/27/PrX6JLYRmpdfnhx.png)
![react总体流程图02](https://s2.loli.net/2022/10/27/9Mw3gZFhkmlKXTS.png)

react的核心可以用ui=fn(state)来表示，更详细可以用

const state = reconcile(update);
const UI = commit(state);

上面的fn可以分为如下一个部分：

Scheduler（调度器）： 排序优先级，让优先级高的任务先进行reconcile
Reconciler（协调器）： 找出哪些节点发生了改变，并打上不同的Flags（旧版本react叫Tag）
Renderer（渲染器）： 将Reconciler中打好标签的节点渲染到视图上

为了让大家有个直观的理解,废话不多说,直接上图开整
![image text](https://s2.loli.net/2022/10/27/fJLsgWrBj46lbad.png)

# Scheduler

Scheduler的作用是调度任务，react15没有Scheduler这部分，所以所有任务没有优先级，也不能中断，只能同步执行。

我们知道了要实现异步可中断的更新，需要浏览器指定一个时间，如果没有时间剩余了就需要暂停任务，requestIdleCallback貌似是个不错的选择，但是它存在兼容和触发不稳定的原因，react17中采用MessageChannel来实现。

在`Scheduler`中的每的每个任务的优先级使用过期时间表示的，如果一个任务的过期时间离现在很近，说明它马上就要过期了，优先级很高，如果过期时间很长，那它的优先级就低，没有过期的任务存放在`timerQueue`中，过期的任务存放在`taskQueue`中，`timerQueue`和`timerQueue`都是小顶堆，所以peek取出来的都是离现在时间最近也就是优先级最高的那个任务，然后优先执行它。

react之前的版本用`expirationTime`属性代表优先级，该优先级和IO不能很好的搭配工作（io的优先级高于cpu的优先级），现在有了更加细粒度的优先级表示方法Lane，Lane用二进制位表示优先级，二进制中的1表示位置，同一个二进制数可以有多个相同优先级的位，这就可以表示‘批’的概念，而且二进制方便计算。

这好比赛车比赛，在比赛开始的时候会分配一个赛道，比赛开始之后大家都会抢内圈的赛道（react中就是抢优先级高的Lane），比赛的尾声，最后一名赛车如果落后了很多，它也会跑到内圈的赛道，最后到达目的地（对应react中就是饥饿问题，低优先级的任务如果被高优先级的任务一直打断，到了它的过期时间，它也会变成高优先级）

Lane的二进制位如下，1的bits越多，优先级越低


export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;

export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncLane: Lane = /*                        */ 
0b0000000000000000000000000000001;

export const SyncBatchedLane: Lane = /*                 */ 0b0000000000000000000000000000010;

export const InputDiscreteHydrationLane: Lane = /*      */ 0b0000000000000000000000000000100;

const InputDiscreteLanes: Lanes = /*                    */ 0b0000000000000000000000000011000;

const InputContinuousHydrationLane: Lane = /*           */ 0b0000000000000000000000000100000;

const InputContinuousLanes: Lanes = /*                  */ 0b0000000000000000000000011000000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000100000000;

export const DefaultLanes: Lanes = /*                   */ 0b0000000000000000000111000000000;

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000001000000000000;

const TransitionLanes: Lanes = /*                       */ 0b0000000001111111110000000000000;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;


# reconcile

Reconciler发生在render阶段，render阶段会分别为节点执行`beginWork`和`completeWork`（后面会讲），或者计算state，对比节点的差异，为节点赋值相应的`effectFlags`（对应dom节点的增删改）

协调器是在render阶段工作的，简单一句话概括就是Reconciler会创建或者更新Fiber节点。在mount的时候会根据jsx生成Fiber对象，在update的时候会根据最新的state形成的jsx对象和current Fiber树对比构建`workInProgress Fiber`树，这个对比的过程就是diff算法。

diff算法发生在render阶段的`reconcileChildFibers`函数中，diff算法分为单节点的diff和多节点的diff（例如一个节点中包含多个子节点就属于多节点的diff），单节点会根据节点的key和type，props等来判断节点是复用还是直接新创建节点，多节点diff会涉及节点的增删和节点位置的变化，详细见第9章。

reconcile时会在这些Fiber上打上Flags标签，在commit阶段把这些标签应用到真实dom上，这些标签代表节点的增删改。如


export const Placement = /*             */ 0b0000000000010; 

export const Update = /*                */ 0b0000000000100;

export const PlacementAndUpdate = /*    */ 0b0000000000110;

export const Deletion = /*              */ 0b0000000001000;


render阶段遍历Fiber树类似dfs的过程，‘捕获’阶段发生在beginWork函数中，该函数做的主要工作是创建Fiber节点，计算state和diff算法，‘冒泡’阶段发生在completeWork中，该函数主要是做一些收尾工作，例如处理节点的props、和形成一条effectList的链表，该链表是被标记了更新的节点形成的链表

# renderer

Renderer发生在commit阶段，commit阶段遍历effectList执行对应的dom操作或部分生命周期。

Renderer是在commit阶段工作的，commit阶段会遍历render阶段形成的effectList，并执行真实dom节点的操作和一些生命周期，不同平台对应的Renderer不同，例如浏览器对应的就是react-dom。

commit阶段发生在commitRoot函数中，该函数主要遍历effectList，分别用三个函数来处理effectList上的节点，这三个函数是`commitBeforeMutationEffects`、`commitMutationEffects`、`commitLayoutEffects`，他们主要做的事情如下，后面会详细讲解，现在在大脑里有一个结构就行

# jsx
jsx是js语言的扩展，react通过babel词法解析（具体怎么转换可以查阅babel相关插件），将jsx转换成React.createElement，React.createElement方法返回virtual-dom对象（内存中用来描述dom阶段的对象），所有jsx本质上就是React.createElement的语法糖，它能声明式的编写我们想要组件呈现出什么样的ui效果。

我们可以把React的核心精简后变成` const React = { createElement, Component }` 

React.createElement：创建虚拟DOM,

React.Component：实现自定义组件,

ReactDOM.render：渲染真实DOM,


先让图片大概解释下VNode是如何工作的吧下一章就然我们一起探究React.createElement，ReactDOM.render究竟是怎么回事吧
![虚拟dom](https://s2.loli.net/2022/10/27/exvshAEXy2BkzlU.png)

# 最后
伙计你还能够看的下去吗？现在只是刚开头，坚持下去你也会是牛逼哄哄的人员,欲知后事如何,且看下集（virtual Dom篇）
