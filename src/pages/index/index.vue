<script setup lang="ts">
// 引入刚才写好的自定义导航栏组件

import {
  getHomeBannerAPI,
  getHomeCategoryAPI,
  getHomeHotAPI,
  getHomeGoodsGuessLikeAPI,
} from '@/services/home'
import type { BannerItem, CategoryItem, HotItem, GuessItem } from '@/types/home'
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app' // 记得在顶部引入
import type { XgxGuessInstance } from '@/types/component' // 已有此类型

// // 下拉刷新触发
// onPullDownRefresh(async () => {
//   // 1. 清空当前列表
//   // （这里需要调用子组件的方法重置数据，或者直接重新拉取）

//   // 2. 重新请求首页数据
//   await getHomeBannerData()
//   await getHomeCategoryData()
//   await getHomeHotData()

//   // 如果子组件暴露了重置方法，也可以调用
//   // guessRef.value?.resetData()

//   // 3. 停止下拉动画（必须写，否则圈圈一直转）
//   uni.stopPullDownRefresh()
// })
import XgxSwiper from '@/components/XgxSwiper.vue' // 2. 引入你写的轮播图组件
import XgxGuess from '@/components/XgxGuess.vue'

import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'
import CategoryPanel from '@/pages/index/components/CategoryPanel.vue'
import HotPanel from '@/pages/index/components/HotPanel.vue'
import PageSkeleton from '@/pages/index/components/PageSkeleton.vue'
//
const bannerList = ref<BannerItem[]>([])
//
const categoryList = ref<CategoryItem[]>([])
const hotList = ref<HotItem[]>([]) // 👈 改动：新增热门推荐数据容器

const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  //console.log(res)
  bannerList.value = res.result
}
// 3. 封装分类请求（保留你的 map 逻辑）
const getHomeCategoryData = async () => {
  const resCategory = await getHomeCategoryAPI()
  categoryList.value = resCategory.result.map((item, index) => ({
    ...item,
    icon: customIcons[index] || item.icon,
  }))
}
/**
 * 数据加工函数（核心证明点）
 */
// 把你写好的 10 个 svg 路径提出来，避免在 map 里重复创建
const customIcons: Record<number, string> = {
  0: '/static/images/category_1.svg',
  1: '/static/images/category_2.svg',
  2: '/static/images/category_3.svg',
  3: '/static/images/category_4.svg',
  4: '/static/images/category_5.svg',
  5: '/static/images/category_6.svg',
  6: '/static/images/category_7.svg',
  7: '/static/images/category_8.svg',
  8: '/static/images/category_9.svg',
  9: '/static/images/category_10.svg',
}
// 获取热门推荐数据
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  // 👇 截图里没截到下面这行，但你肯定需要把拿到的数组存进响应式变量里
  // 假设你之前定义了 const hotList = ref<HotItem[]>([])
  //hotList.value = res.result
  hotList.value = res.result.map((item, index) => {
    // 假设你只想替换“第一个板块”里的“第一张图”
    // 1. 先复制一份原来的数据，准备对它进行改造
    const newItem = { ...item }

    // // 2. 处理图片替换（用你之前的逻辑）
    // if (index === 1) {
    //   newItem.pictures = [
    //     '/static/images/good_small1.png', // 换成你的图
    //     item.pictures[1], // 保留后端第二张图
    //   ]
    // }
    // if (index === 3) {
    //   newItem.pictures = [
    //     '/static/images/good_small3.png', // 换成你的图
    //     item.pictures[1], // ⚠️ 你原来写的 [0]，如果想保留第二张网图应该用 [1]
    //   ]
    // }
    // 3. 处理文字替换（无论前面图片怎么换，这一步都会执行）
    if (newItem.title === '特惠推荐') {
      newItem.title = '特惠'
    } else if (newItem.title === '爆款推荐') {
      newItem.title = '爆款'
    }
    // 假设“一站买全”的下标是 2 (从 0 开始算)
    if (newItem.title === '一站买全') {
      newItem.pictures = [
        '/static/images/good_small1.png', // 换成你本地好看的图
        '/static/images/good_small3.png', // 换成你本地好看的图
      ]
    }
    // 4. 统一返回加工好的对象
    return newItem
  })
}
//封装为res，onLoad时候再加载
// // 用 await 保证两个请求按顺序走完，或者直接并发请求（不加 await）也可以
// 改用并发，首屏加载速度提升数倍
// 是否加载中标记
const isLoading = ref(true)

// 页面加载
// // 👇 强制等待 2000 毫秒（2秒），让你用肉眼看清骨架屏
// // 无论成功还是失败，最后都一定要关闭骨架屏
// 把参数塞进原来的括号里
onLoad(async (options) => {
  // 1. 先拿参数
  console.log('获取到的页面参数:', options) // options 里就有 { type: '1' }
  const currentType = options?.type || '1' // 兜底处理，防止没传参数

  // 2. 再发请求（用拿到的参数去请求）
  isLoading.value = true
  try {
    // 假设你的请求函数需要传这个 type
    // await getHotData(currentType)

    // 或者并发请求
    await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

//// 直接根据组件推导出实例类型
const guessRef = ref<XgxGuessInstance>()
const onScrolltolower = () => {
  console.log('------ 触底了！准备加载下一页 ------')
  guessRef.value?.getMore()
}
// 下拉刷新触发
// 当前下拉刷新状态
const isTriggered = ref(false)

// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 1. 开始动画
  isTriggered.value = true

  // 2. 重置猜你喜欢组件数据 (调用子组件的 resetData)
  guessRef.value?.resetData()

  // 3. 并发加载所有数据（首页三项 + 猜你喜欢第一页）
  try {
    await Promise.all([
      getHomeBannerData(),
      getHomeCategoryData(),
      getHomeHotData(),
      guessRef.value?.getMore(), // 这里不需要 await，因为外层已经是 Promise.all
    ])
  } catch (error) {
    console.error('下拉刷新失败', error)
    uni.showToast({ title: '刷新失败，请检查网络', icon: 'none' })
  } finally {
    // 👈 核心：不管成功还是失败，finally 里的代码一定会执行
    // 4. 关闭动画
    isTriggered.value = false
  }
}
</script>

<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <CustomNavbar />
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <!-- 滚动容器 -->
      <scroll-view
        refresher-enabled
        @refresherrefresh="onRefresherrefresh"
        :refresher-triggered="isTriggered"
        @scrolltolower="onScrolltolower"
        class="scroll-view"
        scroll-y
      >
        <XgxSwiper :list="bannerList" />
        <CategoryPanel :list="categoryList" />
        <HotPanel :list="hotList" />
        <XgxGuess ref="guessRef" />
        <!-- 👆 删掉底部的这首页区 -->
      </scroll-view>
    </template>
  </view>
</template>

<style lang="scss">
.page-container {
  //padding: 20rpx;
  text-align: center;

  height: 100vh;
  display: flex;
  flex-direction: column;
}
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
  /* 这一句极其关键！它防止内容撑破容器 */
  overflow: hidden;
  /* 隐藏滚动条 */
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }
}
</style>
