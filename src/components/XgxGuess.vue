<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import { onMounted, ref } from 'vue'
import type { GuessItem } from '@/types/home'
import type { PageParams } from '@/types/global'
// 分页参数
const pageParams: Required<PageParams> = {
  page: 10,
  pageSize: 10,
}
// 1. 定义响应式数据容器
//
const guessList = ref<GuessItem[]>([])
// 👇 新增：是否已结束标记（讲师核心逻辑）
const finish = ref(false)
const isLoading = ref(false) //

// 获取猜你喜欢数据
const getHomeGoodsGuessLikeData = async () => {
  // 👇 新增：如果已经到底了，直接拦截，并给用户提示
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有数据了~' })
  }
  if (isLoading.value === true) {
    return
  }

  isLoading.value = true
  try {
    const res = await getHomeGoodsGuessLikeAPI(pageParams)

    // 1. 先过滤掉不需要的“牛肉/牛油”商品
    const filteredItems = res.result.items.filter((item) => {
      // 如果商品名称包含“牛肉”或“牛油”，直接返回 false（拦截掉）
      if (item.name.includes('牛') || item.name.includes('猪') || item.name.includes('豚')) {
        return false
      }
      return true
    })
    // 👇 核心：对每一页的数据进行加工
    const processedItems = filteredItems.map((item) => {
      // 💡 关键修复：这里必须有 newItem 的声明
      const newItem = { ...item }
      // 修改名字
      // 1. 先用一个干净的变量做基础判断和替换
      let nameStr = newItem.name
      nameStr = nameStr.replace('男童', '女童')
      nameStr = nameStr.replace('有道', '物道')
      nameStr = nameStr.replace('德国', '韩国')
      newItem.name = nameStr // 最后统一赋值回去，干净利落
      // 修改价格
      let priceNum = Number(newItem.price)
      let originalPrice = priceNum // 用于判断条件
      if (priceNum > 100) {
        priceNum = priceNum - 100
      } else if (priceNum > 40) {
        priceNum = priceNum - 10
      }
      // 规则 b: 所有“儿童”产品，原价超过90的减50
      // 基础降价规则
      if (priceNum > 100) {
        priceNum -= 80
      } else if (priceNum > 40) {
        priceNum -= 10
      }

      // 特殊规则：儿童产品
      // 注意：这里用刚才替换完的 nameStr 判断，才能抓到 "女童"
      if (nameStr.includes('儿童') || nameStr.includes('女童')) {
        if (originalPrice > 90) priceNum -= 50
      }

      // 特殊规则：鞋靴
      if (nameStr.includes('鞋') || nameStr.includes('靴')) {
        priceNum -= 10
      }
      // 防止价格减成负数
      priceNum = Math.max(priceNum, 0)
      newItem.price = priceNum.toFixed(2)

      // 强行修复 http 图片
      if (newItem.picture && newItem.picture.startsWith('http://')) {
        newItem.picture = newItem.picture.replace('http://', 'https://')
      }

      return newItem
    })
    // 👇 讲师的核心逻辑：数组追加，而不是覆盖
    guessList.value.push(...processedItems)

    // 页码累加
    // 👇 新增：判断是否还有下一页（讲师核心逻辑）
    if (pageParams.page < res.result.pages) {
      pageParams.page++ // 页码累加
    } else {
      finish.value = true // 标记已经结束
    }
  } catch (error) {
    console.error('猜你喜欢加载失败', error)
  } finally {
    // 5. 解锁：无论成功还是失败，必须解锁，否则以后再也不会加载了
    isLoading.value = false
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
