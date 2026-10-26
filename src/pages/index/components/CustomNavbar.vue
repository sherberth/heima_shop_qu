<script setup lang="ts">
// 获取屏幕边界到安全区域距离
// 1. 获取窗口信息（新版 API，性能更好，不会报黄字警告）
const windowInfo = uni.getWindowInfo()
const safeAreaInsets = windowInfo.safeAreaInsets || { top: 15, bottom: 0 }
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <image class="logo-image" src="@/static/images/logo2.png"></image>
      <text class="logo-text">新鲜 · 亲民 · 快捷</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <text class="icon-search">搜索商品</text>
      <text class="icon-scan"></text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg.png);
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  /* 注意：图中这里有一行 padding-top: 20px; 但被上面的 :style 动态覆盖了 */
  // 左右下内边距（顶部已由 :style 动态控制）
  padding-left: 24rpx;
  padding-right: 24rpx;
  padding-bottom: 10px;

  .logo {
    display: flex;
    align-items: center;
    height: 88rpx; // 导航栏标准高度 44px
    padding-left: 10rpx; // 稍微往右挪一点

    /* 下方这些类名是你在 template 里用到的，但讲师没截出样式 */
    .logo-image {
      width: 160rpx;
      height: 36rpx;
      object-fit: contain;
    }

    .logo-text {
      color: #ffffff;
      font-size: 26rpx;
      padding-left: 16rpx;
      margin-left: 16rpx;
      border-left: 2rpx solid rgba(255, 255, 255, 0.5); // 竖线分割
    }
  }

  .search {
    height: 64rpx;
    background: rgba(255, 255, 255, 0.5); // 半透明白色背景
    border-radius: 32rpx; // 胶囊圆角
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;

    .icon-search {
      color: #ffffff;
      font-size: 28rpx;
      /* 如果文字想变成占位符颜色，可以加 opacity */
      opacity: 0.8;
    }

    .icon-scan {
      color: #ffffff;
      font-size: 32rpx;
    }
  }
}
</style>
