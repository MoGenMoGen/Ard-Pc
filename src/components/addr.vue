<style lang="less">
.address1 {
  width: 100%;
  display: flex;
  align-items: center;
  .el-select {
    flex: 1;
    margin: 0 2px;
    /*border: 1px solid #bfcbd9;*/
    /*height: 36px;*/
    line-height: 1;
    border-radius: 4px;
  }
}
</style>
<template>
  <div class="address1">
    <el-select v-model="cityCode" placeholder="省份">
      <el-option v-for="item in cityList" :key="item.cd" :label="item.nm" :value="item.cd"></el-option>
    </el-select>
    <el-select v-model="cityCode2" placeholder="城市">
      <el-option v-for="item in cityList2" :key="item.cd" :label="item.nm" :value="item.cd"></el-option>
    </el-select>

    <!--<select v-model="cityCode">-->
    <!--<option value="" disabled value="">-->
    <!--省份-->
    <!--</option>-->
    <!--<option v-for="item in cityList" :value="item.cd">-->
    <!--{{item.nm}}-->
    <!--</option>-->
    <!--</select>-->
    <!--<select v-model="cityCode2">-->
    <!--<option value="" disabled value="">-->
    <!--城市-->
    <!--</option>-->
    <!--<option v-for="item in cityList2" :value="item.cd">-->
    <!--{{item.nm}}-->
    <!--</option>-->
    <!--</select>-->
    <!--<select v-model="cityCode3" v-if="cityCode3!='0'">-->
    <!--<option value="" disabled value="">-->
    <!--区/县-->
    <!--</option>-->
    <!--<option v-for="item in cityList3" :value="item.cd">-->
    <!--{{item.nm}}-->
    <!--</option>-->
    <!--</select>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityCode: "",
      cityCode2: "",
      cityCode3: "",
      cityList: [],
      cityList2: [],
      cityList3: []
    };
  },
  props: ["provCd", "city", "distCd"],
  mounted() {
    this.getCity();
    this.cityCode = this.provCd ? this.provCd : "";
    this.cityCode2 = this.city ? this.city : "";
    this.cityCode3 = this.distCd ? this.distCd : "";
  },
  methods: {
    //省份
    getCity() {
      this.until.get("/general/cat/listByPrntCd?prntCd=90000").then(res => {
        if (res.status == "200") {
          this.cityList = res.data.items;
        }
      });
    }
  },
  watch: {
    cityCode(val) {
      this.cityCode2 = "";
      console.log(this.cityCode3);
      this.cityCode3 = this.cityCode3 == "0" ? "0" : "";
      this.until.get("/general/cat/listByPrntCd?prntCd=" + val).then(res => {
        if (res.status == "200") {
          let cd = {
            cd1: this.cityCode
          };
          this.$emit("setAddr", JSON.stringify(cd));
          this.cityList2 = res.data.items;
        }
      });
    },
    cityCode2(val) {
      this.cityCode3 = this.cityCode3 == "0" ? "0" : "";
      this.until.get("/general/cat/listByPrntCd?prntCd=" + val).then(res => {
        if (res.status == "200") {
          let cd = {
            cd1: this.cityCode,
            cd2: this.cityCode2,
            cd3: val
          };
          this.$emit("setAddr", JSON.stringify(cd));
          if (this.cityCode3 == "0") {
          } else {
            this.cityList3 = res.data.items;
          }
        }
      });
    },
    cityCode3(val) {
      let cd = {
        cd1: this.cityCode,
        cd2: this.cityCode2,
        cd3: val
      };
      this.$emit("setAddr", JSON.stringify(cd));
    }
  }
};
</script>

<style lang="less">
.address-wrap {
  background-color: #fff;
  border-bottom: 1px solid #f7f7f7;
  margin-bottom: 0.2rem;
  .address-info {
    border-bottom: 1px solid #e3e3e3;
    padding: 0.4rem;
    > div:nth-of-type(1) {
      margin-bottom: 0.2rem;
      font-size: 12px;
      display: -webkit-flex;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      > span {
        width: 40%;
      }
    }
    > div:nth-of-type(2) {
      font-size: 12px;
    }
  }
  .address-operate {
    padding: 0.4rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    > div {
      width: 50%;
      display: flex;
      display: -webkit-flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      > div {
        text-align: center;
        padding: 0.1rem 0;
        width: 35%;
        border: 1px solid #d8d8d8;
        border-radius: 3px;
      }
    }
  }
}
</style>
