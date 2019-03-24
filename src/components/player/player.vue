<template>
  <div class="player" v-show="playlist.length>0">
    <!-- 711 -->
    <transition name="normal">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="iconfont">&#xe601;</i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>

      <div 
        class="middle" 
        @touchstart.prevent = "middleTouchStart"
        @touchmove.prevent = "middleTouchMove"
        @touchend.prevent = "middleTouchEnd"
        >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper">
            <div class="cd" :class="cdCls">
              <img class="image" :src="currentSong.image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">
              {{playingLyric}}
            </div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyriclist" :data="currentLyric && currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p 
              ref="lyricLine" 
              class="text" 
              v-for="(lines,index) in currentLyric.lines" 
              :key="index"
              :class="{'current':currentLineNum === index}"
              >
                {{lines.txt}}
              </p>
            </div>
          </div>
        </scroll>
      </div>

      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
          <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">
            {{format(currentTime)}}
          </span>
          <div class="progress-bar-wrapper">
            <progress-bar 
            :percent="percent"
            @percentChange = "onProgressChange"
            ></progress-bar>
          </div>
          <span class="time time-r">
            {{format(duration)}}
          </span>
        </div>

        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i class="iconfont" v-html="iconMode"></i>
          </div>
          <div class="icon i-left" @click="prev" :class="disbleCls">
            <i class="iconfont">&#xe62b;</i>
          </div>
          <div class="icon i-center" @click="togglePlay" :class="disbleCls">
            <i class="iconfont" v-if="playIcon">&#xe69d;</i>
            <i class="iconfont" v-if="!playIcon">&#xe742;</i>
          </div>
          <div class="icon i-right" @click="next" :class="disbleCls">
            <i class="iconfont">&#xe62d;</i>
          </div>
          <div class="icon i-right">
            <i class="iconfont">&#xe614;</i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img 
          :class="cdCls"
          width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlay">
          <progress-circle :radius="radius" :percent="percent">
            <i class="iconfont mini" v-if="playIcon">&#xe69d;</i>
            <i class="iconfont mini" v-if="!playIcon">&#xe742;</i>
          </progress-circle>
        </div>
        <!-- <div class="control">
          <i class="icon-playlist"></i>
        </div> -->
      </div>
    </transition>
    <audio 
      :src="url" 
      ref="audio" 
      @canplay="ready"
      @error = "error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
    </div>
  
</template>

<script type="text/ecmascript-6">
  import {mapGetters,mapMutations} from 'vuex'
  import animations from "create-keyframe-animation"
  import {getSong,getLyric} from "api/song"
  import ProgressBar from "base/progress-bar/progress-bar"
  import ProgressCircle from "base/progress-circle/progress-circle"
  import { playMode } from "common/js/config"
  import {shuffle} from "common/js/util"
  import Lyric from 'lyric-parser'
  import Scroll from "base/scroll/scroll"
  export default {
    data(){
      return {
        url:"",
        songReady:false,
        currentTime:0,
        duration:0,
        radius:32,
        currentLyric :null, //歌词
        currentLineNum:0,
        currentShow:'cd',
        playingLyric:"" //cdwrapper播放的歌词
      }
    },
    computed: {
      ...mapGetters(
        ['fullScreen','playlist','currentSong','playing',"currentIndex","mode","sequenceList"]
      ),
      playIcon(){
        return this.playing?true:false
      },
      cdCls(){
        return this.playing ? "play" :"play pause"
      },
      disbleCls(){
        return this.songReady ? "":"disable"
      },
      percent(){
        return this.currentTime / this.duration 
      },
      iconMode(){
        return this.mode === playMode.sequence ? "&#xe64d;":this.mode === playMode.loop ? "&#xe624;":"&#xe618;"
      }
    },
    created() {
      this.touch = {}
    },
    methods:{
      back(){
        this.setFullScreen(false)
      },
      open(){
        this.setFullScreen(true)
      },
      //7-6
      ...mapMutations(
        {
          setFullScreen:"SET_FULL_SCREEN",
          setPlayingState:"SET_PLAYING_STATE",
          setCurrentIndex:"SET_CURRENT_INDEX",
          setPlayMode : "SET_PLAY_MODE",
          setPlayList : "SET_PLAYLIST"
          },
      ),
      _getSong (id){
        getSong(id).then(res=>{
          if(res.data.code == 200){
            this.url = res.data.data[0].url
            setTimeout(() => {
              this.$refs.audio.play()
            }, 1000);
          }
        })
      },
      //获取歌词
      _getLyric(id){
        getLyric(id).then(res=>{
          if(res.data.code === 200){
            // console.log(res.data.lrc.lyric)
           this.currentLyric = new Lyric(res.data.lrc.lyric,this.handleLyric)
           if(this.playing){
             this.currentLyric.play()
           }
          }
        }).catch(()=>{
          this.currentLyric = null
          this.playingLyric = ""
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum,txt}){
        this.currentLineNum = lineNum
        if(lineNum>5){
          let lineEl = this.$refs.lyricLine[lineNum-5]
          this.$refs.lyriclist.scrollToElement(lineEl,1000)
        }else {
          this.$refs.lyriclist.scrollToElement(0,0,1000)
        }
        this.playingLyric = txt
      },
      togglePlay(){
        if(!this.songReady){
          return
        }
        this.setPlayingState(!this.playing)
        if(this.currentLyric){
          this.currentLyric.togglePlay()
        }
      },
      prev(){
        if(!this.songReady){
          return
        }
        if(this.playlist.length === 1){
          this.loop()
        }else {
          let index = this.currentIndex - 1
          if(index === -1){
            index = this.playlist.length-1
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlay()
          }
        }
        this.songReady = false
      },
      end(){
        if(this.mode === playMode.loop){
          this.loop()
        }else {
          this.next()
        }
        
      },
      loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if(this.currentLyric){
          this.currentLyric.seek(0)
        }
      },
      next(){
        if(!this.songReady){
          return
        }
        if(this.playlist.length === 1){
          this.loop()
        }else {
          let index = this.currentIndex + 1
          if(index === this.playlist.length){
            index = 0
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlay()
          }
        }
        this.songReady = false
      },
      ready(){
        this.songReady = true
        this.duration = this.$refs.audio.duration
      },
      error(){
        this.songReady = true
      },
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      format(interval){
        interval = interval | 0 //向下取整
        const minute = interval/60 | 0
        const second = this._pad(interval%60)
        return `${minute}:${second}`
      },
      _pad(num,n=2){
        let len = num.toString().length
        while(len<n){
          num = '0'+num
          len++
        }
        return num
      },
      onProgressChange(percent){
        const currentTime = this.duration * percent
        this.$refs.audio.currentTime = currentTime
        if(!this.playing){
          this.togglePlay()
        }
        if(this.currentLyric){
          this.currentLyric.seek(currentTime*1000)
        }
      },
      changeMode(){
        const mode = (this.mode+1) % 3
        this.setPlayMode(mode)
        let list = null
        if(mode === playMode.random){
          list = shuffle(this.sequenceList)
        }else {
          list = this.sequenceList
        }
        this._resetCurrentIndex(list)
        this.setPlayList(list)
      },
      _resetCurrentIndex(list){
        let index = list.findIndex((item)=>{
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      middleTouchStart(e){
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if(Math.abs(deltaY)>Math.abs(deltaX)){
          return
        }
        const left = this.currentShow === "cd" ? 0 :-window.innerWidth
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyriclist.$el.style["transform"] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyriclist.$el.style["transitionDuration"] = `0ms`
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style["transitionDuration"] = `0ms`
      },
      middleTouchEnd(){
        let offsetWidth
        let opacity
        if(this.currentShow === "cd"){
          if(this.touch.percent>0.1){
            offsetWidth = -window.innerWidth
            this.currentShow = "lyric"
            opacity = 0
          }else {
            offsetWidth = 0
            opacity = 1
          }
        }else {
          if(this.touch.percent<0.9){
            offsetWidth = 0
            this.currentShow = "cd"
            opacity = 1
          }else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyriclist.$el.style["transform"] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyriclist.$el.style["transitionDuration"] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style["transitionDuration"] = `0ms`
      }
    },
    //监听每首歌的变化获取id
    watch: {
      currentSong (newVal,oldVal){
        if(!newVal.id || newVal.id === oldVal.id){
          return
        }
        if(this.currentLyric){
          this.currentLyric.stop()
        }
        this._getSong(newVal.id)
        this._getLyric(this.currentSong.id)
        // console.log(this.$refs.audio.duration)
      },
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components:{
      ProgressBar,
      ProgressCircle,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .iconfont
    color:#fff
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background:#222
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 12px
          left: 12px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color:#ddd
              font-size: $font-size-medium
              &.current
                color:#fff
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 30px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .mini
          position: absolute
          top: 8px;
          left: 9px;


  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>