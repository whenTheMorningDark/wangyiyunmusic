<template>
<!-- 10-5 -->
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut" v-show="!query">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li 
              class="item" 
              v-for="(item,index) in hots"
              :key="index"
              @click="addQuery(item.first)"
              >
                <span>{{item.first}}</span>
              </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @listScroll="blurInput"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getSearchHot} from 'api/search'
  import {playlistMixin} from 'common/js/mixin'
  import Suggest from "components/suggest/suggest"
  export default {
    data(){
      return {
        hots:[],
        query:""
      }
    },
    components:{
      SearchBox,
      Suggest
    },
    created() {
      this._getSearchHot()
    },
    methods: {
      _getSearchHot(){
        getSearchHot().then(res=>{
          this.hots = res.data.result.hots
        })
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query){
        this.query = query
      },
      blurInput(){
        this.$refs.searchBox.blur()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color:#333
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: #ddd
            font-size: $font-size-medium
            color:#333
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>