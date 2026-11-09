<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { getGoodsByIdAPI } from '@/services/goods'
import type { GoodsResult } from '@/types/goods' // 引入类型
//import type { UniHelper } from '@uni-helper/uni-ui-types'
import type { SkuPopupLocaldata, SkuPopupInstance } from '@/types/components'
// 获取屏幕边界到安全区域距离手机（特别是 iPhone）底部都有一个黑色的小横条（Home Indicator）
// 如果你的底部工具栏（加入购物车那个）贴着屏幕最底下写，按钮就会被小黑条挡住
// 这个 safeAreaInsets.bottom 就是你手机底部小黑条的高度
import AddressPanel from './components/AddressPanel.vue'
import ServicePanel from './components/ServicePanel.vue'

const { safeAreaInsets } = uni.getSystemInfoSync()
// 定义响应式数据（用 GoodsResult 类型，不用 any 了）
const query = defineProps<{
  id: string
}>()
const goodsData = ref<GoodsResult>({} as GoodsResult)
const localdata = ref<SkuPopupLocaldata>({} as SkuPopupLocaldata)
// 接收页面参数
//  用 onLoad 接收路由参数
// 核心逻辑：请求数据并转换格式 (只保留这一个正确的函数)
const getGoodsByIdData = async () => {
  // 直接用 query.id 获取参数
  const res = await getGoodsByIdAPI(query.id)
  goodsData.value = res.result

  // 转换 SKU 组件所需格式
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0],
    spec_list: res.result.specs.map((v) => ({
      name: v.name,
      list: v.values,
    })),
    sku_list: res.result.skus.map((v) => ({
      _id: v.id,
      goods_id: res.result.id,
      goods_name: res.result.name,
      image: v.picture,
      price: v.price * 100,
      stock: v.inventory,
      sku_name_arr: v.specs.map((vv) => vv.valueName),
    })),
  }
}

// 1. 定义当前轮播图的下标// 轮播图当前下标
const currentIndex = ref(0)
// 2. 监听轮播图滑动事件
// const onChange: UniHelper.SwiperOnChange = (ev) => {
//   currentIndex.value = ev.detail!.current
// }
const onChange: UniHelper.SwiperOnChange = (ev: any) => {
  currentIndex.value = ev.detail!.current
}
// 3. 点击图片预览大图
function onTapImage(url: string) {
  uni.previewImage({
    current: url,
    // 如果变量叫 goodsData，这里就是 goodsData.value!.mainPictures
    urls: goodsData.value?.mainPictures || [],
  })
}
onLoad(() => {
  // 从 options 里拿正确的 id，并直接传参
  getGoodsByIdData()
})
// 拿到 ID 后，下一步就是拿着这个 ID 去请求商品详情接口了

// 先用 any，免得报错const popup = ref<any>()
// 替换原来的 popup 定义，加上类型提示（方便敲代码时出提示）
// const popup = ref<{
//   open: (type?: UniHelper.UniPopupType) => void
//   close: () => void
// }>()
const popup = ref<{
  open: (type?: 'top' | 'center' | 'bottom' | 'left' | 'right') => void
  close: () => void
}>()
// 控制弹窗名字的变量。默认为空
const popupName = ref<'address' | 'service'>()

// 统一的打开弹窗方法，接收名字作为参数
const openPopup = (name: typeof popupName.value) => {
  // 1. 修改当前要渲染的弹窗名字
  popupName.value = name
  // 2. 打开弹窗
  popup.value?.open()
}
// 控制 SKU 弹窗显示隐藏
const isShowSku = ref(false)
// 打开 SKU 弹窗的方法（你在页面底部加入购物车按钮时调用）
enum SkuMode {
  Both = 1, // 都显示
  Cart = 2, // 只显示购物车
  Buy = 3, // 只显示立即购买
}

// 💡 2. 定义当前模式，默认都显示
const mode = ref<SkuMode>(SkuMode.Both)
// 💡 3. 重写打开 SKU 弹窗的函数（对齐图5）
const openSkuPopup = (val: SkuMode) => {
  mode.value = val
  isShowSku.value = true
}
// 点击加入购物车
const addCart = (selectShop: any) => {
  console.log('加入购物车的数据：', selectShop)
  uni.showToast({ title: '加入购物车成功', icon: 'none' })
  setTimeout(() => {
    isShowSku.value = false
  }, 300)
}

// 点击立即购买
const buyNow = (selectShop: any) => {
  console.log('立即购买的数据：', selectShop)
  uni.showToast({ title: '准备去支付', icon: 'none' })
}
// 💡 2. 定义弹窗组件实例 Ref
const skuPopupRef = ref<SkuPopupInstance>()

// 💡 3. 计算当前选中的规格文本
const selectArrText = computed(() => {
  // 如果实例存在，且选中的数组有长度，就用空格拼接并去除两端空格
  // 如果没选，或者被清空了（取消选择），则返回默认提示文字
  return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})
const activeStyle = computed(() => {
  // 如果当前是“立即购买”模式，选中标签显示绿色
  if (mode.value === SkuMode.Buy) {
    return {
      color: '#27BA9B',
      borderColor: '#27BA9B',
      backgroundColor: '#E9F8F5',
    }
  }
  // 如果是“加入购物车”模式，显示橙色
  return {
    color: '#FFA868',
    borderColor: '#FFA868',
    backgroundColor: '#FFF3E9',
  }
})
</script>

<template>
  <vk-data-goods-sku-popup
    v-model="isShowSku"
    :mode="mode"
    :localdata="localdata"
    add-cart-background-color="#FFA868"
    buy-now-background-color="#27BA9B"
    ref="skuPopupRef"
    :actived-style="activeStyle"
    @add-cart="addCart"
    @buy-now="buyNow"
  />
  <scroll-view scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <!-- 加上 @change 监听滑动 -->
        <swiper circular @change="onChange">
          <swiper-item
            v-for="(item, index) in goodsData?.mainPictures"
            :key="index"
          >
            <image @tap="onTapImage(item)" mode="aspectFill" :src="item" />
          </swiper-item>
        </swiper>
        <!-- 指示器动态绑定 -->
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
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

      <!-- 操作面板 (保持留选择、送至、服务) -->
      <view class="operation">
        <!-- 💡 使用内联箭头函数写法，和讲师图4对齐 -->
        <view class="item arrow" @tap="($event) => openSkuPopup(SkuMode.Both)">
          <text class="label">选择</text>
          <text class="text ellipsis">{{ selectArrText }}</text>
        </view>
        <view class="item arrow" @tap="($event) => openPopup('address')">
          <text class="label">送至</text>
          <text class="text ellipsis">请选择收货地址</text>
        </view>
        <view class="item arrow" @tap="($event) => openPopup('service')">
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
          <view
            class="item"
            v-for="(item, index) in goodsData?.details?.properties"
            :key="index"
          >
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
        <!-- 同类推荐循环渲染 -->
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
  <view
    class="toolbar"
    :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
  >
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <navigator class="icons-button"
        ><text class="icon-cart"></text>购物车</navigator
      >
    </view>
    <view class="buttons">
      <view @tap="($event) => openSkuPopup(SkuMode.Cart)" class="addcart"
        >加入购物车</view
      >
      <!-- 传入 SkuMode.Buy -->
      <view @tap="($event) => openSkuPopup(SkuMode.Buy)" class="payment"
        >立即购买</view
      >
    </view>
  </view>
  <!-- 在 template 的最下面 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <!--修改：通过 popupName 判断渲染哪个子组件 -->
    <AddressPanel v-if="popupName === 'address'" @close="popup?.close()" />
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>
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
  } /* 👈 💡 核心修复：加上这个 } 把 preview 闭合掉！ */

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
} /* 👈 .goods 的大括号到这里结束 */

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
    display: flex;
    align-items: center;
    view {
      width: 200rpx;
      text-align: center;
      line-height: 68rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
      border-radius: 32rpx; /* 或者 16rpx，看你喜欢哪个 */
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
      &::after {
        border: none;
      }
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
.popup-content {
  padding-bottom: calc(
    30rpx + constant(safe-area-inset-bottom)
  ); /* 兼容老版本iOS */
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom)); /* 兼容新版iOS */
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0; /* 给弹窗加个圆角，更美观 */
}
</style>
