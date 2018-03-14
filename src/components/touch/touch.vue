<template>
  <div id="vue-touch" ref="vueTouch" :style="touchClass">
    <div
      class="touch-wrapper"
      ref="touch"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      :style="touchWrapperStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { prefixStyle } from "../utils";


  const TRANSFORM = prefixStyle('transform');

  export default {
    data() {
      return {
        needTransition: false,
      }
    },

    mounted() {
      this.initialize();
    },

    methods: {
      initialize() {
        setTimeout(() => {
          if(JSON.stringify(this.$slots) === '{}') throw new TypeError("没有镶嵌有效DOM！");

          const touchEle = this.$refs.touch;
          const touchEleParent = touchEle.parentNode;

          this.el = this.$slots.default[0].elm;
          this.needTransition = this.commonSlideTransition;

          this.touch = {
            xHasMove: 0,
            yHasMove: 0,
            xTemMove: 0,
            yTemMove: 0,
            xHasStart: true,
            xHasEnd: false,
            yHasStart: true,
            yHasEnd: false,
            systemLockX: this.el.clientHeight < this.$refs.vueTouch.clientWidth,
            systemLockY: this.el.clientHeight < this.$refs.vueTouch.clientHeight,
            curDirectionX: undefined,
            initX: 0,
            initY: 0,
            parentWidth: touchEleParent ? touchEleParent.clientWidth : window.innerWidth,
            parentHeight: touchEleParent ? touchEleParent.clientHeight : window.innerHeight,
          };
        }, 0)
      },

      touchStart(e) {
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
        this.touch.init = true;
      },

      touchMove(e) {
        if (this.lockX && this.lockY) return;
        if(this.touch.systemLockX && this.touch.systemLockY) return;

        if (this.preventDefault) {
          e.preventDefault();
        }

        const touch = e.touches[0];
        let offsetX = touch.pageX - this.touch.startX;
        let offsetY = touch.pageY - this.touch.startY;

        if (!this.touch.hasMove) {
          if (Math.abs(offsetX) > Math.abs(offsetY)) {
            this.touch.directionX = true;
            if (this.touch.curDirectionX === undefined) this.touch.curDirectionX = true;
            if (this.lockX || this.touch.systemLockX) return;
          } else {
            this.touch.directionY = true;
            if (this.touch.curDirectionX === undefined) this.touch.curDirectionX = false;
            if (this.lockY || this.touch.systemLockY) return;
          }
          this.touch.hasMove = true;
        }

        if (this.touch.curDirectionX) {
          this.moveX(offsetX);
        } else {
          this.moveY(offsetY);
        }
      },

      touchEnd() {
        this.touch.hasMove = false;
        this.touch.directionX = false;
        this.touch.directionY = false;
        this.touch.curDirectionX = undefined;
        this.touch.xHasMove += this.touch.xTemMove;
        this.touch.yHasMove += this.touch.yTemMove;
        this.touch.xTemMove = 0;
        this.touch.yTemMove = 0;
      },

      moveX(offset) {
        if (offset > 0) {
          this.moveXToRight(offset);
        } else {
          this.moveXToLeft(offset);
        }
      },

      moveY(offset) {
        if (offset < 0) {
          this.moveYtoTop(offset)
        } else {
          this.moveYtoBottom(offset);
        }
      },

      move(x, distance) {
        if(!distance) return;
        this.needTransition = this.commonSlideTransition;
        if (x) {
          distance = this.touch.xHasMove + distance;
          this.$refs.touch.style[TRANSFORM] = `translate3d(${distance}px, ${this.touch.yHasMove}px, 0)`;
          return;
        }
        distance = this.touch.yHasMove + distance;
        this.$refs.touch.style[TRANSFORM] = `translate3d(${this.touch.xHasMove}px, ${distance}px, 0)`;
      },

      moveXToLeft(offset) {
        this.touch.xTemMove = offset;
        const clientWidth = this.el.clientWidth - this.touch.parentWidth;
        if (this.touch.xHasMove + offset <= -clientWidth) {
          this.touch.xTemMove = -clientWidth - this.touch.xHasMove;
          this.dispatch(1);
        }
        this.move(true, this.touch.xTemMove);
      },

      moveXToRight(offset) {
        this.touch.xTemMove = offset;
        if (this.touch.xHasMove + offset >= this.touch.initX) {
          this.touch.xTemMove = this.touch.initX - this.touch.xHasMove;
          this.dispatch(0);
        }
        this.move(true, this.touch.xTemMove);
      },

      moveYtoTop(offset) {
        this.touch.yTemMove = offset;
        const clientHeight = this.el.clientHeight - this.touch.parentHeight;
        if (this.touch.yHasMove + offset <= -clientHeight) {
          this.touch.yTemMove = -clientHeight - this.touch.yHasMove;
          this.dispatch(3);
        }
        this.move(null, this.touch.yTemMove);
      },

      moveYtoBottom(offset) {
        this.touch.yTemMove = offset;
        if (this.touch.yHasMove + offset >= this.touch.initY) {
          this.touch.yTemMove = this.touch.initY - this.touch.yHasMove;
          this.dispatch(2);
        }
        this.move(null, this.touch.yTemMove);
      },

      toLeft() {
        if(!this.touch) throw new TypeError("VueTouch组件没有正确的初始化！");
        this.methodsMove(true, 0);
      },

      toRight() {
        if(!this.touch) throw new TypeError("VueTouch组件没有正确的初始化！");
        const offset = -(this.el.clientWidth - this.touch.parentWidth);
        this.methodsMove(true, offset)
      },

      toTop() {
        if(!this.touch) throw new TypeError("VueTouch组件没有正确的初始化！");
        if(!this.touch) return;
        this.methodsMove(false, 0);
      },

      toBottom() {
        if(!this.touch) throw new TypeError("VueTouch组件没有正确的初始化！");
        const offset = -(this.el.clientHeight - this.touch.parentHeight);
        this.methodsMove(false, offset)
      },

      methodsMove(x, offset) {
        clearTimeout(this.touch.transitionTimer);

        this.needTransition = true;

        setTimeout(() => {
          if (x) {
            this.$refs.touch.style[TRANSFORM] = `translate3d(${offset}px, ${this.touch.yHasMove}px, 0)`;
            this.touch.xHasMove = offset;
          } else {
            this.$refs.touch.style[TRANSFORM] = `translate3d(${this.touch.xHasMove}px, ${offset}px, 0)`;
            this.touch.yHasMove = offset;
          }
        }, 0);

        const setTimeoutTime = this.scrollTransitionTime > 0 ? this.scrollTransitionTime * 1000 : 0;

         this.touch.transitionTimer = setTimeout(() => {
           this.needTransition = false;
         }, setTimeoutTime)

      },

      dispatch(type) {
        clearTimeout(this.touch.eventTimer);
        let event, needTransition = true;
        if(type === 0) {
          event = 'x-start';
          if(!this.touch.xTemMove) {
            event = 'XStart';
            needTransition = false;
          }
        }

        if(type === 1) {
          event = 'x-end';
          if(!this.touch.xTemMove) {
            event = 'XEnd';
            needTransition = false;
          }
        }

        if(type === 2) {
          event = 'y-start';
          if(!this.touch.yTemMove) {
            event = 'YStart';
            needTransition = false;
          }
        }

        if(type === 3) {
          event = 'y-end';
          if(!this.touch.yTemMove) {
            event = 'YEnd';
            needTransition = false;
          }
        }

        if(!event) return;
        const timer = this.needTransition ? needTransition ? this.scrollTransitionTime * 1000 : 0 : 0;
        this.touch.eventTimer = setTimeout(() => {
          this.$emit(event);
        }, timer)
      }
    },

    computed: {
      touchWrapperStyle() {
        let classContent = {transition: ''};
        let ScrollTransitionTime = parseFloat(this.scrollTransitionTime);
        if (this.needTransition) {
          if (!isNaN(ScrollTransitionTime) && ScrollTransitionTime > 0) {
            classContent = {
              transition: `transform ${ScrollTransitionTime}s linear`
            }
          }
        }
        return classContent
      },

      touchClass() {
        return JSON.stringify(this.diyStyle) === '{}' ? {
          width: "100%",
          height: "100%",
          overflow: 'hidden',
        } : this.diyStyle;
      }
    },

    props: {
      // 锁定X轴
      lockX: {
        type: Boolean,
        default: false,
      },

      // 锁定X轴
      lockY: {
        type: Boolean,
        default: false,
      },

      // 是否阻止浏览器默认事件
      preventDefault: {
        type: Boolean,
        default: false,
      },

      // 过渡时间
      scrollTransitionTime: {
        type: Number,
        default: 0.3,
      },

      // 普通滑动是否开启过渡效果
      commonSlideTransition: {
        typ: Boolean,
        default: false,
      },

      // 自定义样式
      diyStyle: {
        type: Object,
        default: function() {
          return {}
        }
      }
    }
  }
</script>

<style scoped>
  #vue-touch {
  }

  .touch-wrapper {
  }
</style>
