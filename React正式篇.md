# 什么是帧，一帧能做什么
我们知道一般的浏览器每秒钟会绘制60帧，也就是每帧需要16ms左右，如果js计算任务长时间占用线程那个，会导致一些ui无法及时得到渲染，出现卡顿

一帧内需要完成如下六个步骤的任务：

1.处理用户的交互

2.JS 解析执行

3.帧开始。窗口尺寸变更，页面滚去等的处理

4.requestAnimationFrame(rAF)

5.布局

6.绘制

# 什么是requestAnimationFrame

相信大家都知道动画的基础就是在于快速的画面刷新，常见的刷新频率单位是 每秒传输帧数(FPS = Frames Per Second) ，有时我们也直接简称为 帧 。在游戏或是视频中，24 帧以上对于肉眼来说就能算是流畅不卡顿，而常见的刷新频率通常为 60 FPS。

同样的，我们透过浏览器访问网页也需要进行页面刷新。对于浏览器来说所谓的网页也就是一个用 html 格式所描述的一个动态画面，DOM 元素的移动、改变、滚轮等就相当于是在页面的一次刷新中对元素的偏移、变形进行重新计算，最后 重新渲染 在浏览器的页面中，而这就是所谓的页面刷新,那什么是requestAnimationFrame

简单来说requestAnimationFrame就是为了防止掉帧使用得技术，因为rAF 会在下次页面刷新之前调用回调函数,已经把自己理解得requestAnimationFrame放在了[我的代码](https://github.com/web-kiko/react17-source) 并定位到 public 文件夹下的rAF.html

# 什么是requestIdleCallBack

我们知道一般的浏览器每秒钟会绘制60帧，也就是每帧需要16ms左右，如果一帧内完成了任务
并且完成后没超过 16 ms，说明时间有富余，此时就会执行 requestIdleCallback 里注册的任务
简单来说就是requestIdleCallBack可以让我们在浏览器空闲的时候做一些事情，把requestIdleCallBack代码放在[我的代码](https://github.com/web-kiko/react17-source) 并定位到 public 文件夹下的rIdleCallBack.html中

# 最后 

下一章节让我们认识一下react源码架构和各个模块