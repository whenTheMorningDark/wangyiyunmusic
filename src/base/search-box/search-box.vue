<template>
<!-- 10-11 -->
  <div class="search-box">
    <i class="iconfont">&#xe615;</i>
    <input ref="query" class="box" :placeholder="placeholder" v-model="query"/>
    <i class="iconfont clear" v-show="query" @click="clear">&#xe609;</i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'
  export default {
    props:{
      placeholder:{
        type:String,
        default:"搜索歌曲，歌手"
      }
    },
    data(){
      return {
        query:""
      }
    },
    methods: {
      clear(){
        this.query = ""
      },
      setQuery(query){
        this.query = query
      },
      blur(){
        this.$refs.query.blur()
        // console.log(1)
      }
    },
    created(){
      this.$watch('query',debounce((newQuery)=>{
        this.$emit("query",newQuery)
      },200))
    }
  }
  
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background:#ddd
    border-radius: 6px
    .clear
      font-size: 12px
      color:#333
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: #fff
      color:#333
      font-size: $font-size-medium
      outline none
      padding 0 12px
      border-radius 4px
      &::placeholder
        color: #333
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>