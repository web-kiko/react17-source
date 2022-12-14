# 开篇
介绍了虚拟dom的概念，以及react中虚拟dom的使用场景。那么按照之前的约定，本文来聊聊react中另一个非常重要的概念，也就是fiber。那么通过阅读本文，你将了解到如下几个知识点:

1.如何理解浏览器中的帧？

2.什么是fiber？它解决了什么问题？

3.fiber有哪些优势？

4.了解requestIdleCallback和requestAnimationFrame

5.react中的fiber是如何运转的（fiber的两个阶段）


# 什么是帧，一帧能做什么

如何理解帧？

很直观的解释可以借用动画制作工艺，传统的动画制作其实都是逐帧拍摄，动画作者需要将一个连贯的画面一张一张的画出来，然后再结合画面的高速切换以达到动画的效果，我相信不少人在读书时代应该也做过在课本每一页画画然后玩翻页动画的事情

所以如果一个连贯动作我们用100个画面去呈现，那么你会发现这个画面看起来非常流畅，但如果我们抽帧到只有10帧，人物的动作就会显得不连贯且卡顿，这时候大家就说开启眨眼补帧模式。不过在视频混剪上，也有人还会故意用抽帧来达到王家卫电影的拖影效果，但这都是艺术表现层面的话术了。

所以回到浏览器渲染，我们其实也可以将浏览器的动画理解成一张张的图，而主流的显示器刷新率其实都是60帧/S，也就是一秒画面会高速的刷新60次，按照计算机1S等于1000ms的设定，那么一帧的预算时间其实是1000ms/60帧也就是16.66ms。

我们知道一般的浏览器每秒钟会绘制60帧，也就是每帧需要16ms左右，如果js计算任务长时间占用线程那个，会导致一些ui无法及时得到渲染，出现卡顿

# 一帧内需要完成如下六个步骤的任务：

1.处理用户的交互

2.JS 解析执行

3.帧开始。窗口尺寸变更，页面滚去等的处理

4.requestAnimationFrame(rAF)

5.布局

6.绘制

# 什么是requestAnimationFrame

相信大家都知道动画的基础就是在于快速的画面刷新，常见的刷新频率单位是 每秒传输帧数(FPS = Frames Per Second) ，有时我们也直接简称为 帧 。在游戏或是视频中，24 帧以上对于肉眼来说就能算是流畅不卡顿，而常见的刷新频率通常为 60 FPS。

同样的，我们透过浏览器访问网页也需要进行页面刷新。对于浏览器来说所谓的网页也就是一个用 html 格式所描述的一个动态画面，DOM 元素的移动、改变、滚轮等就相当于是在页面的一次刷新中对元素的偏移、变形进行重新计算，最后 重新渲染 在浏览器的页面中，而这就是所谓的页面刷新,那什么是`requestAnimationFrame`

简单来说`requestAnimationFrame`就是为了防止掉帧使用得技术，因为rAF 会在下次页面刷新之前调用回调函数,已经把自己理解得`requestAnimationFrame`放在了[我的代码](https://github.com/web-kiko/react17-source) 并定位到 public 文件夹下的rAF.html




# 什么是requestIdleCallBack

我们首先了解一下这个函数的作用
![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-04-155145.png)

该函数的回调方法会在浏览器的空闲时期依次调用， 可以让我们在事件循环中执行一些任务，并且不会对像动画和用户交互这样延迟敏感的事件产生影响。

# 如何实现 requestIdleCallback
说到多次执行，那么肯定得使用定时器了。在多种定时器中，唯有 `requestAnimationFrame` 具备一定的精确度，因此 `requestAnimationFrame` 就是当下实现 `requestIdleCallback` 的一个步骤

我们知道一般的浏览器每秒钟会绘制60帧，也就是每帧需要16ms左右，如果一帧内完成了任务并且完成后没超过 16 ms，说明时间有富余，此时就会执行 `requestIdleCallback` 里注册的任务

简单来说就是`requestIdleCallBack`可以让我们在浏览器空闲的时候做一些事情，把requestIdleCallBack代码放在[我的代码](https://github.com/web-kiko/react17-source) 并定位到 public 文件夹下的rIdleCallBack.html中


