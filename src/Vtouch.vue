<template>
  <div id="upp-touch" ref="uppTouch" :style="touchClass">
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
  import { prefixStyle } from "./js/utils";

  const TRANSFORM = prefixStyle('transform');

  import * as UPP_TOUCH_EVENTS from './js/events'

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
          if(!this.$slots.default) this.throwError(0);

          const touchEle = this.$refs.touch;
          const touchEleParent = touchEle.parentNode;

          this.el = this.$slots.default[0].elm;
          this.needTransition = this.commonSlideTransition;

          this.touch = {
            xHasMove: 0,
            yHasMove: 0,
            xTemMove: 0,
            yTemMove: 0,
            systemLockX: this.el.clientHeight < this.$refs.uppTouch.clientWidth,
            systemLockY: this.el.clientHeight < this.$refs.uppTouch.clientHeight,
            curDirectionX: undefined,
            initX: 0,
            initY: 0,
            parentWidth: touchEleParent ? touchEleParent.clientWidth : window.innerWidth,
            parentHeight: touchEleParent ? touchEleParent.clientHeight : window.innerHeight,
            xLastDistance: 0,
            yLastDistance: 0,
          };
        }, 0)
      },

      touchStart(e) {
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
        this.touch.xMoving = false;
        this.touch.yMoving = false;
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
          this.touch.hasMove = true;
          if (Math.abs(offsetX) > Math.abs(offsetY)) {
            this.touch.directionX = true;
            if (this.touch.curDirectionX === undefined) this.touch.curDirectionX = true;
            if (this.lockX || this.touch.systemLockX) return;
          } else {
            this.touch.directionY = true;
            if (this.touch.curDirectionX === undefined) this.touch.curDirectionX = false;
            if (this.lockY || this.touch.systemLockY) return;
          }
        }

        if (this.touch.curDirectionX) {
          this.moveX(offsetX);
        } else {
          this.moveY(offsetY);
        }
      },

      touchEnd() {
        this.$emit('touchEnd');
        this.touch.hasMove = false;
        this.touch.directionX = false;
        this.touch.directionY = false;
        this.touch.xMoving = false;
        this.touch.yMoving = false;
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
        if(x && this.lockX || x && this.touch.systemLockX) return;
        if(!x && this.lockY || !x && this.touch.systemLockY) return;

        x ? this.touch.xMoving = true : this.touch.yMoving = true;
        this.needTransition = this.commonSlideTransition;

        let total, _x, _y, _event;
        if (x) {
          _x = total = this.touch.xHasMove + distance;
          _y = this.touch.yHasMove;
          _event = this.touch.xLastDistance > distance ? UPP_TOUCH_EVENTS.LEFT_MOVING : UPP_TOUCH_EVENTS.RIGHT_MOVING;
          this.touch.xLastDistance = distance;
        } else {
          _x = this.touch.xHasMove;
          _y = total = this.touch.yHasMove + distance;
          _event = this.touch.yLastDistance > distance ? UPP_TOUCH_EVENTS.TOP_MOVING : UPP_TOUCH_EVENTS.BOTTOM_MOVING;
          this.touch.yLastDistance = distance;
        }

        this.$emit(_event, total);
        this.$refs.touch.style[TRANSFORM] = `translate3d(${_x}px, ${_y}px, 0)`;
      },

      moveXToLeft(offset) {
        this.touch.xTemMove = offset;
        const clientWidth = this.el.clientWidth - this.touch.parentWidth;
        if (this.touch.xHasMove + offset <= -clientWidth) {
          this.touch.xTemMove = -clientWidth - this.touch.xHasMove;
          this.dispatch(1, offset);
        }
        this.move(true, this.touch.xTemMove);
      },

      moveXToRight(offset) {
        this.touch.xTemMove = offset;
        if (this.touch.xHasMove + offset >= this.touch.initX) {
          this.touch.xTemMove = this.touch.initX - this.touch.xHasMove;
          this.dispatch(0, offset);
        }
        this.move(true, this.touch.xTemMove);
      },

      moveYtoTop(offset) {
        this.touch.yTemMove = offset;
        const clientHeight = this.el.clientHeight - this.touch.parentHeight;
        if (this.touch.yHasMove + offset <= -clientHeight) {
          this.touch.yTemMove = -clientHeight - this.touch.yHasMove;
          this.dispatch(3, offset);
        }
        this.move(null, this.touch.yTemMove);
      },

      moveYtoBottom(offset) {
        this.touch.yTemMove = offset;
        if (this.touch.yHasMove + offset >= this.touch.initY) {
          this.touch.yTemMove = this.touch.initY - this.touch.yHasMove;
          this.dispatch(2, offset);
        }
        this.move(null, this.touch.yTemMove);
      },

      toLeft() {
        if(!this.touch) this.throwError(1);
        this.methodsMove(true, 0);
      },

      toRight() {
        if(!this.touch) this.throwError(1);
        const offset = -(this.el.clientWidth - this.touch.parentWidth);
        this.methodsMove(true, offset)
      },

      toTop() {
        if(!this.touch) this.throwError(1);
        this.methodsMove(false, 0);
      },

      toBottom() {
        if(!this.touch) this.throwError(1);
        const offset = -(this.el.clientHeight - this.touch.parentHeight);
        this.methodsMove(false, offset)
      },

      methodsMove(x, offset) {
        clearTimeout(this.touch.transitionTimer);

        this.needTransition = true;

        let _x, _y;
        _x = x ? offset : this.touch.xHasMove;
        _y = x ? this.touch.yHasMove : offset;

        setTimeout(() => {
          this.$refs.touch.style[TRANSFORM] = `translate3d(${_x}px, ${_y}px, 0)`;
          x ? this.touch.xHasMove = offset :this.touch.yHasMove = offset;
        }, 0);

        const setTimeoutTime = this.scrollTransitionTime > 0 ? this.scrollTransitionTime * 1000 : 0;

         this.touch.transitionTimer = setTimeout(() => {
           this.needTransition = false;
         }, setTimeoutTime)
      },

      dispatch(type, offset) {
        clearTimeout(this.touch.eventTimer);
        let event, needTransition = true;
        if(type === 0) {
          event = UPP_TOUCH_EVENTS.X_IS_START;
          if(!this.touch.xTemMove && !this.touch.xMoving) {
            event = UPP_TOUCH_EVENTS.X_HAS_START;
            needTransition = false;
          }
        }

        if(type === 1) {
          event = UPP_TOUCH_EVENTS.X_IS_END;
          if(!this.touch.xTemMove && !this.touch.xMoving) {
            event = UPP_TOUCH_EVENTS.X_HAS_END;
            needTransition = false;
          }
        }

        if(type === 2) {
          event = UPP_TOUCH_EVENTS.Y_IS_START;
          if(!this.touch.yTemMove && !this.touch.yMoving) {
            event = UPP_TOUCH_EVENTS.Y_HAS_START;
            needTransition = false;
          }
        }

        if(type === 3) {
          event = UPP_TOUCH_EVENTS.Y_IS_END;
          if(!this.touch.yTemMove && !this.touch.yMoving) {
            event = UPP_TOUCH_EVENTS.Y_HAS_END;
            needTransition = false;
          }
        }

        if(!event) this.throwError();
        const timer = this.needTransition ? needTransition ? this.scrollTransitionTime * 1000 : 0 : 0;
        this.touch.eventTimer = setTimeout(() => {
          needTransition ? this.$emit(event) : this.$emit(event, offset);
        }, timer)
      },

      throwError(type) {
        let err;
        if(type === 0) err = '没有镶嵌有效DOM！';
        if(type === 1) err = "uppTouch没有正确的初始化";
        if(!err) err = `代码Bug，抛出了一个错误的错误类型：${type}`;
        throw new TypeError(err);
      },
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
