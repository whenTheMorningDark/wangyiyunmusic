<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="scroll">
      <ul>
        <li class="item"  v-for="item in yunTopList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.coverImgUrl" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.top" :key="index">
              <span>{{index + 1}}.</span>
              <span>{{song.name}} - {{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- <div class="loading-container" v-show="!yunTopList.length">
        <loading></loading>
      </div> -->
      <div v-show="showLoading" class="loading-content">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getTop} from 'api/rank'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  // import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  const YUNMUSIC_TOP = [0, 1, 2, 3, 4, 22, 23]
  export default {
    data(){
      return{
        yunTopList:[]
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
      _getTopList(){
        for (let i = 0; i < YUNMUSIC_TOP.length; i++) {
          getTop(YUNMUSIC_TOP[i]).then((res) => {
            let list = res.data.playlist
            list.top = res.data.playlist.tracks.slice(0, 3)
            this.yunTopList.push(list)
          })
          if (i === YUNMUSIC_TOP.length - 1) {
            this.showLoading = false
          }
        }
      },
       ...mapMutations({
        setTopList:"SET_TOP_LIST" 
      }),
      selectItem(item){
        this.$router.push({
          path:`/rank/${item.id}`
        })
        this.setTopList(item)
      }
    },
    components:{
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 7px
        padding-top: 10px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background:#ddd
          color:#333
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>