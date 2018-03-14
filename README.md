# VueTouch

> 基于vue的移动端滑动方案。

------
## 什么是 vueTouch

vueTouch 处理移动端的滑动事件

- [x] 可锁定方向，禁止横轴或者纵轴滑动
- [x] 上下左右滑到边界时事件派发

### 安装
```bash
npm install vueTouch --save
```

```bash
import Vue from "vue";
import vueTouch from "vueTouch";
Vue.use(vueTouch);
```

### 在指定区域内滑动
* 通过设置自定义样式使用，注意不要忘记添加 overflow 属性
```bash
<template>
    <vue-touch :diyStyle="diyStyle">
        <div class="scrollWrapper"></div>  // 滚动的盒子
    </vue-touch>
</template>

<script>
    import vueTouch from 'vueTouch'
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
            vueTouch
        }
    }
</script>
```
* 通过外层再加一个盒子使用
```bash
<template>
    <div id="touchWrapper">
        <vue-touch>
            <div class="scrollWrapper"></div>  // 滚动的盒子
        </vue-touch>
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

> 注意一：建议组件包裹起来的盒子有且只有一个

* 正确的写法：
```
<template>
    <div id="out">
        <vue-touch>
            <div class="scrollWrapper">……</div>
        </vue-touch>
    </div>
</template>
```
* 错误的写法
```
<template>
    <div id="out">
        <vue-touch>
            <div class="scrollWrapper">……</div>
            <div class="any">……</div>
            ……
        </vue-touch>
    </div>
</template>
```

> 注意二：要滚动的盒子必须满足以下任意一个要求(比如上方类名为 scrollWrapper 的盒子)：
            1、设置了宽高
            1、设置为行内或者行内块级元素让其宽度由内容撑开

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

### 观察者模式
| 派发的事件     | 描述   |
| :----:   | :----:  |
| x-start     | 横轴方向移动到起始位置时触发 |
| x-end        |   横轴方向移动到末尾时触发   |
| y-start        |   纵轴方向移动到起始位置时触发   |
| y-end        |   纵轴方向移动到末尾时触发   |
> 可以利用这几个事件进行一些扩展的行为，比如上拉加载、下拉刷新等
