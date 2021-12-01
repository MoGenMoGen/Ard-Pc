<template>
  <div class="footer-wrap">
    <div>
      <span>版权所有&copy;宁波埃瑞德智能家居有限公司</span>
    </div>
    <div>
      <span>技术支持：宁波聚联科技有限公司</span>

    </div>

  </div>
</template>

<script>
export default {

}
</script>

<style lang='less'>
  .footer-wrap{
   
    padding: 35px 0;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    justify-content: space-around;
    color: #fff;
    align-items: center;
    border-top: 1px solid #eee;
    background-color: #303030;
    >div{
      width: 100%;
      text-align: center;
      &:not(:nth-last-of-type(1)){
        margin-bottom: 20px;
      }
    }
  }
</style>
