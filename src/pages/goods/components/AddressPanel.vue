<script setup lang="ts">
//
const emit = defineEmits(['close'])
</script>

<template>
  <view class="address-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 标题 -->
    <view class="title">配送至</view>
    <!-- 内容 -->
    <view class="content">
      <view class="item">
        <view class="user">李明 13824686868</view>
        <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
        <text class="icon icon-checked"></text>
      </view>
      <view class="item">
        <view class="user">王东 13824686868</view>
        <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
        <text class="icon icon-ring"></text>
      </view>
      <view class="item">
        <view class="user">张三 13824686868</view>
        <view class="address">北京市朝阳区孙河安平北街6号院</view>
        <text class="icon icon-ring"></text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <view class="button primary">新建地址</view>
    </view>
  </view>
</template>

<style lang="scss">
.address-panel {
  padding: 0 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;

  /* 以下是补全的基础样式 */
  .close {
    position: absolute;
    right: 24rpx;
    top: 24rpx;
    font-size: 32rpx;
    color: #999;
  }

  .title {
    line-height: 1;
    padding: 40rpx 0;
    text-align: center;
    font-size: 32rpx;
    font-weight: normal;
    border-bottom: 1rpx solid #ddd;
    color: #444;
  }

  .content {
    padding: 20rpx 0 100rpx 0;

    .item {
      padding: 30rpx 40rpx 30rpx 0;
      border-bottom: 1rpx solid #eee;
      position: relative;

      &:last-child {
        border-bottom: 0 none;
      }

      .user {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
      }

      .address {
        font-size: 26rpx;
        color: #999;
      }

      .icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        font-size: 36rpx;
      }

      .icon-checked {
        color: #27ba9b;
      }

      .icon-ring {
        color: #ddd;
      }
    }
  }

  /* 下面是截图二里原有的底部样式 */
  .footer {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0 40rpx;
    font-size: 28rpx;
    color: #444;

    .button {
      flex: 1;
      height: 72rpx;
      text-align: center;
      line-height: 72rpx;
      margin: 0 20rpx;
      color: #fff;
      border-radius: 72rpx;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
    }

    .secondary {
      background-color: #ffa868;
    }
  }
}
</style>
