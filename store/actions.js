import * as types from './mutations-type'
import {shuffle} from "common/js/util"
import {playMode} from "common/js/config"
function findIndex(list,song){
  return list.findIndex((item)=>{
    return item.id === song.id
  })
}
export const selectPlay = function ({commit,state},{list,index}) {
  commit(types.SET_SEQUENCE_LIST,list)
  if(state.mode === playMode.random){
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    index = findIndex(randomList,list[index])
  }else {
    commit(types.SET_PLAYLIST,list)
  }
  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}
export const randomPlay = function ({commit},{list}) {
  commit(types.SET_PLAY_MODE,playMode.random)
  commit(types.SET_SEQUENCE_LIST,list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST,randomList)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}

export const insertSong = function ({commit,state},song) {
  let playlist = state.playlist
  let sequenceList = state.sequenceList
  let currentIndex = state.currentIndex
  //记录当前歌曲
  let currentSong = playlist[currentIndex]
  //查找当前列表是否有待插入的歌曲
  let fpIndex = findIndex(playlist,song)
  //插入歌曲索引加一
  currentIndex++
  //插入这首歌当前索引位置
  playlist.splice(currentIndex,0,song)
  //如果已经包含了这首歌
  if(fpIndex>-1){
    //如果当前插入的序号大于列表序号
    if(currentIndex>fpIndex){
      playlist.splice(fpIndex,1)
      currentIndex--
    }else {
      playlist.splice(fpIndex+1,1)
    }
  }

  let currentSIndex = findIndex(sequenceList,currentSong)+1
  let fsIndex = findIndex(sequenceList,song)
  sequenceList.splice(currentSIndex,0,song)
  if(fsIndex>-1){
    if(currentSIndex>fsIndex){
      sequenceList.splice(fsIndex,1)
    }else {
      playlist.splice(fsIndex+1,1)
    }
  }
  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)

}