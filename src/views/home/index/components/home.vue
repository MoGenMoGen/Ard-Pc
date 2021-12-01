<template>
  <div class="home">
    <div class="home-top">
      <el-carousel>
        <el-carousel-item v-for="item in adList" :key="item.id">
          <img :src="item.srcUrl" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <img :src="vrBg" />
    <div class="footer1">
      <!-- <iframe :src="srcUrl"></iframe> -->
      <el-carousel
        :interval="4000"
        type="card"
        height="700px"
        :autoplay="false"
        @change="changeShowTgt"
      >
        <el-carousel-item v-for="item in iframeList" :key="item.id">
          <!-- <h3 class="medium">{{ item }}</h3> -->
          <iframe :src="item.tgtUrl" frameborder="0" v-if="item.showTgt"></iframe>
          <img :src="item.srcUrl" v-else alt />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import vrBg from "../images/index-vr.png";
export default {
  data() {
    return {
      vrBg,
      srcUrl: "",
      adList: [],
      lengh: 0,
      showTgtIndex: 0,
      iframeList: []
    };
  },
  async mounted() {
    this.showTgtIndex = 0;
    await this.getIframeSrc();
    await this.getCarouselList();
  },
  methods: {
    async getIframeSrc() {
      let res = await this.api.getBaseDataOfAd({ cd: "indexOfPc" });
      res.data.map(item => {
        this.iframeList.push(item.sysAdVo);
      });

      this.displayWhichIframe();
    },
    async getCarouselList() {
      let res = await this.api.getBaseDataOfAd({ cd: "bannerOfPc" });
      if (res.data && res.data.length > 0) {
        res.data.map(item => {
          this.adList.push(item.sysAdVo);
        });
      }
    },
    changeShowTgt(curr, prev) {
      /* 切换下一张 */
      if (curr === 0) {
        this.showTgtIndex = 0;
      } else {
        if (curr > prev) {
          this.showTgtIndex += 1;
        } else {
          this.showTgtIndex -= 1;
        }
      }

      this.displayWhichIframe();
    },
    displayWhichIframe() {
      this.iframeList.map((item, index) => {
        if (index === this.showTgtIndex) {
          item.showTgt = true;
        } else {
          item.showTgt = false;
        }
        this.$set(this.iframeList, index, item);
      });
    }
  },
  components: {}
};
</script>

<style lang='less'>
.home {
  .home-top {
    width: 100%;
    background-color: black;
    .el-carousel__container {
      height: 80vh;
      img {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-width: 100%;
        vertical-align: middle;
      }
    }
  }
  > img {
    margin: 30px auto 10px;
    width: 50%;
    display: block;
  }
  .footer1 {
    margin-top: 50px;
    height: 75%;
    width: auto;
    background-color: #ffffff;
    iframe {
      height: 620px;
    }
    .el-carousel__item iframe {
      width: 100%;
      margin: 0px auto;
      border: 0px;
    }
    .el-carousel__indicators {
      display: none;
    }

    .el-carousel__arrow:hover {
      background-color: #ed6d00;
    }
  }
}
</style>
