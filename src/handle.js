import {prefixStyle} from "./components/utils"

const TRANSFORM = prefixStyle('transform');

const handle = (function(){
  return {
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
        moveX.call(this, offsetX);
      } else {
        moveY.call(this, offsetY);
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


  }
})();

function moveX(offset) {
  if(offset > 0) {
    moveXToRight.call(this, offset);
  } else {
    moveXToLeft.call(this, offset);
  }
}

function moveY(offset) {
  if(offset < 0) {
    moveYtoTop.call(this, offset)
  } else {
    moveYtoBottom.call(this, offset);
  }
}

function move(x, distance) {
  if(x) {
    distance = this.touch.xHasMove + distance;
    this.$refs.touch.style[TRANSFORM] = `translate3d(${distance}px, ${this.touch.yHasMove}px, 0)`;
    return;
  }
  distance = this.touch.yHasMove + distance;
  this.$refs.touch.style[TRANSFORM] = `translate3d(${this.touch.xHasMove}px, ${distance}px, 0)`;
}

function moveXToLeft(offset) {
  this.touch.xTemMove = offset;
  const clientWidth = this.el.clientWidth - this.touch.parentWidth;
  if(this.touch.xHasMove + offset <= -clientWidth) {
    this.touch.xTemMove = -clientWidth - this.touch.xHasMove;
    this.$emit('x-end')
  }
  this.move(true, this.touch.xTemMove);
}

function moveXToRight(offset) {
  this.touch.xTemMove = offset;
  if(this.touch.xHasMove + offset >= this.touch.initX) {
    this.touch.xTemMove = this.touch.initX - this.touch.xHasMove;
    this.$emit('x-start');
  }
  this.move(true, this.touch.xTemMove);
}

function moveYtoTop(offset) {
  this.touch.yTemMove = offset;
  const clientHeight = this.el.clientHeight - this.touch.parentHeight;
  if(this.touch.yHasMove + offset <= -clientHeight) {
    this.touch.yTemMove = -clientHeight - this.touch.yHasMove;
    this.$emit('y-end')
  }
  this.move(null, this.touch.yTemMove);
}

function moveYtoBottom(offset) {
  this.touch.yTemMove = offset;
  if(this.touch.yHasMove + offset >= this.touch.initY) {
    this.touch.yTemMove = this.touch.initY - this.touch.yHasMove;
    this.$emit('y-start');
  }
  this.move(null, this.touch.yTemMove);
}

export default handle;
