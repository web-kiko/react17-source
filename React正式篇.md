<!--
 * @Descripttion: 
 * @version: 
 * @Author: kiko
 * @Date: 2022-10-27 01:46:58
 * @LastEditors: kiko
 * @LastEditTime: 2022-10-27 16:26:52
-->
# 在理解react源码之前我们得知道 requestAnimationFrame,requestIdleCallBack,MessageChannel是做什么得

# requestAnimationFrame

相信大家都知道动画的基础就是在于快速的画面刷新，常见的刷新频率单位是 每秒传输帧数(FPS = Frames Per Second) ，有时我们也直接简称为 帧 。在游戏或是视频中，24 帧以上对于肉眼来说就能算是流畅不卡顿，而常见的刷新频率通常为 60 FPS。

同样的，我们透过浏览器访问网页也需要进行页面刷新。对于浏览器来说所谓的网页也就是一个用 html 格式所描述的一个动态画面，DOM 元素的移动、改变、滚轮等就相当于是在页面的一次刷新中对元素的偏移、变形进行重新计算，最后 重新渲染 在浏览器的页面中，而这就是所谓的页面刷新,那什么是requestAnimationFrame

简单来说requestAnimationFrame就是为了防止掉帧使用得技术，因为rAF 会在下次页面刷新之前调用回调函数

[我的代码](https://github.com/web-kiko/react17-source) 并定位到 public 文件夹下的rAF.html
