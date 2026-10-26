<script setup lang="ts">
import type { CategoryItem } from '@/types/home'

//
defineProps<{
  list: CategoryItem[]
}>()
</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      url="/pages/index/index"
      v-for="item in list"
      :key="item.id"
    >
      <image class="icon" :src="item.icon" mode="aspectFit"></image>
      <text class="text">{{ item.name }}</text>
    </navigator>
  </view>
</template>

<style lang="scss">
/* 前台类目 */
.category {
  margin: 20rpx 0;
  padding: 10rpx 0;
  display: flex;
  flex-wrap: wrap; /* 👈 关键：允许换行！如果不加，10个就会挤在同一行 */
  min-height: 328rpx;
  /* 2. 每个小格子（包含图片和文字） */
  .category-item {
    width: 20%; /* 👈 关键：100% / 5 = 20%，保证一行刚好放 5 个 */
    display: flex;
    flex-direction: column; /* 👈 关键：让里面的图片和文字上下垂直排列 */
    align-items: center; /* 水平居中 */
    justify-content: center;
    margin-bottom: 20rpx; /* 两行之间的间距 */

    /* 3. 图标大小 */
    .icon {
      width: 80rpx; /* 👈 关键：固定图片宽度，防止被压扁 */
      height: 80rpx; /* 👈 关键：固定图片高度 */
      margin-bottom: 10rpx; /* 图片和文字的间距 */
    }

    /* 4. 文字样式 */
    .text {
      font-size: 24rpx;
      color: #333;
    }
  }

  /* 图2在这里截断了，下面肯定还有 .category-item、.icon、.text 的宽高和排布样式 */
}
</style>
