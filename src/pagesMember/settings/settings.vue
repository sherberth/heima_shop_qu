<script setup lang="ts">
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

// 退出登录逻辑
const onLogout = () => {
  // 1. 模态弹窗
  uni.showModal({
    content: '是否退出登录？',
    success: (res) => {
      if (res.confirm) {
        // 2. 清理用户信息 (触发 Pinia 的 clearProfile)
        memberStore.clearProfile()

        // 3. 返回上一页 (回到“我的”页面)
        uni.navigateBack()
      }
    },
  })
}
</script>

<template>
  <view class="viewport">
    <!-- 列表1: 我的收货地址 (只有登录了才显示) -->
    <view class="list" v-if="memberStore.profile">
      <navigator
        url="/pagesMember/address/address"
        hover-class="none"
        class="item arrow"
      >
        我的收货地址
      </navigator>
    </view>

    <!-- 列表2: 微信原生开放能力 -->
    <view class="list">
      <button hover-class="none" class="item arrow" open-type="openSetting">
        授权管理
      </button>
      <button hover-class="none" class="item arrow" open-type="feedback">
        样式设置
      </button>
      <button hover-class="none" class="item arrow" open-type="contact">
        联系我们
      </button>
    </view>

    <!-- 列表3 -->
    <view class="list">
      <navigator hover-class="none" class="item arrow" url=""
        >关于小龟鲜儿</navigator
      >
    </view>

    <!-- 操作按钮: 退出登录 (只有登录了才显示) -->
    <view class="action" v-if="memberStore.profile">
      <view @tap="onLogout" class="button">退出登录</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  padding: 20rpx;
}

/* 列表 */
.list {
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  border-radius: 10rpx;

  .item {
    line-height: 90rpx;
    padding-left: 10rpx;
    font-size: 30rpx;
    color: #333;
    border-top: 1rpx solid #ddd;
    position: relative;
    text-align: left;
    border-radius: 0;
    background-color: #fff;

    /* 覆盖微信小程序默认的按钮边框 */
    &::after {
      width: auto;
      height: auto;
      left: auto;
      border: none;
    }
    &:first-child {
      border: none;
    }

    /* 右侧箭头样式 (讲师用了自定义字体图标，这里用通用伪元素代替) */
    &.arrow::after {
      content: '>';
      position: absolute;
      top: 50%;
      right: 5rpx;
      color: #ccc;
      font-size: 32rpx;
      transform: translateY(-50%);
    }
  }
}

/* 操作按钮 */
.action {
  text-align: center;
  line-height: 90rpx;
  margin-top: 40rpx;
  font-size: 32rpx;
  color: #333;

  .button {
    background-color: #fff;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
  }
}
</style>
