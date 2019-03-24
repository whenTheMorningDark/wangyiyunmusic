<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" 
      v-for="(item,index) in dots" 
      :key="index"
      :class="{active:currenPageIndex === index}"
      ></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll"
  import  {addClass} from 'common/js/dom'
  export default {
    data(){
      return{
        dots:[],
        currenPageIndex:0
      }
    },
    props:{
      loop:{
        type:Boolean,
        default:true
      },
      autoPlay:{
        type:Boolean,
        default:true
      },
      interval:{
        type:Number,
        default:4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if(this.autoPlay){
          this._play()
        }
      }, 20);
      window.addEventListener("resize",()=>{
        // console.log(1)
        if(!this.slider){
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth(isResize){
        this.children = this.$refs.sliderGroup.children;
        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for(let i=0;i<this.children.length;i++){
          let child = this.children[i]
          addClass(child,'slider-item')
          child.style.width = sliderWidth+"px" //每个子元素添加父元素的宽度
          width+=sliderWidth //总的宽度也是需要累加
        }

        if(this.loop && !isResize){
            width+=2*sliderWidth
        }
        this.$refs.sliderGroup.style.width = width+"px"

      },
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider,{
          scrollX: true,
        // scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          snapSpeed: 400,
          bounce: false,
          stopPropagation: true,
          click: true
        })
        this.slider.on("scrollEnd",()=>{
          let pageIndex = this.slider.getCurrentPage().pageX
          
          this.currenPageIndex = pageIndex
          // console.log(this.currenPageIndex)
          if (this.autoPlay) { //监听滚动结束后 if autoplay 为true的时候，继续触发
            this._play()
          }
        })
      },
      _initDots(){
        this.dots = new Array(this.children.length)
      },
      _play(){
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>