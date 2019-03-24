<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="listDetail" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  

  export default {
    data(){
      return {
        listDetail:[],
        rank:true
      }
    },
    components: {
      MusicList
    },
    computed: {
      ...mapGetters(['topList']),
      title(){
        return this.topList.name
      },
      bgImage(){
        return this.topList.coverImgUrl
      }
    },
    created() {
      if(!this.topList.id){
        this.$router.push("/rank")
      }
      this.listDetail = this._normalizeSongs(this.topList.tracks)
    },
    methods: {
      _normalizeSongs(list){
        if (!this.topList.id) {
        this.$router.push('/rank')
          return
        }
        let ret = []
        list.forEach((item) => {
          ret.push(createSong(item))
        })
        return ret
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>