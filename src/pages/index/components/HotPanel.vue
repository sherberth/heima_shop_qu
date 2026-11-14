<script setup lang="ts">
import type { HotItem } from '@/types/home'

const props = defineProps<{
  list: HotItem[]
}>()

// 打印测试，避免它报“props 定义了未使用”的警告
console.log(props.list)
</script>

<template>
  <!-- 推荐专区 -->
  <view class="panel hot">
    <!-- 暂时写死循环 4 次，用来占位测试样式 -->
    <view class="item" v-for="item in list" :key="item.id">
      <view class="title">
        <!-- 写死的文字改为动态绑定 {{ item.title }} 和 {{ item.alt }} -->
        <text class="title-text">{{ item.title }}</text>
        <text class="title-desc">{{ item.alt }}</text>
      </view>
      <!-- ✅ 是反引号 -->
      <navigator
        hover-class="none"
        :url="`/pages/hot/hot?type=${item.type}`"
        class="cards"
      >
        <!-- 写死的两张网图 -->
        <!-- 改动：删掉写死的两个 <image>，改为内层 v-for 循环图片数组 -->
        <image
          v-for="src in item.pictures"
          :key="src"
          class="image"
          mode="aspectFit"
          :src="src"
        ></image>
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
/* 热门推荐 */
.hot {
  display: flex;
  flex-wrap: wrap;
  min-height: 508rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;

  /* 标题排版 */
  .title {
    display: flex;
    align-items: center;
    padding: 24rpx 24rpx 0;
    font-size: 32rpx;
    color: #262626;
    position: relative;

    .title-desc {
      font-size: 24rpx;
      color: #7f7f7f;
      margin-left: 18rpx;
    }
  }

  /* 每个小格子（四个格子铺满） */
  .item {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 254rpx;
    border-right: 1rpx solid #eee;
    border-top: 1rpx solid #eee;

    .title {
      justify-content: start;
    }

    /* 右侧边框去掉 */
    &:nth-child(2n) {
      border-right: 0 none;
    }

    /* 前两个格子的上边框去掉 */
    &:nth-child(-n + 2) {
      border-top: 0 none;
    }

    .image {
      width: 150rpx;
      height: 150rpx;
    }
  }

  /* 包含图片的导航区 */
  .cards {
    flex: 1;
    padding: 15rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
