<script setup lang="ts">
// ==========================================
// 1. 这里放所有的 import (引入)
// ==========================================
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getHotRecommendAPI } from '@/services/hot'
import type { HotResult, SubTypeItem } from '@/types/hot'
import { processGoodsData } from '@/utils/goodsHandler'
// 热门推荐页 标题和url
// 3. 这里放响应式数据 (比如你问的 activeTab)
// ==========================================
// 👇 核心：必须定义这些变量，否则模板直接报错
const bannerPicture = ref('')
const currentUrl = ref('')
const subTypes = ref<(SubTypeItem & { finish?: boolean; isLoading?: boolean })[]>([])
const activeIndex = ref(0) // 用来记录当前选中的 Tab

const urlMap = [
  { type: '1', title: '特惠', url: '/hot/preference' },
  { type: '2', title: '爆款', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]

// 定义变量存数据
// uniapp 获取页面参数
// 4. 这里放页面生命周期 onLoad (接参数+发请求)

// 2. 讲师的魔法：用 defineProps 接参数
// const query = defineProps<{
//   type: string
// }>()
const getHotRecommendData = async (url: string) => {
  // 传入 url，不依赖外部变量
  const res = await getHotRecommendAPI<HotResult>(url, {
    page: 1, // 为了先看到数据，这里改成 1
    pageSize: 10,
  })

  //
  bannerPicture.value = res.result.bannerPicture
  subTypes.value = res.result.subTypes.map((subType) => {
    return {
      ...subType,
      goodsItems: {
        ...subType.goodsItems,
        items: processGoodsData(subType.goodsItems.items),
      },
    }
  })
}
// // 3. 在外层直接匹配（因为 defineProps 是在 setup 阶段就执行的）
// const currUrlMap = urlMap.find((v) => v.type === query.type)
// ================= 触底分页加载 =================
const onScrolltolower = async () => {
  // 获取当前选中的 Tab 数据
  const currentSubType = subTypes.value[activeIndex.value]

  // 安全判断：如果没拿到数据，或者正在加载，或者已经到底了，直接 return
  if (!currentSubType) return
  if (currentSubType.finish) return
  if (currentSubType.isLoading) return

  currentSubType.isLoading = true // 上锁

  try {
    // 请求下一页
    const nextPage = currentSubType.goodsItems.page + 1
    const res = await getHotRecommendAPI<HotResult>(currentUrl.value, {
      subType: currentSubType.id,
      page: nextPage,
      pageSize: currentSubType.goodsItems.pageSize,
    })

    // 提取新数据并追加
    const newItems = res.result.subTypes[activeIndex.value].goodsItems.items
    currentSubType.goodsItems.items.push(...newItems)

    // 更新页码和结束状态
    currentSubType.goodsItems.page = nextPage
    if (nextPage >= res.result.subTypes[activeIndex.value].goodsItems.pages) {
      currentSubType.finish = true
    }
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    currentSubType.isLoading = false // 解锁
  }
}
// // 4. 设置标题（用 ! 强制断言非空）
// uni.setNavigationBarTitle({ title: currUrlMap!.title })
onLoad((options) => {
  const pageType = options?.type || '1'
  const currUrlMap = urlMap.find((v) => v.type === pageType)

  if (currUrlMap) {
    uni.setNavigationBarTitle({ title: currUrlMap.title })
    getHotRecommendData(currUrlMap.url) // 记住：必须把 url 传给函数！
  } else {
    uni.showToast({ title: '参数错误', icon: 'none' })
  }
})

// 如果你是用 defineProps 拿到的 query，这里就不需要 options 了
// 如果是路由跳转过来的，就用 options.type
// 2. uni-app 获取页面参数（讲师的写法有坑，见下方解析）
// 3. 根据传过来的 type，在 urlMap 里找到匹配的对象
// 4. 动态设置当前页面的导航栏标题
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"></image>
    </view>
    <view class="tabs">
      <text
        v-for="(item, index) in subTypes"
        :key="item.id"
        class="text"
        :class="{ active: index === activeIndex }"
        @tap="activeIndex = index"
        >{{ item.title }}</text
      >
    </view>

    <!-- 推荐列表 -->
    <scroll-view
      v-for="(item, index) in subTypes"
      :key="item.id"
      v-show="activeIndex === index"
      scroll-y
      class="scroll-view"
      @scrolltolower="onScrolltolower"
    >
      <view class="goods">
        <!-- 👇 核心：循环当前Tab下的商品列表 -->
        <navigator
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          class="navigator"
          hover-class="none"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <!-- 👇 加上这个加载提示框 -->
      <view class="loading-text">
        {{ item.finish ? '没有更多数据了~' : '正在加载...' }}
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}
/* 推荐封面图 */
.cover {
  width: 100%;
  height: 260rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
/* Tab栏 */
.tabs {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  height: 90rpx;
  margin: -45rpx 20rpx 20rpx;
  border-radius: 16rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  .text {
    line-height: 90rpx;
    font-size: 28rpx;
    &.active {
      color: #27ba9b;
      font-weight: bold;
    }
  }
}
/* 滚动区域 */
.scroll-view {
  flex: 1;
  height: 0; /* 关键！ */
}
/* 商品列表 */
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .navigator {
    width: 345rpx;
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  }
  .thumb {
    width: 100%;
    height: 345rpx;
    display: block;
  }
  .name {
    padding: 10rpx 20rpx;
    height: 88rpx;
    font-size: 26rpx;
    box-sizing: border-box;
  }
  .price {
    padding: 0 20rpx 20rpx 20rpx;
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 100rpx 0;
}
</style>
