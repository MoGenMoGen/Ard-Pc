<template>
  <div class="service">
  <personal-center>

  </personal-center>

  </div>
</template>

<script>
    import personalCenter from "./personalCenter.vue";

export default {
  data() {
    return {

    };
  },
  mounted() {},
  methods: {

  },
  components: {
      personalCenter,
  }
};
</script>

<style lang='less'>
.service {
  background-color: #f5f5f5;
  min-height: calc(~'100vh - 280px');
  .top-wrap {
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    .operate-top {
      width: 1200px;
      margin: 0 auto;
      display: -webkit-flex;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      > div {
        cursor: pointer;
        flex: 1;
        display: -webkit-flex;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        > div {
          padding: 20px 0;
          &:nth-of-type(1) {
            margin-right: 15px;
            img {
              width: 75px;
            }
          }
          &:nth-of-type(2) {
            /*flex: 1;*/
            font-size: 20px;
            font-weight: lighter;
            color: #666666;
          }
        }
      }
    }
  }
}
</style>
