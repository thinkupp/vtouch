# touch

> 基于vue的移动端触屏滑动方案

## 安装

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

### 使用说明：
```
import Vue from 'vue';
import Touch from 'vueTouch';
Vue.use(vueTouch);

```
> 注意：
    被包裹的盒子如果是块级盒子，需要设置宽高，否则无法滚动。
    如果是行内块级或者行内元素，宽度会被内容撑开，所以无需设置。

### 关于滚动区域
可以直接给 touch 组件传递一个 diyStyle 属性来设置滚动区域的大小，注意要设置 overflow：hidden；
```
<template>
    <vue-touch :diyStyle="diyStyle"></vue-touch>
</template>

<script>
    export default {
        data() {
            return {
                diyStyle: {
                    width: '100px',
                    height: '100px',
                    overflow: 'hidden'
                }
            }
        }
    }
</script>
```
也可以用一个新的盒子包裹 touch 组件。
```
<div id="testDemo">
    <vue-touch />
</div>
```
不传递 diyStyle 属性的情况下，组件默认继承包裹 touch 组件的那个盒子的宽高。
例子：
```
<div id="out">
    <vue-touch></vue-touch>
</div>
```
——这时候滚动区域的大小就是id为 out 的这个DOM的宽高
### 配置
```
lockX: Boolean -> 锁定横轴，禁止滚动，默认 false；

lockY: Boolean -> 锁定纵轴，禁止滚动，默认 false；

preventDefault：Boolean -> 在滑动的时候阻止浏览器的默认行为，默认 false；

ScrollTransitionTime：Number -> 调用封装方法时候盒子滚动的过渡时间，默认 0.3s；

commonSlideTransition: Boolean -> 滑动时是否有过渡效果，默认 false；

diyStyle：Object -> 包裹滚动盒子的盒子样式，默认 {} (此时的样式是宽高100%，溢出隐藏)
```

### 封装的方法
```
toLeft() -> 让盒子滚动到横轴起始位置；

toRight() -> 让盒子滚动到横轴末尾；

toTop() -> 让盒子滚动到纵轴起始位置；

toBottom() -> 让盒子滚动到纵轴末尾；
```
具体可以参考Demo。

### 观察者模式
```
x-start: 当滑动到横轴起始位置时触发此事件；

x-end: 当滑动到横轴末尾时触发此事件；

y-start: 当滑动到纵轴起始位置时触发此事件；

y-end: 当滑动到纵轴末尾时触发此事件；
```
例子：
```
<vue-touch
    @x-start="xStart"
    @x-end="xEnd"
    @y-start="yStart"
    @y-end="yEnd"
/>
```
可以根据这几个派发的事件做一些更多的扩展，比如上拉刷新、下拉加载等。

