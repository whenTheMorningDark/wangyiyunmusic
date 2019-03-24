<!-- create by kafei -->
<template>
  <scroll 
  class="listview" 
  :data="data" 
  ref="listview"
  :listenScroll="listenScroll"
  @scroll="scroll"
  :probeType="probeType"
  >
    <ul>
      <li 
      v-for="(group,index) in data" 
      class="list-group"
      :key="index"
      ref="listGroup"
      >
        <h2 class="list-group-title">
          {{group.title}}
        </h2>
        <ul>
          <li 
            v-for="(item,index) in group.items"
            class="list-group-item"
            :key="index"
            @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
      @touchstart = "onShortcutTouchStart"
      @touchmove.stop.prevent = "onShortcutTouchMove"
    >
      <ul>
        <li 
          v-for="(item,index) in shortcutList"
          class="item"
          :key="index"
          :data-index = "index"
          :class="{'current':currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll"
import {getData} from "common/js/dom"
const HEIGHT = 18;
export default {
  created(){
    this.touch = {} //不需要观测tocu变化
    this.listenScroll = true
    this.listHeight = []
    this.probeType=3
  },
  props:{
    data:{
      type:Array,
      default:[]
    }
  },
  data () {
    return {
      scrollY:-1,
      currentIndex:0
    };
  },
  computed: {
    shortcutList(){
      return this.data.map((item)=>{
        return item.title.substr(0,1)
      })
    }
  },
  components: {
    Scroll
  },
  methods: {
    refresh(){
      this.$refs.listview.refresh()
    },
    onShortcutTouchStart(e){
      let achorIndex = getData(e.target,"index");
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.achorIndex = achorIndex
      this._scrollTo(achorIndex)
    },
    onShortcutTouchMove(e){
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / HEIGHT | 0
      let achorIndex = parseInt(this.touch.achorIndex) + delta
      
      this._scrollTo(achorIndex)
    },
    _scrollTo(index){
      // console.log(index)
      if(!index && index!==0){
        return
      }
      if(index<0){
        index = 0
      }else if(index>this.listHeight.length-2){
        index=this.listHeight.length-2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
    },
    scroll(pos){
      this.scrollY = pos.y
    },
    _calculateHeight(){
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i=0;i<list.length;i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectItem(item){
      this.$emit("select",item)
    }
  },
  watch: {
      data(){
        setTimeout(() => {
          this._calculateHeight()
        }, 20);
      },
      scrollY(newY){
        const listHeight = this.listHeight
        //当滚动到顶部 newY>0
        if(newY>0){
          this.currentIndex = 0
          return
        }
        //中间部分
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i+1]
          if((-newY)>=height1 && -newY<height2){
            this.currentIndex = i
            // console.log(this.currentIndex)
            return
          }
        }
        // 滚动到底部 
        this.currentIndex = listHeight.length -2
      }
    },

}

</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background:#f1f1f1
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color:#fff;
        background: rgba(0,0,0,0.3)
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color:#333
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: red;
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>