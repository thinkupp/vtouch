<template>
  <div id="touch"
       ref="touch"
       @touchstart="touchStart"
       @touchmove="touchMove"
       @touchend="touchEnd"
  >
        <slot></slot>
  </div>
</template>

<script>
  import { prefixStyle, getOffset } from "../utils";
  const TRANSFORM = prefixStyle('transform');

  export default {
    data() {
      return {}
    },

    created() {
      this.initData();
    },

    mounted() {
      this.initialize();
      this.el = this.$slots.default[0].elm;
    },

    methods: {
      initData() {
        this.touch = {
          xHasMove: 0,
          yHasMove: 0,
          xTemMove: 0,
          yTemMove: 0,
          curDirectionX: undefined,
        };
      },

      initialize() {
        setTimeout(() => {
          const {t, l} = getOffset(this.$refs.touch);
          this.touch.initX = this.$refs.touch.offsetTop;
          this.touch.initY = this.$refs.touch.offsetLeft;
        }, 0)
      },

      touchStart(e) {
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },

      touchMove(e) {
        if(this.lockX && this.lockY) return;

        if(this.preventDefault) {
          e.preventDefault();
        }

        const touch = e.touches[0];
        let offsetX = touch.pageX - this.touch.startX;
        let offsetY = touch.pageY - this.touch.startY;

        if(!this.touch.hasMove) {
          if(Math.abs(offsetX) > Math.abs(offsetY)) {
            this.touch.directionX = true;
            if(this.touch.curDirectionX === undefined) this.touch.curDirectionX = true;
            if(this.lockX) return;
          } else {
            this.touch.directionY = true;
            if(this.touch.curDirectionX === undefined) this.touch.curDirectionX = false;
            if(this.lockY) return;
          }
          this.touch.hasMove = true;
        }

        if(this.touch.curDirectionX) {
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
        if(offset > 0) {
          this.moveXToRight(offset);
        } else {
          this.moveXToLeft(offset);
        }
      },

      moveY(offset) {
        if(offset < 0) {
          this.moveYtoTop(offset)
        } else {
          this.moveYtoBottom(offset);
        }
      },

      move(x, distance) {
        if(x) {
          distance = this.touch.xHasMove + distance;
          this.$refs.touch.style[TRANSFORM] = `translate3d(${distance}px, ${this.touch.yHasMove}px, 0)`;
          return;
        }
        distance = this.touch.yHasMove + distance;
        this.$refs.touch.style[TRANSFORM] = `translate3d(${this.touch.xHasMove}px, ${distance}px, 0)`;
      },

      moveXToLeft(offset) {
        this.touch.xTemMove = offset;
        const clientWidth = this.el.clientWidth - window.innerWidth;
        if(this.touch.xHasMove + offset <= -clientWidth) {
          this.touch.xTemMove = -clientWidth - this.touch.xHasMove;
          this.$emit('x-end')
        }
        this.move(true, this.touch.xTemMove);
      },

      moveXToRight(offset) {
        this.touch.xTemMove = offset;
        if(this.touch.xHasMove + offset >= this.touch.initX) {
          this.touch.xTemMove = this.touch.initX - this.touch.xHasMove;
          this.$emit('x-start');
        }
        this.move(true, this.touch.xTemMove);
      },

      moveYtoTop(offset) {
        this.touch.yTemMove = offset;
        if(this.touch.yHasMove + offset <= this.touch.initY) {
          this.touch.yTemMove = this.touch.initY - this.touch.yHasMove;
          console.log(this.touch.yTemMove, this.touch.yHasMove);
          this.$emit('y-start');
        }
        this.move(null, this.touch.yTemMove);
      },

      moveYtoBottom(offset) {
        this.touch.yTemMove = offset;
        const clientHeight = this.el.clientHeight - window.innerHeight;
        if(this.touch.yHasMove + offset <= -clientHeight) {
          this.touch.yTemMove = -clientHeight - this.touch.yHasMove;
          this.$emit('y-end')
        }
        this.move(null, this.touch.yTemMove);
      },

      moveXToStart() {
        this.$refs.touch.style[transform] = `0, ${this.touch.yHasMove}, 0`;
        this.touch.xHasMove = 0;
      },

      moveXToEnd() {

      },

      moveYToStart() {

      },

      moveYToEnd() {

      }
    },

    props: {
      lockX: {
        type: Boolean,
        default: false,
      },

      lockY: {
        type: Boolean,
        default: false,
      },

      preventDefault: {
        type: Boolean,
        default: false,
      }
    }
  }
</script>

<style scoped></style>
