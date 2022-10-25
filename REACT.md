# 学习react的方法和常见的问题

怎样学习react源码
作为前端最常用的js库之一，熟悉react源码成了高级或资深前端工程师必备的能力，如果你不想停留在api的使用层面或者想在前端技能的深度上有所突破，那熟悉react源码将是你进步的很好的方式。

react的纯粹体现在它的api上，一切都是围绕setState状态更新进行的，但是内部的逻辑却经历了很大的重构和变化，而且代码量也不小，如果只是从源码文件和函数来阅读，那会很难以理解react的渲染流程。优秀工程师几年时间打造的库，必定有借鉴之处，那么我们应该怎样学习react源码呢。

首先，我们可以从函数调用栈入手，理清react的各个模块的功能和它们调用的顺序，盖房子一样，先搭好架子，对源码有个整体的认识，然后再看每个模块的细节，第一遍的时候切忌纠结每个函数实现的细节，陷入各个函数的深度调用中。其次可以结合一些demo和自己画图理解，react源码中设计大量的链表操作，画图是一个很好的理解指针操作的方式。源码里也有一些英文注释，可以根据注释或者根据此react源码解析文章进行理解。

熟悉react源码并不是一朝一夕的事，想精进自己的技术，必须花时间才行

# 常见面试题（带上问题学习吧）
以下这些问题可能你已经有答案了，但是你能从源码角度回答出来吗。

1.jsx和Fiber有什么关系

2.Fiber是什么，它为什么能提高性能

# hooks
1.为什么hooks不能写在条件判断中

2.useEffect是什么,怎么用,里面的参数代表什么

# 状态/生命周期
1.setState是同步的还是异步的

2.componentWillMount、componentWillMount、componentWillUpdate为什么标记UNSAFE

# 组件

1.react元素$$typeof属性什么

2.react怎么区分Class组件和Function组件

3.函数组件和类组件的相同点和不同点

# 开放性问题

1.说说你对react的理解/请说一下react的渲染过程

2.聊聊react新旧生命周期

3.简述diff算法

4.react有哪些优化手段

5.说说virtual Dom的理解

6.你对合成事件的理解

7.我们写的事件是绑定在dom上么，如果不是绑定在哪里？

8.为什么我们的事件手动绑定this(不是箭头函数的情况)

9.useMemo和useCallback的区别

10.react怎么通过dom元素，找到与之对应的 fiber对象的？


# 1.点击Father组件的div，Child会打印Child吗

function Child() {
    console.log('Child');
    return <div>Child</div>;
    }

function Father(props) {
    const [num, setNum] = React.useState(0);
    return (
        <div onClick={() => {setNum(num + 1)}}>
        {num}
        {props.children}
        </div>
    );
    }
        
        
function App() {
    return (
        <Father>
        <Child/>
        </Father>
    );
    }
        
const rootEl = document.querySelector("#root");
ReactDOM.render(<App/>, rootEl);

# 打印顺序是什么

function Child() {
    useEffect(() => {
        console.log('Child');
    }, [])
    return <h1>child</h1>;
    }
        
function Father() {
    useEffect(() => {
        console.log('Father');
    }, [])
        
    return <Child/>;
    }
        
function App() {
    useEffect(() => {
        console.log('App');
    }, [])
        
    return <Father/>;
    }
# useLayoutEffect/componentDidMount和useEffect的区别是什么

class App extends React.Component {
  componentDidMount() {
    console.log('mount');
  }
}
    
useEffect(() => {
  console.log('useEffect');
}, [])
