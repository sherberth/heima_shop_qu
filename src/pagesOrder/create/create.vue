<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMemberOrderPreAPI } from '@/services/order'
import type { OrderPreResult } from '@/types/order'
// 获取屏幕边界到安全区域距离
import { useAddressStore } from '@/stores'
const addressStore = useAddressStore() // 💡 实例化 Store
const { safeAreaInsets } = uni.getSystemInfoSync()

// 订单备注
const buyerMessage = ref('')

// 配送时间
const deliveryList = ref([
  { type: 1, text: '时间不限 (周一至周日)' },
  { type: 2, text: '工作日送 (周一至周五)' },
  { type: 3, text: '周末配送 (周六至周日)' },
])

// 当前配送时间下标
const activeIndex = ref(0)

// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value])

// 修改配送时间
const onChangeDelivery: UniHelper.SelectorPickerOnChange = (ev) => {
  activeIndex.value = ev.detail.value
}
// 💡 1. 定义订单数据变量 (类型后续再补，先用 any)
//const orderPre = ref<any>({})
const orderPre = ref<OrderPreResult>()
// 💡 2. 获取订单信息
const getMemberOrderPreData = async () => {
  try {
    uni.showLoading({ title: '加载中...' })
    const res = await getMemberOrderPreAPI()

    // 💡 第二道防线：预订单数据检查
    const goods = res.result.goods || []
    if (goods.length === 0) {
      uni.hideLoading()
      uni.showToast({ title: '购物车有无效商品', icon: 'none' })
      // 延迟一秒后，自动把用户踢回上一页（购物车）
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
      return
    }

    orderPre.value = res.result
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '订单数据异常', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1000)
  }
}

const selectedAddress = computed(() => {
  // 1. 如果 Pinia 里有值，直接返回
  if (addressStore.selectedAddress) {
    return addressStore.selectedAddress
  }
  // 2. 否则去找默认地址（如果没返回数据就不找）
  if (orderPre.value && orderPre.value.userAddresses) {
    return orderPre.value.userAddresses.find((v) => v.isDefault)
  }
  return undefined
})
onLoad(() => {
  getMemberOrderPreData()
})
</script>

<template>
  <view class="viewport">
    <!-- 收货地址 -->
    <!-- 收货地址 -->
    <view
      v-if="selectedAddress"
      class="shipment"
      @tap="uni.navigateTo({ url: '/pagesMember/address/address?from=order' })"
    >
      <view class="user"
        >{{ selectedAddress.receiver }} {{ selectedAddress.contact }}</view
      >
      <view class="address"
        >{{ selectedAddress.fullLocation }} {{ selectedAddress.address }}</view
      >
      <text class="icon icon-right"></text>
    </view>

    <view
      v-else
      class="shipment"
      @tap="uni.navigateTo({ url: '/pagesMember/address/address?from=order' })"
    >
      <view class="address">请选择收货地址</view>
      <text class="icon icon-right"></text>
    </view>

    <!-- 商品信息 -->
    <view class="goods">
      <!-- 修复：加了 ?. -->
      <navigator
        v-for="item in orderPre?.goods"
        :key="item.skuId"
        :url="`/pages/goods/goods?id=${item.id}`"
        class="item"
        hover-class="none"
      >
        <image class="picture" :src="item.picture" />
        <view class="meta">
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="attrs">{{ item.attrsText }}</view>
          <view class="prices">
            <view class="pay-price symbol">{{ item.payPrice }}</view>
            <view class="price symbol">{{ item.price }}</view>
          </view>
          <view class="count">x{{ item.count }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">配送时间</text>
        <picker
          :range="deliveryList"
          range-key="text"
          @change="onChangeDelivery"
        >
          <view class="icon-fonts picker">{{ activeDelivery.text }}</view>
        </picker>
      </view>
      <view class="item">
        <text class="text">订单备注</text>
        <input
          class="input"
          :cursor-spacing="30"
          placeholder="选题，建议留言前先与商家沟通确认"
          v-model="buyerMessage"
        />
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <!-- 修复：加了 ?. -->
        <text class="number symbol">{{
          orderPre?.summary?.totalPrice || 0
        }}</text>
      </view>
      <view class="item">
        <text class="text">运费: </text>
        <!-- 这里你已经写了，是对的 -->
        <text class="number symbol">{{ orderPre?.summary?.postFee || 0 }}</text>
      </view>
    </view>
  </view>

  <!-- 吸底工具栏 -->
  <view
    class="toolbar"
    :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
  >
    <view class="total-pay symbol">
      <!-- 💡 这里你已经写了，是对的 -->
      <text class="number">{{ orderPre?.summary?.totalPayPrice || 0 }}</text>
    </view>
    <!-- 修复：只有在有地址且有商品时才允许提交 -->
    <view
      class="button"
      :class="{ disabled: !selectedAddress || !orderPre?.goods?.length }"
    >
      提交订单
    </view>
  </view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.symbol::before {
  content: '¥';
  font-size: 80%;
  margin-right: 5rpx;
}

.shipment {
  margin: 20rpx;
  padding: 30rpx 30rpx 30rpx 84rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  background: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png)
    20rpx center / 50rpx no-repeat #fff;
  position: relative;

  .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }

  .user {
    color: #333;
    margin-bottom: 5rpx;
  }

  .address {
    color: #666;
  }
}

.goods {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    padding: 30rpx 0;
    border-top: 1rpx solid #eee;

    &:first-child {
      border-top: none;
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;

      .name {
        font-size: 26rpx;
        color: #333;
      }

      .attrs {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
        background-color: #f7f7f8;
        border-radius: 4rpx;
        align-self: flex-start;
        padding: 0 10rpx;
      }

      .prices {
        display: flex;
        align-items: baseline;
        margin-top: 6rpx;
        font-size: 28rpx;

        .pay-price {
          margin-right: 10rpx;
          color: #cf4444;
        }

        .price {
          font-size: 24rpx;
          color: #999;
          text-decoration: line-through;
        }
      }

      .count {
        position: absolute;
        bottom: 0;
        right: 0;
        font-size: 26rpx;
        color: #444;
      }
    }
  }
}

.related {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .input {
    flex: 1;
    text-align: right;
    margin: 30rpx 0;
    padding-right: 20rpx;
    font-size: 26rpx;
    color: #999;
  }

  .item .text {
    width: 125rpx;
  }

  .picker {
    color: #666;
  }

  .picker::after {
    content: '\e6c2';
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    margin-left: 10rpx;
  }
}

.settlement {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .danger {
    color: #cf4444;
  }
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .total-pay {
    font-size: 40rpx;
    color: #cf4444;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: #27ba9b;
  }

  .disabled {
    opacity: 0.6;
  }
}
.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 💡 加在这里，防止底部工具栏遮挡内容 */
  padding-bottom: 120rpx;
  box-sizing: border-box;
}
</style>
