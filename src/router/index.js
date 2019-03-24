import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Recommend = ((resolve)=>{
  import('components/recommend/recommend').then((recommend)=>{
    resolve(recommend)
  })
})
const Singer = ((resolve)=>{
  import('components/singer/singer').then((singer)=>{
    resolve(singer)
  })
})
const Rank = ((resolve)=>{
  import('components/rank/rank').then((rank)=>{
    resolve(rank)
  })
})
const Search = ((resolve)=>{
  import('components/search/search').then((search)=>{
    resolve(search)
  })
})
const SingerDetail = ((resolve)=>{
  import('components/singer-detail/singer-detail').then((module)=>{
    resolve(module)
  })
})
const Disc = ((resolve)=>{
  import('components/disc/disc').then((disc)=>{
    resolve(disc)
  })
})
const TopList = ((resolve)=>{
  import('components/top-list/top-list').then((module)=>{
    resolve(module)
  })
})
export default new Router({
  routes: [
    {
      path: '/',
      redirect:"/recommend"
    },
    {
      path:'/recommend',
      component:Recommend,
      children:[
        {
          path:":id",
          component:Disc
        }
      ]
    },
    {
      path:'/singer',
      component:Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/Rank',
      component:Rank,
      children:[
        {
          path:":id",
          component:TopList
        }
      ]
    },
    {
      path:'/Search',
      component:Search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
