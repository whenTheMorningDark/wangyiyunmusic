<template>
  <transition name="slide">
    <music-list :title="title" :bgImage = "bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from "vuex"
  import {getRecommendListDetail} from "api/recommend"
  import { createSong } from "common/js/song"; 
  export default {
    data(){
      return {
        songs:[]
      }
    },
    components:{
      MusicList
    },
    computed: {
      title(){
        return this.disc.name
      },
      bgImage(){
        return this.disc.picUrl
      },
      id(){
        return this.disc.id
      },
      ...mapGetters(
        ['disc']
      )
    },
    created() {
      this._getRecommendListDetail(this.disc.id)
    },
    methods: {
      _getRecommendListDetail(id){
        getRecommendListDetail(id).then(res=>{
          this.songs = this._normalizeSongs(res.data.playlist.tracks)
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          ret.push(createSong(item));
        });
        return ret;
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>