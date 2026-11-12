<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
// 💡 引入 Pinia 状态
import { useMemberStore } from '@/stores'
import {
  getMemberCartAPI,
  deleteMemberCartAPI,
  putMemberCartBySkuIdAPI,
  putMemberCartSelectedAPI,
} from '@/services/cart'
// 💡 引入猜你喜欢的组合式函数（如果之前封装过的话）
import { useGuessList } from '@/composables'
import type { CartItem } from '@/types/cart'

// 获取会员 store
const memberStore = useMemberStore()

// 获取猜你喜欢组件实例和触底函数
const { guessRef, onScrolltolower } = useGuessList()

const cartList = ref<CartItem[]>([])
// 💡 用于控制滑动删除的状态（留着后续用）
const activeSwipeId = ref('')
const getMemberCartData = async () => {
  const res = await getMemberCartAPI()
  cartList.value = res.result
}

onShow(() => {
  console.log('回到购物车页面，当前登录状态：', memberStore.profile)
  if (memberStore.profile) {
    getMemberCartData()
  }
})
// 点击单个商品选中/取消选中
const onToggleSelected = async (item: CartItem) => {
  try {
    // 1. 计算点击后的新状态
    const newSelected = !item.selected
    // 2. 调用接口更新后端
    await putMemberCartBySkuIdAPI(item.skuId, { selected: newSelected })
    // 3. 接口成功后，更新前端本地数据（这样底部的总价会瞬间重新计算）
    item.selected = newSelected
  } catch (error) {
    uni.showToast({ title: '网络错误，请重试', icon: 'none' })
  }
}
// 💡 新增：点击删除按钮的逻辑
const onDeleteCart = (skuId: string) => {
  // 弹窗二次确认
  uni.showModal({
    content: '是否删除',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...' })
          // 调用删除接口，传入数组格式
          await deleteMemberCartAPI({ ids: [skuId] })
          uni.hideLoading()

          // 重新获取购物车数据（刷新页面）
          getMemberCartData()
          uni.showToast({ title: '删除成功', icon: 'success' })
        } catch (error) {
          uni.hideLoading()
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    },
  })
}

//总价
// 💡 1. 计算是否全选
const isSelectedAll = computed(() => {
  // 如果购物车有数据，且每一项都被选中了，才是全选
  return (
    cartList.value.length > 0 && cartList.value.every((item) => item.selected)
  )
})

// 2. 提取选中的商品列表 (讲师的新写法)
const selectedCartList = computed(() => {
  return cartList.value.filter((v) => v.selected)
})

// 3. 计算选中总件数
const selectedCartListCount = computed(() => {
  return selectedCartList.value.reduce((sum, v) => sum + v.count, 0)
})

// 4. 计算选中总金额
const selectedCartListMoney = computed(() => {
  return selectedCartList.value
    .reduce((sum, v) => sum + v.count * v.nowPrice, 0)
    .toFixed(2)
})

// 💡 4. 点击全选按钮的切换事件
// 修改选中状态-全选修改
const onChangeSelectedAll = () => {
  // 全选状态取反
  const _isSelectedAll = !isSelectedAll.value
  // 前端数据更新
  cartList.value.forEach((item) => {
    item.selected = _isSelectedAll
  })
  // 后端数据更新 (调用专用的全选接口)
  putMemberCartSelectedAPI({ selected: _isSelectedAll })
}
// 💡 监听步进器数量变化
// 修改商品数量
const onCountChange = async (ev: any) => {
  // ev.index 是 skuId，ev.value 是修改后的最新数量
  try {
    uni.showLoading({ title: '更新中...' })
    // 调用修改接口，只传 count
    await putMemberCartBySkuIdAPI(ev.index, { count: ev.value })
    uni.hideLoading()
    // 接口成功，本地数据已经被 v-model 同步过了，底部的总价也会跟着变
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '修改数量失败', icon: 'none' })
    // 如果失败，最好重新拉取一下购物车数据，恢复原来的数量
    getMemberCartData()
  }
}
// 修改选中状态 - 单品修改
// const onChangeSelected = async (item: CartItem) => {
//   // 1. 前端数据优先更新（取反，让用户瞬间看到 UI 变化）
//   item.selected = !item.selected
//   try {
//     // 2. 发送请求给后端
//     await putMemberCartBySkuIdAPI(item.skuId, { selected: item.selected })
//   } catch (error) {
//     // 3. 容错处理：如果网络失败，把状态弹回去，并提示用户
//     item.selected = !item.selected
//     uni.showToast({ title: '网络异常，修改失败', icon: 'none' })
//   }
// }
// 修改选中状态-单品修改
// const onChangeSelected = (item: CartItem) => {
//   // 前端数据更新-是否选中取反
//   item.selected = !item.selected
//   // 后端数据更新
//   putMemberCartBySkuIdAPI(item.skuId, { selected: item.selected })
// }
// 💡 4. 点击去结算按钮
const onPayment = () => {
  if (selectedCartListCount.value === 0) {
    return uni.showToast({ icon: 'none', title: '请选择商品' })
  }
  // 跳转到结算页
  uni.navigateTo({ url: '/pagesOrder/create/create' })
}
</script>

<template>
  <view class="viewport">
    <!-- 滚动容器 -->
    <scroll-view @scrolltolower="onScrolltolower" scroll-y class="scroll-view">
      <!-- 情况1：已登录，显示购物车 -->
      <template v-if="memberStore.profile">
        <!-- 购物车列表 -->
        <view class="cart-list" v-if="cartList.length">
          <!-- 优惠提示 -->
          <view class="tips">
            <text class="label">满减</text>
            <text class="desc">满1件，即可享受9折优惠</text>
          </view>

          <!-- 滑动操作分区 -->
          <uni-swipe-action>
            <!-- 循环渲染购物车商品 -->
            <uni-swipe-action-item
              v-for="item in cartList"
              :key="item.skuId"
              class="cart-swipe"
            >
              <!-- 商品信息 -->
              <view class="goods">
                <!-- 选中状态 -->
                <text
                  class="checkbox"
                  :class="{ checked: item.selected }"
                  @tap="onToggleSelected(item)"
                ></text>

                <navigator
                  :url="`/pages/goods/goods?id=${item.id}`"
                  hover-class="none"
                  class="navigator"
                >
                  <image
                    mode="aspectFill"
                    class="picture"
                    :src="item.picture"
                  />
                  <view class="meta">
                    <view class="name ellipsis">{{ item.name }}</view>
                    <view class="attrsText ellipsis">{{ item.attrsText }}</view>
                    <view class="price">{{ item.nowPrice }}</view>
                  </view>
                </navigator>

                <!-- 商品数量 -->
                <view class="count">
                  <vk-data-input-number-box
                    v-model="item.count"
                    :min="1"
                    :max="item.stock"
                    :index="item.skuId"
                    @change="onCountChange"
                  ></vk-data-input-number-box>
                </view>
              </view>

              <!-- 右侧删除按钮 -->
              <template #right>
                <view class="cart-swipe-right">
                  <button
                    @tap="($event) => onDeleteCart(item.skuId)"
                    class="button delete-button"
                  >
                    删除
                  </button>
                </view>
              </template>
            </uni-swipe-action-item>
          </uni-swipe-action>
        </view>

        <!-- 购物车空状态 -->
        <view class="cart-blank" v-else>
          <text class="text">购物车还是空的哦~</text>
        </view>
      </template>

      <!-- 情况2：未登录，显示提示 -->
      <view v-else class="login-blank">
        <view class="text">登录后可查看购物车中的商品</view>
        <navigator class="button" hover-class="none" url="/pages/login/login">
          去登录
        </navigator>
      </view>

      <!-- 猜你喜欢 -->
      <view class="guess">
        <XtxGuess ref="guessRef" />
      </view>

      <!-- 底部占位空盒子 -->
      <view class="toolbar-height"></view>
    </scroll-view>

    <!-- 底部工具栏 -->
    <view v-if="memberStore.profile && cartList.length" class="toolbar">
      <!-- 把原来的全选结构改成这样 -->
      <view class="all" @tap="onChangeSelectedAll">
        <text class="checkbox" :class="{ checked: isSelectedAll }"></text>
        <text class="text">全选</text>
      </view>
      <!-- 💡 替换底部的 buttons 结构 -->
      <view class="buttons">
        <text class="text">合计:</text>
        <text class="amount">¥{{ selectedCartListMoney }}</text>

        <view class="button-group">
          <view
            class="button payment-button"
            :class="{ disabled: selectedCartListCount === 0 }"
            @tap="onPayment"
          >
            去结算({{ selectedCartListCount }})
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 滚动容器 */
.scroll-view {
  flex: 1;
  height: 0; /* 💡 极其关键，配合 flex 使用 */
}

/* 购物车列表 */
.cart-list {
  padding: 0 20rpx;

  /* 优惠提示 */
  .tips {
    display: flex;
    align-items: center;
    line-height: 1;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    color: #666;

    .label {
      color: #fff;
      padding: 7rpx 15rpx 5rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      background-color: #27ba9b;
      margin-right: 10rpx;
    }
  }
}

/* 购物车商品 */
.goods {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;

  /* 选中框 */
  .checkbox {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    border: 2rpx solid #ccc;
    margin-right: 20rpx;
    margin-top: 40rpx; /* 稍微往下挪一点对齐 */
    flex-shrink: 0;

    &.checked {
      background-color: #27ba9b;
      border-color: #27ba9b;
      /* 这里后续用伪元素加个勾 */
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 10rpx;
        top: 4rpx;
        width: 12rpx;
        height: 20rpx;
        border: 3rpx solid #fff;
        border-top: none;
        border-left: none;
        transform: rotate(45deg);
      }
    }
  }

  .navigator {
    flex: 1;
    display: flex;
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
    justify-content: space-between;

    .name {
      font-size: 28rpx;
      color: #333;
    }

    .price {
      color: #cf4444;
      font-size: 26rpx;

      .symbol {
        font-size: 20rpx;
      }
    }

    .extra {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24rpx;
      color: #999;

      .spec {
        max-width: 300rpx;
      }
    }
  }
}

/* 未登录状态 */
.login-blank {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;

  .text {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 40rpx;
  }
  .button {
    width: 200rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 26rpx;
    color: #fff;
    background-color: #27ba9b;
    border-radius: 30rpx;
  }
}

/* 猜你喜欢容器 */
.guess {
  margin-top: 20rpx;
}

/* 底部占位空盒子 (防止列表被底栏遮挡) */
.toolbar-height {
  height: 100rpx;
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-top: 1rpx solid #eaeaea;
  padding: 0 20rpx;

  .all {
    display: flex;
    align-items: center;
    .checkbox {
      width: 36rpx;
      height: 36rpx;
      border-radius: 50%;
      border: 2rpx solid #ccc;
      margin-right: 10rpx;
      &.checked {
        background-color: #27ba9b;
        border-color: #27ba9b;
      }
    }
    .text {
      font-size: 28rpx;
      color: #333;
    }
  }
  .buttons {
    display: flex;
    align-items: center;

    .text {
      font-size: 26rpx;
      color: #333;
    }

    /* 💡 金额的样式 */
    .amount {
      font-size: 32rpx;
      color: #cf4444;
      font-weight: bold;
      margin-right: 20rpx;
    }

    .button-group {
      display: flex;
    }

    /* 💡 结算按钮样式 */
    .button {
      width: 200rpx;
      height: 65rpx;
      line-height: 65rpx;
      text-align: center;
      font-size: 28rpx;
      color: #fff;
      border-radius: 72rpx;

      &.payment-button {
        background-color: #27ba9b;
        &.disabled {
          opacity: 0.6;
        }
      }
    }
  }
}
//
.cart-swipe-right {
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #f7f7f8; /* 背景色和列表保持一致，防止透视 */

  .delete-button {
    height: 100% !important;
    width: 150rpx !important;
    border-radius: 0 !important;
    background-color: #cf4444 !important; /* 强制红底 */
    color: #fff !important; /* 强制白字 */
    font-size: 28rpx !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    margin: 0 !important;

    /* 💡 核心：去除小程序 button 自带的丑陋边框 */
    &::after {
      border: none !important;
    }
  }
}
.count {
  /* 去掉原有的 flex、border 等，因为组件自带样式了 */
  width: 200rpx; /* 根据需要稍微调整一下宽度 */
  display: flex;
  justify-content: flex-end;
}
</style>
