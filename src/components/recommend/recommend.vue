<!-- create by kafei -->
<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="recommendList" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="banner.length">
          <slider>
            <div v-for="(item,index) in banner" :key="index">
              <a>
                <img :src="item.imageUrl" alt @load="loadImage" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <recommend-item :itemList="recommendList" title="最新推荐" @clickItem="selectItem"></recommend-item>
          <recommend-item :itemList="newSongList" title="最新音乐" @clickItem="selectItem"></recommend-item>
        </div>
        <div class="loading-container" v-show="!recommendList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  getRecommendBanner,
  getRecommendList,
  getRecommendNewSong
} from "api/recommend";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import RecommendItem from "./pages/RecommendItem";
import {playlistMixin} from "common/js/mixin"
import { mapMutations } from "vuex"
export default {
  mixins:[playlistMixin],
  data() {
    return {
      banner: [],
      recommendList: [],
      newSongList: []
    };
  },

  components: {
    Slider,
    Scroll,
    Loading,
    RecommendItem
  },
  created() {
    this._getBanner();
    this._getRecommendList();
    this._getRecommendNewSong();
  },
  methods: {
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.id}`
      })
      this.setDisc(item)
    },
    handlePlaylist(playlist){
      const bottom = playlist.length>0 ? "60px" : ""
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getBanner() {
      getRecommendBanner().then(res => {
        // console.log(res)
        if (res.data.code === 200) {
          this.banner = res.data.banners.splice(4);
        }
      });
    },
    _getRecommendList() {
      getRecommendList().then(res => {
        if (res.data.code === 200) {
          this.recommendList = res.data.result.splice(0, 6);
          // console.log(this.recommendList);
        }
      });
    },
    _getRecommendNewSong() {
      getRecommendNewSong().then(res => {
        if (res.data.code === 200) {
          this.newSongList = this._initSong(res.data.result).splice(0, 6);
          // console.log(this.newSongList);
        }
      });
    },
    _initSong(list) {
      // console.log(list)
      const ret = [];
      list.map((item, index) => {
        // console.log(item.song.album)
        const json = {
          id: item.song.album.id,
          name: item.song.album.name,
          picUrl: item.song.album.picUrl
        };
        ret.push(json);
      });
      return ret;
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    ...mapMutations(
      {setDisc:'SET_DISC'}
    )
  }
};
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    background: #fefefe;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      clear: both;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>