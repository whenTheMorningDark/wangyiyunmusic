<!-- create by kafei -->
<template>
  <div v-if="itemList.length>0">
    <div class="recommend-title">
      <div class="title">{{title}}</div>
    </div>
    <div class="recommend-list-content">
      <div class="item" v-for="(item,index) in itemList" :key="index" @click="clickItem(item)">
        <div class="img">
          <img v-lazy="item.picUrl" alt srcset>
        </div>
        <p class="desc" v-html="item.name"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    clickItem(item){
      this.$emit("clickItem",item)
    }
  },
  components: {}
};
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
.recommend-title {
  display: flex;
  height: 40px;
  align-items: center;
  box-sizing: border-box;
  padding: 0 6px;
  justify-content: space-between;
  color: #333;
}
.recommend-list-content {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 33.3%;
    position: relative;
    box-sizing: border-box;
    padding: 0 1%;
    margin-bottom: 5px;
    .img {
      width: 100%;
      height: 120px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .desc {
      color: #666;
      overflow: hidden;
      height: 40px;
      font-size: 14px;
      box-sizing: border-box;
      padding: 4px 0;
      line-height: 20px;
    }
  }
}
</style>