# upp-touch
> 基于vue的移动端滑动方案。


------

## 什么是 upp-touch
uppTouch 处理移动端的滑动事件

- [x] 可锁定方向，禁止横轴或者纵轴滑动
- [x] 上下左右滑动有对应事件触发并且携带距离值
- [x] 自动处理边界，到达边界后不会继续移动
- [x] 如果移动时已经处于对应方向的边界，则会触发新的事件，以便和移动事件区分开
- [x] 暴露直达上下左右边界的方法
- [x] 简单快捷，轻松上手

### 安装
```bash
npm install upp-touch --save
```

### 在指定区域内滑动
* 通过设置自定义样式使用，注意不要忘记添加 overflow 属性
```bash
<template>
    <upp-touch :diyStyle="diyStyle">
        <div class="scrollWrapper"></div>  // 滚动的盒子
    </upp-touch>
</template>

<script>
    import uppTouch from 'upp-touch'

    export default {
        data() {
          return {
            diyStyle: {
              width: '100px',
              height: '100px',
              overflow: 'hidden'
            }
          }
        },

        components: {
            uppTouch
        }
    }
</script>
```
* 通过外层再加一个盒子使用
```bash
<template>
    <div id="touchWrapper">
        <upp-touch>
            <div class="scrollWrapper"></div>  // 滚动的盒子
        </upp-touch>
    </div>
</template>

<style scoped>
  #touchWrapper {
    width: 100px;
    height: 200px;
    overflow: hidden;
  }
</style>
```

> 注意一：建议组件包裹起来的盒子有且只有一个，多个DOM将无法检测到

* 正确的写法（非必看文档）：
```
<template>
    <div id="out">
        <upp-touch>
            <div class="scrollWrapper">……</div>
        </upp-touch>
    </div>
</template>
```
* 错误的写法（非必看文档）：
```
<template>
    <div id="out">
        <upp-touch>
            <div class="scrollWrapper">……</div>
            <div class="any">……</div>
            ……
        </upp-touch>
    </div>
</template>
```
> 注意二：要滚动的盒子必须满足以下任意一个要求(比如上方类名为 scrollWrapper 的盒子)：
            1、设置了宽高
            2、设置为行内或者行内块级元素让其宽度由内容撑开

### 配置
| 属性名     | 描述   |  类型  |  默认值  |
| --------   | :----:  | :----:  | :----:  |
| lockX     | 锁定横轴，禁止滚动 |   Boolean     |   false     |
| lockY        |   锁定纵轴，禁止滚动   |   Boolean     |   false   |
| preventDefault        |   在滑动时阻止默认事件   |   Boolean     |   false   |
| scrollTransitionTime        |   滑动过渡时间   |   Number     |   0.3S   |
| commonSlideTransition        |   滑动时是否开启过渡效果   |    Boolean     |  false   |
| diyStyle        |   包裹滚动区域盒子的样式   |   Object     |   {}   |

> 说一下 commonSlideTransition，默认的过渡效果只触发在对外封装的方法中生效，如果要在正常的滑动中也添加过渡效果，修改这个属性即可。

### 封装的方法
| 方法名     | 描述   |
| :----:   | :----:  |
| toLeft     | 滚动到横轴起始的位置 |
| toRight        |   滚动到横轴末尾处   |
| toTop        |   滚动到纵轴起始的位置   |
| toBottom        |   滚动到纵轴末尾处   |
> 过渡效果默认只在调用这几个方法的时候生效，如果要在正常的滑动中也生效，修改配置属性 commonSlideTransition

> 特性：
1、在滚动的盒子小于滚动区域的时候，自动锁定对应方向无法滑动，但是这几个方法仍然可以生效；
2、在用户主动锁定横轴或者纵轴方向时，这几个方法仍然可以生效。

### 观察者模式
| 派发的事件     | 描述   | 追加描述
| :----:   | :----:  | :----:  |
| x-start | 横轴方向移动到起始位置时触发 | -
| x-end | 横轴方向移动到末尾时触发 | -
| y-start | 纵轴方向移动到起始位置时触发 | -
| y-end | 纵轴方向移动到末尾时触发 | -
| XStart | 右滑行为时如果已经处于起始位置触发 | 上拉加载下拉刷新利器
| XEnd | 左滑行为时如果已经处于末尾触发 | 上拉加载下拉刷新利器
| YStart | 下拉行为时如果已经处于起始触发 | 上拉加载下拉刷新利器
| YEnd | 上拉行为时如果已经处于末尾触发 | 上拉加载下拉刷新利器
| leftMoving | 页面向左滑动的时候触发 | 可通过形参接收已移动距离
| rightMoving | 页面向右滑动的时候触发 | 可通过形参接收已移动距离
| topMoving | 页面向上滑动的时候触发 | 可通过形参接收已移动距离
| bottomMoving | 页面向下滑动的时候触发 | 可通过形参接收已移动距离
> 可以利用这几个事件进行一些扩展的行为，比如上拉加载、下拉刷新等，可以查看Demo便于理解这几个事件的表现。
