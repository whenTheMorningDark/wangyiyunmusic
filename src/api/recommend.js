import axios from 'axios'
import {HOST} from 'common/js/config'
export function getRecommendBanner() {
  const url = HOST+"/banner"
  return axios.get(url);
}
export function getRecommendList() {
  const url = HOST+"/personalized"
  return axios.get(url)
}
export function getRecommendNewSong() {
  const url = HOST+"/personalized/newsong"
  return axios.get(url)
}
export function getRecommendListDetail (id) {
  const url = HOST + `/playlist/detail?id=${id}`
  return axios.get(url)
}