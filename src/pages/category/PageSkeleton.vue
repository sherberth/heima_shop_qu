<template>
  <view class="sk-container">
    <!-- 顶部搜索框占位 -->
    <view class="sk-search">
      <view class="sk-input"></view>
    </view>

    <!-- 主体左右分栏 -->
    <view class="sk-categories">
      <!-- 左侧列表：循环9次，只有第一个加 active 类触发绿条 -->
      <view class="sk-primary">
        <view
          class="sk-item"
          :class="{ active: i === 1 }"
          v-for="i in 9"
          :key="i"
        ></view>
      </view>

      <!-- 右侧内容区 -->
      <view class="sk-secondary">
        <!-- 1. 轮播图大块 -->
        <view class="sk-banner"></view>

        <!-- 2. 第一个面板：居家生活用品（实际只有 2 个商品） -->
        <view class="sk-panel">
          <view class="sk-header">
            <view class="sk-title"></view>
            <view class="sk-more"></view>
          </view>
          <view class="sk-grid">
            <view class="sk-goods" v-for="g in 3" :key="g">
              <view class="sk-img"></view>
              <view class="sk-text"></view>

              <view class="sk-price"></view>
            </view>
          </view>
        </view>

        <!-- 3. 第二个面板：收纳（实际有 2排共 6 个商品） -->
        <view class="sk-panel">
          <view class="sk-header">
            <view class="sk-title"></view>
            <view class="sk-more"></view>
          </view>
          <view class="sk-grid">
            <view class="sk-goods" v-for="g in 6" :key="g">
              <view class="sk-img"></view>
              <view class="sk-text"></view>

              <view class="sk-price"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* ================= 极致两色体系 ================= */
/* 👇 核心微调：全部统一为极其轻柔的 #f5f5f5 */
$sk-color: #f5f5f5;
$sk-green: #27ba9b; /* 主题绿：仅限左侧激活条 */

.sk-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
}

/* 搜索框 */
.sk-search {
  padding: 20rpx;
  background-color: #fff;
  flex-shrink: 0;
  .sk-input {
    height: 64rpx;
    background-color: $sk-color;
    border-radius: 32rpx;
  }
}

/* 左右分栏 */
.sk-categories {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ================= 左侧列表 ================= */
.sk-primary {
  width: 150rpx;
  height: 100%;
  background-color: #fff;
  flex-shrink: 0;
  border-right: 1rpx solid #f9f9f9; /* 分割线也调浅一点，避免突兀 */

  .sk-item {
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    /* 统一灰色文字块 */
    &::after {
      content: '';
      width: 60rpx;
      height: 24rpx;
      background-color: $sk-color;
      border-radius: 4rpx;
    }

    /* 只有第一个 active 项才有绿条 */
    &.active {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 8rpx;
        height: 40rpx;
        background-color: $sk-green;
        border-radius: 0 4rpx 4rpx 0;
      }
    }
  }
}

/* ================= 右侧内容 ================= */
.sk-secondary {
  flex: 1;
  height: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;

  /* 轮播图 */
  .sk-banner {
    width: 100%;
    height: 200rpx;
    background-color: #e5e5e5; /* 👈 改这里，替换成深灰 */
    border-radius: 16rpx;
    margin: 20rpx 0 30rpx;
  }

  /* 商品面板 */
  .sk-panel {
    margin-bottom: 40rpx;

    .sk-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      .sk-title {
        width: 160rpx;
        height: 32rpx;
        background-color: $sk-color;
        border-radius: 4rpx;
      }
      .sk-more {
        width: 60rpx;
        height: 24rpx;
        background-color: $sk-color;
        border-radius: 4rpx;
      }
    }

    /* 商品网格 */
    .sk-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .sk-goods {
        width: calc((100% - 40rpx) / 3);
        display: flex;
        flex-direction: column;

        /* 图片 */
        .sk-img {
          width: 100%;
          height: 180rpx;
          background-color: #e5e5e5; /* 👈 改这里，替换成深灰 */
          border-radius: 8rpx;
        }

        /* 名字（两行） */
        .sk-text {
          width: 100%;
          height: 24rpx;
          background-color: $sk-color;
          border-radius: 4rpx;
          margin-top: 12rpx;
        }
        .sk-text.short {
          width: 60%;
          margin-top: 8rpx;
        }

        /* 价格 */
        .sk-price {
          width: 40%;
          height: 28rpx;
          background-color: $sk-color;
          border-radius: 4rpx;
          margin-top: 12rpx;
        }
      }
    }
  }
}
</style>
