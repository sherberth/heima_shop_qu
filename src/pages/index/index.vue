<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
// 1. 引入接口和类型
import {
  getHomeBannerAPI,
  getHomeCategoryAPI,
  getHomeHotAPI,
} from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'

// 2. 引入组合式函数
import { useGuessList } from '@/composables'

// 3. 引入组件 (根据你的目录，确保路径正确)
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'
import XgxSwiper from '@/components/XgxSwiper.vue'
// XgxGuess 组件因为配置了 easycom 规则，其实不需要手动 import，但这里为了直观保留
// import XgxGuess from '@/components/XgxGuess.vue'

// ==========================================
// 4. 核心：直接解构出我们需要的 ref 和触底函数
// ==========================================
const { guessRef, onScrolltolower } = useGuessList()

// ==========================================
// 5. 首页基础数据 (轮播、分类、热门)
// ==========================================
const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])
const hotList = ref<HotItem[]>([])
const isLoading = ref(true) // 骨架屏控制

// 自定义分类图标映射
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

const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const getHomeCategoryData = async () => {
  const resCategory = await getHomeCategoryAPI()
  categoryList.value = resCategory.result.map((item, index) => ({
    ...item,
    icon: customIcons[index] || item.icon,
  }))
}

const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result.map((item) => {
    const newItem = { ...item }
    // 文字替换
    if (newItem.title === '特惠推荐') newItem.title = '特惠'
    else if (newItem.title === '爆款推荐') newItem.title = '爆款'

    // 图片替换
    if (newItem.title === '一站买全') {
      newItem.pictures = [
        '/static/images/good_small1.png',
        '/static/images/good_small3.png',
      ]
    }
    return newItem
  })
}

// ==========================================
// 6. 页面生命周期
// ==========================================
onLoad(async (options) => {
  console.log('获取到的页面参数:', options)
  isLoading.value = true
  try {
    // 并发加载基础数据 (猜你喜欢组件会自动加载第一页，不需要在这里额外调)
    await Promise.all([
      getHomeBannerData(),
      getHomeCategoryData(),
      getHomeHotData(),
    ])
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

// ==========================================
// 7. 下拉刷新逻辑
// ==========================================
const isTriggered = ref(false)

const onRefresherrefresh = async () => {
  isTriggered.value = true

  // 重置猜你喜欢组件数据 (回到第一页)
  guessRef.value?.resetData()

  try {
    // 并发加载：基础数据 + 猜你喜欢第一页
    await Promise.all([
      getHomeBannerData(),
      getHomeCategoryData(),
      getHomeHotData(),
      guessRef.value?.getMore(),
    ])
  } catch (error) {
    console.error('下拉刷新失败', error)
    uni.showToast({ title: '刷新失败，请检查网络', icon: 'none' })
  } finally {
    isTriggered.value = false // 关闭下拉动画
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
