<template>
  <scroll ref="suggest" 
  class="suggest" 
  :data="songs" 
  :pullup="pullup"
  @scrollToEnd="searchMore"
  :beforeScroll="beforeScroll"
  @beforeScroll = "listScroll"
  >
    <ul class="suggest-list">
      <li class="suggest-item" 
      v-for="(item,index) in songs" 
      :key="index"
      @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">
            {{item.name}}
          </p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !songs.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
 import {getSearchSongs, getSearchSuggest, getSongDetail} from 'api/search'
 import Scroll from "base/scroll/scroll"
 import {createSearchSong} from 'common/js/song'
 import Loading from "base/loading/loading"
 import Singer from 'common/js/singer'
 import {mapMutations,mapActions} from "vuex"
 import NoResult from "base/no-result/no-result"
  export default {
    data(){
      return {
        page:0,
        songs:[],
        pullup:true,
        hasMore:true,
        searchShow:true,
        suggest:{},
        beforeScroll:true
      }
    },
    props:{
      query:{
        type:String,
        default:""
      }
    },
    watch: {
      query(){
        this.search()
      }
    },
    methods: {
      selectItem(item){
        // console.log(item)
        getSongDetail(item.id).then(res=>{
          item.image = res.data.songs[0].al.picUrl
          this.insertSong(item)
        })
        
      },
      listScroll(){
        this.$emit("listScroll")
      },
      ...mapMutations({
        setSinger:"SET_SINGER"
      }),
      ...mapActions([
        'insertSong'
      ]),
      search(){
        this.hasMore = true
        this.searchShow = false
        if(!this.query){
          return
        }
        getSearchSongs(this.query,this.page).then(res=>{
          // console.log(res)
          if(!res.data.result.songs){
            this.hasMore = false
            return
          }
          let list = res.data.result.songs
          console.log(list)
          let ret = []
          list.forEach((item)=>{
            ret.push(createSearchSong(item))
          })
          // console.log(ret)
          this.songs = ret
        })
        this.page+=30
        getSearchSuggest(this.query).then(res=>{
          // console.log(res.data)
          this.suggest = res.data.result
        })
      },
      getIconCls(item){

      },
      searchMore(){
        console.log("aaaa")
        if(!this.hasMore){
          return
        }
        if(!this.songs.length){
          return
        }
        getSearchSongs(this.query,this.page).then(res=>{
          let list = res.data.result.songs
          if (!res.data.result.songs) {
            this.haveMore = false
            return
          }
          let ret = []
          list.forEach((item) => {
            ret.push(createSearchSong(item))
          })
          this.songs = this.songs.concat(ret)
          this.$emit('refresh')
          this.page += 30
        })
      }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        height 40px
        border-bottom 1px solid #dddddd
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color:#333
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>