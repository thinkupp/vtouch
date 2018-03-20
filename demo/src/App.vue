<template>
  <div id="app">
    <div class="handle">
      <v-button
        v-for="(button, i) in buttonContent"
        :key="i"
        :str="button"
        @click="selectBtn(button)"
      ></v-button>
    </div>

    <div class="option">
      <p>开启滑动过渡效果：<input type="checkbox" v-model="openCommon"></p>
      <p>锁定横轴：<input type="checkbox" v-model="lockX"></p>
      <p>锁定纵轴：<input type="checkbox" v-model="lockY"></p>
      <p>注：锁定横轴和锁定纵轴不影响toLeft等几个方法的效果</p>
    </div>

    <div class="ob-Server">
      状态：{{status}}
    </div>

    <div class="vueTouchDemo">
      <upp-touch
        ref="vueTouch"
        :commonSlideTransition="openCommon"
        :lockX="lockX"
        :lockY="lockY"
        @x-start="changeStatus(0)"
        @x-end="changeStatus(1)"
        @y-start="changeStatus(2)"
        @y-end="changeStatus(3)"
        @XStart="changeStatus(4)"
        @XEnd="changeStatus(5)"
        @YStart="changeStatus(6)"
        @YEnd="changeStatus(7)"
        @leftMoving="changeStatus($event, 8)"
        @rightMoving="changeStatus($event, 9)"
        @topMoving="changeStatus($event, 10)"
        @bottomMoving="changeStatus($event, 11)"
      >
        <ul class="scrollWrapper">
          <li
            v-for="(item, i) in listData"
            :key="i"
          >{{item}}
          </li>
        </ul>
      </upp-touch>
    </div>
  </div>
</template>

<script>
  import VButton from './components/button/button.vue'
  import uppTouch from 'upp-touch'

  export default {
    name: 'app',
    data() {
      return {
        listData: [],
        buttonContent: [],
        openCommon: false,
        lockX: false,
        lockY: false,
        status: "滑动到边界以查看效果"
      }
    },

    components: {
      VButton,
      uppTouch
    },

    methods: {
      initData() {
        this.buttonContent = [
          'toLeft', 'toRight', 'toTop', 'toBottom'
        ];

        for (let i = 0; i < 50; i++) {
          this.listData.push(this.makeNumber(50));
        }
      },

      makeNumber(num) {
        let number = '';
        for (let i = 0; i < num; i++) {
          number += Math.round(Math.random() * 9);
        }
        return number;
      },

      selectBtn(type) {
        this.$refs.vueTouch[type]();
      },

      changeStatus(number, type) {
        if(!type) type = number;
        if(number) number = Math.abs(number);
        if(type === 0) this.status = '已滑动到横轴的起始位置';
        if(type === 1) this.status = '已滑动到横轴的末尾';
        if(type === 2) this.status = '已滑动到纵轴的起始位置';
        if(type === 3) this.status = '已滑动到纵轴的末尾';
        if(type === 4) this.status = '已在横轴起始位置，未发生滑动';
        if(type === 5) this.status = '已在横轴末尾，未发生滑动';
        if(type === 6) this.status = '已在纵轴起始位置，未发生滑动';
        if(type === 7) this.status = '已在纵轴末尾，未发生滑动';
        if(type === 8) this.status = `页面已向左方滑动，移动的距离：${number}`;
        if(type === 9) this.status = `页面已向右方滑动，移动的距离：${number}`;
        if(type === 10) this.status = `页面已向上方滑动，移动的距离：${number}`;
        if(type === 11) this.status = `页面已向下方滑动，移动的距离：${number}`;

      }
    },

    created() {
      this.initData();
    },
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  ul, li {
    list-style: none;
  }

  html, body, #app {
    height: 100%;
    overflow: hidden;
  }

  .vueTouchDemo {
    width: 200px;
    height: 300px;
    overflow: hidden;
    border: 1px solid #000;
    margin: 100px auto;
  }

  .scrollWrapper {
    display: inline-block;
  }

  .scrollWrapper li {
    display: inline-block;
  }

  .handle {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }

  .option {
    margin: 10px;
  }

  .ob-Server {
    text-align: center;
  }
</style>
