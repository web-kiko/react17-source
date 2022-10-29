# virtual Dom

一句话概括就是，用 js 对象表示 dom 信息和结构，更新时重新渲染更新后的对象对应的 dom，这个对象就是 React.createElement()的返回结果

`virtual Dom` 是一种编程方式，它以对象的形式保存在内存中，它描述了我们 dom 的必要信息，并且用类似 react-dom 等模块与真实 dom 同步，这一过程也叫协调(reconciler)，这种方式可以声明式的渲染相应的 ui 状态，让我们从 dom 操作中解放出来，在 react 中是以 fiber 树的形式存放组件树的相关信息，在更新时可以增量渲染相关 dom，所以 fiber 也是 virtual Dom 实现的一部分

为什么要用 virtual Dom

大量的 dom 操作慢，很小的更新都有可能引起页面的重新排列，js 对象优于在内存中，处理起来更快，可以通过 diff 算法比较新老 virtual Dom 的差异，并且批量、异步、最小化的执行 dom 的变更，以提高性能

另外就是可以跨平台，jsx --> ReactElement 对象 --> 真实节点，有中间层的存在，就可以在操作真实节点之前进行对应的处理，处理的结果反映到真实节点上，这个真实节点可以是浏览器环境，也可以是 Native 环境


# 先让我们看看源码是怎么写的吧

我们先解释虚拟dom的创建过程，要聊这个那必然逃不开`React.createElement`方法，[github源码](https://github.com/facebook/react/blob/bcbeb52bf36c6f5ecdad46a48e87cf4354c5a64f/packages/react/src/ReactElement.js#L362)具体代码如下（我删除了dev环境特有的逻辑）:

```jsx
/**
 * 创建并返回给定类型的新ReactElement。
 * See https://reactjs.org/docs/react-api.html#createelement
 */
function createElement(type, config, children) {
  let propName;

  // 创建一个全新的props对象
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // 有传递自定义属性进来吗？有的话就尝试获取ref与key
  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // 保存self和source
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;

    // 剩下的属性都添加到一个新的props属性中。注意是config自身的属性
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // 处理子元素，默认参数第二个之后都是子元素
  const childrenLength = arguments.length - 2;
  // 如果子元素只有一个，直接赋值
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    // 如果是多个，转成数组再赋予给props
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // 处理默认props，不一定有，有才会遍历赋值
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      // 默认值只处理值不是undefined的属性
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 调用真正的React元素创建方法
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

```

代码看着好像有点多，但其实一共就只做了两件事:

1.根据createElement所接收参数config做数据加工与赋值。

2.加工完数据后调用真正的虚拟dom创建API ReactElement

而数据加工部分可分为三步，大家可以对应上面代码理解，其实注释写的也很清晰了

第一步，判断config有没有传，不为null就做处理，步骤分为:

1.1 判断ref、key，__self、__source这些是否存在或者有效，满足条件就分别赋值给前面新建的变量。

1.2 遍历config，并将config自身的属性依次赋值给前面新建props。

第二步，处理子元素。默认从第三个参数开始都是子元素。

2.1 如果子元素只有一个，直接赋值给props.children。

2.2 如果子元素有多个，转成数组后再赋值给props.children。

第三步，处理默认属性`defaultProps`，一个纯粹的标签也可以理解成一个最最最基础的组件，而组件支持 `defaultProps`，所以这一步判断有没有`defaultProps`，如果有同样遍历，并将值不为undefined的部分都拷贝到props对象上。

至此，第一大步全部做完，紧接着调用ReactElement，我们接着看这一块的源码,同样我删掉dev部分的逻辑：

```jsx
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // 这个标签允许我们将其标识为唯一的React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // 元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录负责创建此元素的组件。
    _owner: owner,
  };
  return element;
};

```
这个方法啥也没干，单纯接受我们在上个方法加工后的数据，并将其组装成了一个element对象，也就是我们前文所说的虚拟dom。

过针对这个虚拟dom，我们可以把`$$typeof`: REACT_ELEMENT_TYPE拧出来单独讲讲。我们可以看看它的具体实现

```
export const REACT_ELEMENT_TYPE = Symbol.for('react.element');

```
大家在查看虚拟dom时应该都有发现它的$$typeof定义为Symbol(react.element)，而Symbol一大特性就是标识唯一性，即便两个看着一模一样的Symbol，它们也不会相等。而react之所以这样做，本质也是为了防止xss攻击，防止外部伪造虚拟dom结构。

其次，如果大家有在开发中留意，虚拟dom的不允许修改，哪怕你为这个对象新增属性也不可以，这是因为在ReactElement方法省略的dev代码中，react使用`Object.freeze`冻结了虚拟dom使其无法修改。但实际上我们确实有为虚拟dom添加属性的场景，解决这个问题时我们可以借用顶层React.cloneElement()方法，它会以你传递的虚拟dom为模板克隆并返回一个新的虚拟dom对象，同时这个过程中你可以为其添加新的config

# react中虚拟dom是如何转变成真实dom的

我们来到了本文的最后一个问题，要想搞清这个问题，我们的关注点自然是ReactDOM.render方法了，这个部分比较麻烦，大家跟着我的思路走就行，

看源码我们来到render方法：

```jsx

function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  var root = container._reactRootContainer;
  var fiberRoot;
	// 有fiber的root节点吗？没有就新建
  if (!root) {
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    fiberRoot = root._internalRoot;
    unbatchedUpdates(function () {
      // 核心关注这里
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;

    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}


```
render做的事情其实很简单，验证container是否合法，如果不是一个有效的dom就会抛错，核心逻辑看样子都在`legacyRenderSubtreeIntoContainer`中，根据命名可以推测是将组件子树都渲染到容器元素中。

因为react 16引入了fiber的概念，所以后续其实很多代码就是在创建fiber节点，`legacyRenderSubtreeIntoContainer`一样，它一开始判断有没有root节点（一个fiber对象），很显然我们初次渲染走了新建逻辑，但不管是不是新建，最终都会调用`updateContainer`方法。但此方法没有太多我们需要关注的逻辑，一直往下走，我们会遇到一个很重要的`beginWork`（开始干正事）方法

因为`beginWork`方法做了很重要的一件事，那就是根据你render接收的组件类型，来执行不同的组件更新的方法，毕竟我们可能给render传递一个普通标签，也可能是函数组件或者Class组件，亦或是hooks的memo组件等等

比如我此时定义的P是class组件，于是走了ClassComponent路线，紧接着调`updateClassComponent`更新组件

```jsx
function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
  // 删除了添加context部分的逻辑
	// 获取组件实例
  var instance = workInProgress.stateNode;
  var shouldUpdate;
	// 如果没有实例，那就得创建实例
  if (instance === null) {
    if (current !== null) {
      current.alternate = null;
      workInProgress.alternate = null;

      workInProgress.flags |= Placement;
    }
    // 全体目光向我看齐，看我看我，这里new Class创建组件实例
    constructClassInstance(workInProgress, Component, nextProps);
    // 挂载组件实例
    mountClassInstance(workInProgress, Component, nextProps, renderLanes);
    shouldUpdate = true;
  } else if (current === null) {
    shouldUpdate = resumeMountClassInstance(workInProgress, Component, nextProps, renderLanes);
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress, Component, nextProps, renderLanes);
  }
  // Class组件的收尾工作
  var nextUnitOfWork = finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes);
}

```
在看这段代码前，我们自己也可以提前想象下这个过程，比如Class组件你一定是得new才能得到一个实例，只有拿到实例后才能调用其render方法，拿到其虚拟dom结构，之后再根据结构创建真实dom，添加属性，最后加入到页面。

所以在`updateClassComponent`中，首先会对组件做context相关的处理，这部分代码我删掉了，其余，判断当前组件是否有实例，如果有就去更新实例，如果没有那就创建实例，所以我们聚焦到`constructClassInstance`与`mountClassInstance`、`finishClassComponent`三个方法，看命名就能猜到，前者一定是创造实例，后者是应该是挂载实例前的一些处理，先看第一个方法：

```jsx
function constructClassInstance(workInProgress, ctor, props) {
  // 看我看我，我宣布个事，这里创建了组件实例
  // 验证了前面的推测，这里new了我们的组件，并且传递了当前组件的props以及前面代码加工的context
  var instance = new ctor(props, context);
  var state = workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
  adoptClassInstance(workInProgress, instance);

  // 删除了对于组件生命周期钩子函数的处理，比如很多即将被废弃的钩子，在这里都会被添加 UNSAFE_ 前缀
  //.....

  return instance;
}


```
![image text](https://smms.app/delete/EZY7elI4P8h5mXyf2TdpjrQJcb)

constructClassInstance正如我们推测的一样，这里通过new ctor(props, context)创建了组件实例，除此之外，react后续版本已将部分声明周期钩子标记为不安全，对于钩子命名的加工也在此方法中。

紧接着，我们得到了一个组件实例，接着看`mountClassInstance`方法

```jsx

function mountClassInstance(workInProgress, ctor, newProps, renderLanes) {
	// 此方法主要是对constructClassInstance创建的实例进行数据组装，为其赋予props,state等一系列属性
  var instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;
  initializeUpdateQueue(workInProgress);
  
  // 删除了部分特殊情况下，对于instance的特殊处理逻辑
}

```
虽然命名是挂载，但其实离真正的挂载还远得很，本方法其实是为constructClassInstance创建的组件实例做数据加工，为其赋予props state等一系列属性

在上文代码中，其实还有个`finishClassComponent`方法，此方法在组件自身都准备完善后调用，我们期待已久的render方法处理就在里面：

```jsx

function finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes) {
  var instance = workInProgress.stateNode;
  ReactCurrentOwner$1.current = workInProgress;
  var nextChildren;
  if (didCaptureError && typeof Component.getDerivedStateFromError !== 'function') {
			// ...
  } else {
    {
      setIsRendering(true);
      // 关注点在这，通过调用组件实例的render方法，得到内部的元素
      nextChildren = instance.render();
      setIsRendering(false);
    }
  } 
  workInProgress.memoizedState = instance.state;
  return workInProgress.child;
}


```

在此方法内部，我们通过获取之前创建的组件实例，然后调用了它的render方法，于是成功执行了我们组件P的render方法：

```jsx

render() {
  return <span onClick={this.handleClick}>111</span>;
}

```
需要注意的是，render返回的其实是一个jsx的模板语法，在真正return之前，react还会再次调用生成虚拟dom的逻辑也就是ReactElement方法，将span这一段转变成虚拟dom。

而对于react而言，很明显虚拟dom的span也可能理解成一个最最最基础的组件，所以它会重走`beginWork`这条路线，只是到了组件分类时，这一次会走HostComponent路线，然后触发`updateHostComponent`方法，我们直接跳过相同的流程，之后就会走到`completeWork`方法。

到这里，我们可以理解例子P组件虚拟dom都准备完毕，现在要做的是对于虚拟dom这种最基础的组件做转成真实dom的操作，见如下代码：

```jsx

function completeWork(current, workInProgress, renderLanes) {
  var newProps = workInProgress.pendingProps;
	// 根据tag类型做不同的处理
  switch (workInProgress.tag) {
    // 标签类的基础组件走这条路
    case HostComponent:
      {
        popHostContext(workInProgress);
        var rootContainerInstance = getRootHostContainer();
        var type = workInProgress.type;

        if (current !== null && workInProgress.stateNode != null) {
          // ...
        } else {
          // ...
          } else {
            // 关注点1：创建虚拟dom的实例
            var instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
            appendAllChildren(instance, workInProgress, false, false);
            workInProgress.stateNode = instance; // Certain renderers require commit-time effects for initial mount.
            // 关注点2：初始化实例的子元素
            if (finalizeInitialChildren(instance, type, newProps, rootContainerInstance)) {
              markUpdate(workInProgress);
            }
          }
        }
      }
  }
}


```

可以猜到，虽然同样还是调用createInstance生成实例，但目前咱们的组件是个虚拟dom对象啊，一个普通的span标签，所以接下来一定会创建最基本的span节点，代码如下：

```jsx

function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
	// 根据span创建节点，调用createElement方法
  var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
  precacheFiberNode(internalInstanceHandle, domElement);
  // 将虚拟dom span的属性添加到span节点上
  updateFiberProps(domElement, props);
  return domElement;
}

// createElement具体实现
function createElement(type, props, rootContainerElement, parentNamespace) {
  var isCustomComponentTag; 
  var ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement);
  var domElement;
  var namespaceURI = parentNamespace;

  if (namespaceURI === HTML_NAMESPACE$1) {
    if (type === 'script') {
      var div = ownerDocument.createElement('div');
      div.innerHTML = '<script><' + '/script>';
      var firstChild = div.firstChild;
      domElement = div.removeChild(firstChild);
    } else if (typeof props.is === 'string') {
      domElement = ownerDocument.createElement(type, {
        is: props.is
      });
    } else {
      // 在这里，真实dom span节点创建完毕
      domElement = ownerDocument.createElement(type); 
      if (type === 'select') {
        var node = domElement;

        if (props.multiple) {
          node.multiple = true;
        } else if (props.size) {
          node.size = props.size;
        }
      }
    }
  } else {
    domElement = ownerDocument.createElementNS(namespaceURI, type);
  }
  return domElement;
}


```

在createElement方法中，react会根据你的标签类型来决定怎么创建dom，比如如果你是script，那就创建一个div用于包裹一个script标签。而我们的span很显然就是通过ownerDocument.createElement(type)创建，如下图:
![image text](https://smms.app/delete/ACSmJtpHWOIU2guxk8XolLaQF9)


创建完成后，此时的span节点还是一个啥都没有的空span，所以通过`updateFiberProps`将还未加工的span的子节点以及其它属性强行赋予给span，在之后会进一步加工，之后返回我们的span：
![image text](https://smms.app/delete/2f5ng36Palc49UeS8RXqITwvCm)

然后来到`finalizeInitialChildren`方法，这里开始对创建的span节点的子元素进一步加工，其实就是文本111

```jsx
function finalizeInitialChildren(domElement, type, props, rootContainerInstance, hostContext) {
  // 实际触发的其实是这个
  setInitialProperties(domElement, type, props, rootContainerInstance);
  return shouldAutoFocusHostComponent(type, props);
}

// 跳过对于部分，接着看 setInitialDOMProperties
function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
  var props;

  switch (tag) {
		// ...
    default:
      props = rawProps;
  }
	// 验证props合法性
  assertValidProps(tag, props);
  // 正式设置props
  setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag);
  }
}


```

又是一系列的跳转，为dom设置属性的逻辑现在又聚焦在了`setInitialDOMProperties`中，我们直接看代码:

```jsx

function setInitialDOMProperties(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
  for (var propKey in nextProps) {
    // 遍历所有属性，只要这个属性不是原型属性，那就开始正式处理
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }

    var nextProp = nextProps[propKey];
		// 如果属性是样式，那就通过setValueForStyles为dom设置样式
    if (propKey === STYLE) {
      {
        if (nextProp) {
          Object.freeze(nextProp);
        }
      }
      setValueForStyles(domElement, nextProp);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {

    } else if (propKey === CHILDREN) {
      if (typeof nextProp === 'string') {
        var canSetTextContent = tag !== 'textarea' || nextProp !== '';
        if (canSetTextContent) {
          // 设置文本属性
          setTextContent(domElement, nextProp);
        }
      } else if (typeof nextProp === 'number') {
        setTextContent(domElement, '' + nextProp);
      }
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING) ; else if (propKey === AUTOFOCUS) ; else if (registrationNameDependencies.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        if ( typeof nextProp !== 'function') {
          warnForInvalidEventListener(propKey, nextProp);
        }

        if (propKey === 'onScroll') {
          listenToNonDelegatedEvent('scroll', domElement);
        }
      }
    } else if (nextProp != null) {
      setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag);
    }
  }
}

```
这段代码看着有点长，其实做的事情非常的清晰，遍历span目前的props，如果props的key是style，那就通过`setValueForStyles`为当前真实dom一一设置样式，如果key是children，很明显我们虚拟dom的111是放在children属性中的，外加上如果这个children类型还是string，那就通过setTextContent为dom添加文本信息

那么到这里，其实我们的组件P已经准备完毕，包括真实dom也都创建好了，就等插入到页面了，那这些dom什么时候插入到页面的呢？后面我又跟了下调用栈，根据我页面啥时候绘制的111一步步断点缩小范围，最终定位到了`insertOrAppendPlacementNodeIntoContainer`方法，直译过来就是将节点插入或者追加到容器节点中：

```jsx
function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
  var tag = node.tag;
  var isHost = tag === HostComponent || tag === HostText;
  if (isHost || enableFundamentalAPI ) {
    var stateNode = isHost ? node.stateNode : node.stateNode.instance;
    if (before) {
      // 在容器节点前插入
      insertInContainerBefore(parent, stateNode, before);
    } else {
      // 在容器节点后追加
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal) ; else {
    var child = node.child;
		// 只要子节点不为null，继续递归调用
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      var sibling = child.sibling;
			// 只要兄弟节点不为null，继续递归调用
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}


```

在`insertOrAppendPlacementNodeIntoContainer`中，react会根据当前节点是否有子节点，或者兄弟节点进行递归调用，然后分别根据`insertInContainerBefore`与`appendChildToContainer`做最终的节点插入页面操作，这里我们看看`appendChildToContainer`的实现

```jsx
function appendChildToContainer(container, child) {
  var parentNode;

  if (container.nodeType === COMMENT_NODE) {
    parentNode = container.parentNode;
    parentNode.insertBefore(child, container);
  } else {
    parentNode = container;
    // 将子节点插入到父节点中
    parentNode.appendChild(child);
  var reactRootContainer = container._reactRootContainer;

  if ((reactRootContainer === null || reactRootContainer === undefined) && parentNode.onclick === null) {
    // TODO: This cast may not be sound for SVG, MathML or custom elements.
    trapClickOnNonInteractiveElement(parentNode);
  }
}


```

由于我们定义的组件非常简单，P组件只有一个span标签，所以这里的parentNode其实就是容器根节点，当执行完`parentNode.appendChild(child)`，可以看到页面就出现了111了。
![image text](https://smms.app/delete/PMaZjwkOGXsn26J1tyHSEipfWd)


至此，组件的虚拟dom生成，真实dom的创建，加工以及渲染全部执行完毕。

可能大家对于这个过程还是比较迷糊，我大致画个图描述下这个过程：
![image text](https://smms.app/delete/IiFutU6A83lwqsrDpLoRHcEm4C)



而react是怎么知道谁是谁的子节点，谁是谁的父节点，这个就需要了解fiber对象了，其实我们在创建完真实dom后，它还是会被加工成一个fiber节点，而此节点中通过child可以访问到自己的子节点，通过sibling获取自己的兄弟节点，最后通过return属性获取自己的父节点，通过这些属性为构建dom树提供了支撑，当然fiber我会另开一篇文章来解释，这里不急。


前文，我们验证了Class组件是通过new得到组件实例，然后开展后续操作，那对于函数组件，是不是直接调用拿到子组件呢？这里我简单跟了下源码，发现了如下代码：
![](https://smms.app/delete/6jfAFei4MmT7gdczv9b5yrWwYU)

```jsx
function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
  // ....
  var children = Component(props, secondArg);
}

```
可以发现确实如此，拿到子节点，然后后续还是跟之前一样，将虚拟dom转变成真实dom，以及后续的一系列操作。

不过有点意外的是，我以为我定义的函数组件在判断组件类型时，会走case FunctionComponent分支路线，结果它走的case IndeterminateComponent，也就是模糊定义的组件，不过影响不大，还是符合我们的推测。

好了，到这里，今天属实有点累，关于虚拟dom如何转变成真实dom也介绍完毕了。

# 我是如何阅读源码的

react的源码比较多，一个react一个react-dom加起来代码量都几万行了，所以在读之前，一定要搞清楚自己的目标，这样你也能少受不重要逻辑的干扰，比如我在阅读之前初步定下的目标是：

1.虚拟dom是怎么生成的？

2.函数组件和class组件渲染有什么不同？

3.为啥我之前尝试直接修改虚拟dom，添加属性没成功（对应后面typeof Symbol的解释）

4.虚拟dom是怎么转变成真实dom的？

5.啥时候才把真实dom插入到页面？

清晰了目标，那就可以找到起点开始看了，我要看渲染，那自然看render，但接下来就麻烦了，如果你跟着render一步步往下走，那估计你看不了五分钟，应该就没耐心看了，因为这里面存在大量你根本看不懂，或者对你帮助不大的代码，那么我是怎么做的呢？

我要看虚拟dom转变真实dom，react到头来还是要操作真实dom，那它就一定得通过原生的createElement来创建dom节点，所以我直接在源码中搜createElement，然后看看这些命名出现的上下文，根据语境大致推断是否是自己想要的，不确定也可以打个断点。

哎，然后我就发现我成功找到function createElement方法，而且它还真是我想要的方法，但是呢，此时逻辑距离render可谓是十万八千里，这中间究竟发生了什么？这时候就可以根据执行栈进行梳理：

![image text](https://smms.app/delete/iWDyYFrlwUbeOH4KVhnvamqX2L)

比如上图就是我定位到给真实dom添加属性的方法，然后我根据调用栈命名，大致知道它在干嘛，同时排除那些没意义的函数的干扰，从终点反向走回起点，看看这一路react是怎么处理的。

同理，我在找最后react将真实dom插入到页面的逻辑时，我发现我跟不下去了，因为断点乱跳，于是我就看页面渲染111的时机，然后初略断点，如果这个断点还没走到111已经渲染了，说明这个操作在之前，通过这种方式不断缩小范围范围，最终定位到了`insertOrAppendPlacementNodeIntoContainer`方法，也解开了我前面的疑惑。

# 最后

阅读源码是一个很枯燥的过程，但是收益也是巨大的。

另外写这系列是个很耗时的工程，需要维护代码注释，还得把文章写得尽量让读者看懂，最后还得配上画图，如果你觉得文章看着还行，就请不要吝啬你的点赞。



