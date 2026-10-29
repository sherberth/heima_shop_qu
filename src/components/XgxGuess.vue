<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import { onMounted, ref } from 'vue'
import type { GuessItem } from '@/types/home'
import type { PageParams } from '@/types/global'
import { processGoodsData } from '@/utils/goodsHandler'
// 分页参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 1. 定义响应式数据容器
//
const guessList = ref<GuessItem[]>([])
// 👇 新增：是否已结束标记（讲师核心逻辑）
const finish = ref(false)
const isLoading = ref(false) //

// 获取猜你喜欢数据
// 👇 核心：对每一页的数据进行加工
const getHomeGoodsGuessLikeData = async () => {
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有数据了~' })
  }
  if (isLoading.value === true) {
    return
  }

  isLoading.value = true
  try {
    // 1. 发送请求
    const res = await getHomeGoodsGuessLikeAPI(pageParams)

    // 2. 核心：一行代码搞定所有过滤、降价、修图逻辑
    const processedItems = processGoodsData(res.result.items)

    // 3. 追加到列表
    guessList.value.push(...processedItems)

    // 4. 分页判断
    if (pageParams.page < res.result.pages) {
      pageParams.page++
    } else {
      finish.value = true
    }
  } catch (error) {
    console.error('猜你喜欢加载失败', error)
    if (pageParams.page > 1) pageParams.page-- // 失败回退页码
  } finally {
    isLoading.value = false // 必须解锁
  }
}

// 重置数据（供首页下拉刷新时调用）
const resetData = () => {
  pageParams.page = 1 // 页码重置为 1
  guessList.value = [] // 清空旧列表
  finish.value = false // 恢复未完成状态
}
// 触底时来回切换展示的方法
// 组件挂载完毕
onMounted(() => {
  getHomeGoodsGuessLikeData()
})

// 暴露方法给父组件
// 必须暴露出去，父组件才能通过 ref 调用
defineExpose({
  getMore: getHomeGoodsGuessLikeData, // 供父组件触底加载使用
  resetData, // 供父组件下拉刷新使用
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>

  <view class="guess-list">
    <!-- 👇 这里暂时用 in 10 占位，后续讲师会讲怎么改成动态数据 -->
    <!-- 👇 截图里 url 被截断了，通常猜你喜欢跳详情页会带上商品 id，我这里补全为常规写法 -->
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name"> {{ item.name }} </view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>

  <!-- 加载提示文字 -->
  <!-- 👇 核心改动：加个固定高度，制造阻滞感 -->
  <view class="loading-box">
    <text v-if="finish" class="loading-text">没有更多数据啦~</text>
    <text v-else class="loading-text">上拉加载更多...</text>
  </view>
</template>

<style lang="scss">
:host {
  display: block;
}
/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 30rpx 0 32rpx;
  font-size: 27rpx;
  color: #262626;

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20rpx 0 20rpx;

    /* 👇 两边的气泡装饰图，使用的是你项目里的本地图 */
    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢列表 */
.guess-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }

  .image {
    width: 304rpx;
    height: 260rpx;
  }

  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 限制两行文字，超出显示省略号 */
    -webkit-box-orient: vertical;
  }

  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }

  .small {
    font-size: 80%;
  }
}

/* 加载提示文字 */
/* 保留你原有的样式，在最下面加上这个 */
.loading-box {
  height: 100rpx; /* 固定 100rpx 高度，防止高度塌陷 */
  display: flex;
  justify-content: center;
  align-items: center;

  .loading-text {
    font-size: 26rpx;
    color: #777;
  }
}
</style>
