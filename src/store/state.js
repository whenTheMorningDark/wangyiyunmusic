import { playMode } from 'common/js/config'
const state = {
  singer:{},
  playing:false,
  fullScreen:false,
  playlist:[],
  sequenceList:[],//播放模式
  mode:playMode.sequence,
  currentIndex:-1,
  disc:{},
  topList:{}
}
export default state