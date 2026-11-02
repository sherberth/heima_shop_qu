<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getGoodsByIdAPI } from '@/services/goods'
import type { GoodsResult } from '@/types/goods' // 引入类型
// 获取屏幕边界到安全区域距离手机（特别是 iPhone）底部都有一个黑色的小横条（Home Indicator）
// 如果你的底部工具栏（加入购物车那个）贴着屏幕最底下写，按钮就会被小黑条挡住
// 这个 safeAreaInsets.bottom 就是你手机底部小黑条的高度
const { safeAreaInsets } = uni.getSystemInfoSync()
// 定义响应式数据（用 GoodsResult 类型，不用 any 了）
const goodsData = ref<GoodsResult>({} as GoodsResult)
// 接收页面参数
//  用 onLoad 接收路由参数
const getGoodsByIdData = async (id: string) => {
  const res = await getGoodsByIdAPI(id)
  goodsData.value = res.result
  // 处理返回数据
}
// 1. 定义当前轮播图的下标// 轮播图当前下标
const activeIndex = ref(0)
// 2. 监听轮播图滑动事件
const onChange = (e: any) => {
  activeIndex.value = e.detail.current
}
onLoad((options) => {
  // 从 options 里拿正确的 id，并直接传参
  getGoodsByIdData(options?.id || '')
})
// 拿到 ID 后，下一步就是拿着这个 ID 去请求商品详情接口了
// const id = options?.id
// getGoodsDetailData(id)
</script>

<template>
  <scroll-view scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <!-- 👇 加上 @change 监听滑动 -->
        <swiper circular @change="onChange">
          <swiper-item v-for="(item, index) in goodsData?.mainPictures" :key="index">
            <image :src="item" mode="aspectFill" />
          </swiper-item>
        </swiper>
        <!-- 👇 指示器动态绑定 -->
        <view class="indicator">
          <text class="current">{{ activeIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goodsData?.mainPictures?.length || 0 }}</text>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goodsData?.price }}</text>
        </view>
        <view class="name ellipsis">{{ goodsData?.name }}</view>
        <view class="desc" v-if="goodsData?.desc">{{ goodsData.desc }}</view>
      </view>

      <!-- 操作面板 (保持静态，等后续有接口再换) -->
      <view class="operation">
        <view class="item arrow">
          <text class="label">选择</text>
          <text class="text ellipsis"> 囤货4条装（樱花粉+薄荷绿+麻米+雾蓝色） </text>
        </view>
        <view class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis">京市顺区顺路81号马程序员</text>
        </view>
        <view class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis">无忧退 快速退款 免费包邮</text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 👇 属性详情循环渲染 -->
          <view class="item" v-for="(item, index) in goodsData?.details?.properties" :key="index">
            <text class="label">{{ item.name }}</text>
            <text class="value">{{ item.value }}</text>
          </view>
        </view>
        <!-- 👇 图片详情循环渲染 -->
        <image
          v-for="item in goodsData?.details?.pictures"
          :key="item"
          mode="widthFix"
          :src="item"
        />
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <!-- 👇 同类推荐循环渲染 -->
        <navigator
          v-for="item in goodsData?.similarProducts"
          :key="item.id"
          class="goods"
          hover-class="none"
          :url="`/pages/goods/goods?id=${item.id}`"
        >
          <image
            class="image"
            mode="aspectFill"
            :src="item.picture"
            @error="item.picture = '/static/images/error-bg.png'"
          />
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ item.price }}</text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <navigator class="icons-button"><text class="icon-cart"></text>购物车</navigator>
    </view>
    <view class="buttons">
      <view class="addcart">加入购物车</view>
      <view class="payment">立即购买</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;
  .preview {
    height: 750rpx;
    position: relative;
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }

  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #35c8a9;
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }
    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }

  .operation {
    padding-left: 20rpx;
    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      position: relative;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: 0 none;
      }
      .label {
        width: 60rpx;
        color: #898b94;
        margin: 0 16rpx 0 10rpx;
      }
      .text {
        flex: 1;
        -webkit-line-clamp: 1;
      }
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
      .label {
        width: 200rpx;
      }
      .value {
        flex: 1;
      }
    }
  }
}

/* 同类推荐 */
.similar {
  padding-left: 20rpx;
  .content {
    padding: 0 20rpx 20rpx;
    margin-left: -20rpx;
    background-color: #f4f4f4;
    overflow: hidden;
    navigator {
      width: 345rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 20rpx 0 0;
      border-radius: 10rpx;
      background-color: #fff;
      float: left;
    }
    .image {
      height: 260rpx;
    }
    .name {
      height: 80rpx;
      margin: 10rpx 0;
    }
    .price {
      line-height: 1;
      font-size: 26rpx;
      color: #cf4444;
    }
    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
    navigator {
      &:nth-child(even) {
        margin-right: 0;
      }
    }
  }
}

/* 底部工具栏 */
.toolbar {
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #ffa868;
    }
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }

  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;
    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
