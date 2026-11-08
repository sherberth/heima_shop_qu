<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
// 💡 引入删除接口
import {
  getMemberAddressAPI,
  deleteMemberAddressByIDAPI,
} from '@/services/address'
import type { AddressItem } from '@/types/address'

const addressList = ref<AddressItem[]>([])

const getMemberAddressData = async () => {
  const res = await getMemberAddressAPI()
  addressList.value = res.result
}

// 每次进入页面刷新
onShow(() => {
  getMemberAddressData()
})
// 💡 1. 定义左滑面板的按钮 (红色删除)
const swipeOptions = [
  {
    text: '删除',
    style: {
      backgroundColor: '#cf4444', // 红色背景
    },
  } as any,
]

// 💡 2. 滑动按钮点击事件
const onSwipeClick = (e: any, id: string) => {
  if (e.content.text === '删除') {
    onDeleteAddress(id)
  }
}
// 💡 新增：删除地址逻辑（对齐讲师图2）
const onDeleteAddress = (id: string) => {
  // 1. 二次确认弹窗
  uni.showModal({
    content: '删除地址？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...' })

          // 2. 调用删除接口
          await deleteMemberAddressByIDAPI(id)

          // 3. 重新获取列表（自动刷新页面）
          await getMemberAddressData()

          uni.hideLoading()
          uni.showToast({ icon: 'success', title: '删除成功' })
        } catch (error) {
          uni.hideLoading()
          uni.showToast({ icon: 'error', title: '删除失败' })
          console.error(error)
        }
      }
    },
  })
}
</script>

<template>
  <view class="viewport">
    <scroll-view class="scroll-view" scroll-y>
      <view v-if="addressList.length > 0" class="address">
        <view class="address-list">
          <!-- 组件包裹 -->
          <uni-swipe-action>
            <!-- 💡 2. 里面包一层 template 做循环 -->
            <template v-for="item in addressList" :key="item.id">
              <uni-swipe-action-item
                :right-options="swipeOptions"
                @click="onSwipeClick($event, item.id)"
              >
                <view class="item">
                  <view class="item-content">
                    <view class="user">
                      {{ item.receiver }}
                      <text class="contact">{{ item.contact }}</text>
                      <text v-if="item.isDefault === 1" class="badge"
                        >默认</text
                      >
                    </view>
                    <view class="locate"
                      >{{ item.fullLocation }} {{ item.address }}</view
                    >
                    <navigator
                      class="edit"
                      hover-class="none"
                      :url="`/pagesMember/address-form/address-form?id=${item.id}`"
                    >
                      修改
                    </navigator>
                  </view>
                </view>
              </uni-swipe-action-item>
            </template>
          </uni-swipe-action>
        </view>
      </view>
      <view v-else class="blank">暂无收货地址</view>
    </scroll-view>

    <view class="add-btn">
      <navigator
        hover-class="none"
        url="/pagesMember/address-form/address-form"
      >
        新建地址
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;

  .scroll-view {
    padding-top: 20rpx;
  }
}

.address {
  padding: 0 20rpx;
  margin: 0 20rpx;

  .address-list {
    border-radius: 10rpx;
    overflow: hidden; /* 💡 确保左滑时圆角不被破坏 */
  }

  /* 💡 注意：现在包裹在 uni-swipe-action-item 里面，背景色必须是白底 */
  .item {
    background-color: #fff;
  }

  .item-content {
    position: relative;
    padding: 40rpx 10rpx 38rpx;
    background-color: #fff; /* 💡 必须有，防止左滑穿透 */
    border-bottom: 1rpx solid #ddd;

    .edit {
      position: absolute;
      top: 36rpx;
      right: 30rpx;
      padding: 2rpx 0 2rpx 20rpx;
      border-left: 1rpx solid #666;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
    }
  }

  /* 最后一个 item 隐藏底边框 */
  .uni-swipe-action-item:last-child .item-content {
    border-bottom: none;
  }
}

.user {
  font-size: 28rpx;
  margin-bottom: 20rpx;
  color: #333;

  .contact {
    color: #666;
  }

  .badge {
    display: inline-block;
    padding: 4rpx 10rpx 2rpx 14rpx;
    margin: 2rpx 0 0 10rpx;
    font-size: 26rpx;
    color: #27ba9b;
    border-radius: 6rpx;
    border: 1rpx solid #27ba9b;
  }
}

.locate {
  line-height: 1.6;
  font-size: 26rpx;
  color: #333;
}

/* 右侧删除按钮 (讲师截图里有这个样式，留给后续滑动删除用) */
// .item-right {
//   height: 100%;

//   .delete-button {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 50px;
//     height: 100%;
//     font-size: 28rpx;
//     color: #fff;
//     border-radius: 0;
//     padding: 0;
//     background-color: #cf4444;
//   }
// }

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}

.add-btn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
