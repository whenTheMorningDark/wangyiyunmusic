<!-- create by kafei -->
<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    
      <router-view></router-view>
    
  </div>
</template>

<script>
import {getSingers} from "api/singer"
const HOST_NAME = "热门"
const HOT_SINGER_LIST = 10
const pinyin = require('pinyin')
import Singer from "common/js/singer"
import ListView from "base/listview/listview"
import {mapMutations} from 'vuex'
import {playlistMixin} from "common/js/mixin"
export default {
  mixins:[playlistMixin],
  data () {
    return {
      singers:[]
    };
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlaylist(playlist){
      const bottom = playlist.length>0 ? "60px" : ""
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapMutations({
      setSinger:"SET_SINGER"
    }),
    selectSinger(singer){
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList(){
      getSingers().then(res=>{
        let s = res.data.artists
        s.map((item)=>{
          let py = pinyin(item.name[0],{
            style:pinyin.STYLE_FIRST_LETTER
          })
          item.initial = py[0][0].toUpperCase()
        })
        this.singers = this._normalizeSinger(s)
      })
    },
    _normalizeSinger(list){
      let map = {
        hot:{
          title:HOST_NAME,
          items:[]
        }
      }
      list.forEach((item,index)=>{
        // console.log(item)
        if(index<HOT_SINGER_LIST){
          map.hot.items.push({
            id:item.id,
            name:item.name,
            avatar:item.picUrl
          })
        }
        const key = item.initial
        if(!map[key]){
          map[key] = {
            title:key,
            items:[]
          }
        }
        map[key].items.push(
          {
            id:item.id,
            name:item.name,
            avatar:item.picUrl
          }
        )
      })
      // 有序列表
      // console.log(map)
      let hot = []
      let ret = []
      for(let key in map){
        let val = map[key];
        if(val.title.match(/[a-zA-Z]/)){
          ret.push(val)
        }else if(val.title === HOST_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a,b)=>{
        return a.title.charCodeAt(0)- b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  },
  components: {
    ListView
  }
}

</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
  .singer
    position:fixed
    top:88px
    bottom 0px
    width 100%
</style>