<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getMemberAddressAPI,
  deleteMemberAddressByIDAPI,
} from '@/services/address'
import type { AddressItem } from '@/types/address'
import { useAddressStore } from '@/stores'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', address: AddressItem): void
}>()

const addressStore = useAddressStore()
const addressList = ref<AddressItem[]>([])

// 获取真实地址列表
const getAddressList = async () => {
  try {
    const res = await getMemberAddressAPI()
    addressList.value = res.result
  } catch (error) {
    console.error('获取地址失败', error)
  }
}

// 每次弹窗打开时拉取数据
onMounted(() => {
  getAddressList()
})
// 💡 核心改动 1：向父组件暴露刷新方法，方便在 goods.vue 里调用
defineExpose({
  getAddressList,
})

// 点击选中地址
const onSelect = (item: AddressItem) => {
  emit('select', item)
  emit('close') // 选中后自动关闭弹窗
}

// 核心改动 2：长按删除事件
const onDelete = (id: string) => {
  uni.showModal({
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...' })
          await deleteMemberAddressByIDAPI(id)
          uni.hideLoading()
          uni.showToast({ icon: 'success', title: '删除成功' })
          if (addressStore.selectedAddress?.id === id) {
            addressStore.changeSelectedAddress(undefined as any) // 或者直接赋空
          }
          // 删除成功，重新拉取列表
          getAddressList()
        } catch (error) {
          uni.hideLoading()
          uni.showToast({ icon: 'none', title: '删除失败' })
        }
      }
    },
  })
}

// 跳转新建地址
const goToAdd = () => {
  uni.navigateTo({ url: '/pagesMember/address-form/address-form' })
}
</script>

<template>
  <view class="address-panel">
    <text class="close icon-close" @tap="emit('close')"></text>
    <view class="title">配送至</view>

    <view class="content">
      <template v-if="addressList.length > 0">
        <view
          class="item"
          v-for="item in addressList"
          :key="item.id"
          @tap="onSelect(item)"
          @longpress="() => onDelete(item.id)"
        >
          <view class="user"> {{ item.receiver }} {{ item.contact }} </view>
          <view class="address">
            <!-- 去空格拼接：省市区 + 详细地址 -->
            {{ item.fullLocation.replace(/\s+/g, '')
            }}{{ item.address.replace(/\s+/g, '') }}
          </view>
          <!-- 选中状态图标：判断当前项是否等于 Pinia 里的选中项 -->
          <text
            class="icon"
            :class="
              addressStore.selectedAddress?.id === item.id
                ? 'icon-checked'
                : 'icon-ring'
            "
          ></text>
        </view>
      </template>

      <view v-else class="empty">暂无收货地址</view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <view class="button primary" @tap="goToAdd">新建地址</view>
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
    max-height: 50vh;
    overflow-y: auto;

    .item-swipe {
      border-bottom: 1rpx solid #eee;
      &:last-child {
        border-bottom: 0 none;
      }
    }

    .item {
      padding: 30rpx 40rpx 30rpx 0;
      position: relative;
      background-color: #fff; /* 防止左滑穿透 */

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

    .empty {
      text-align: center;
      padding: 40rpx 0;
      color: #999;
      font-size: 28rpx;
    }
  }

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
      background-color: #27ba9b;
    }
  }
}
</style>
