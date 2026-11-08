<script setup lang="ts">
import { ref } from 'vue'
// 💡 确保路径和你的实际文件路径一致
import VkDataGoodsSkuPopup from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup.vue'

// 控制弹窗是否显示
const skuKey = ref(false)
// 弹窗模式 1 = 购物车模式
const skuMode = ref(1)

// 准备假数据
const goodsInfo = ref({
  _id: '001',
  name: 'iphone11',
  goods_thumb:
    'https://img14.360buyimg.com/n0/jfs/t1/59022/28/10293/141808/5d78088fEf6e7862d/68836f52ffaaad96.jpg',
  sku_list: [
    {
      _id: '001',
      goods_id: '001',
      goods_name: 'iphone11',
      image:
        'https://img14.360buyimg.com/n0/jfs/t1/79668/22/9987/159271/5d780915Ebf9bf3f4/6a1b2703a9ed8737.jpg',
      price: 19800,
      sku_name_arr: ['红色', '128G', '公开版'],
      stock: 1000,
    },
    {
      _id: '002',
      goods_id: '001',
      goods_name: 'iphone11',
      image:
        'https://img14.360buyimg.com/n0/jfs/t1/52252/35/10516/124064/5d7808e0E46202391/7100f3733a1c1f00.jpg',
      price: 9800,
      sku_name_arr: ['白色', '256G', '公开版'],
      stock: 100,
    },
  ],
  spec_list: [
    {
      name: '颜色',
      list: [{ name: '红色' }, { name: '黑色' }, { name: '白色' }],
    },
    { name: '内存', list: [{ name: '128G' }, { name: '256G' }] },
    { name: '版本', list: [{ name: '公开版' }, { name: '非公开版' }] },
  ],
})

const openSkuPopup = () => {
  skuKey.value = true
}

const onOpenSkuPopup = () => {
  console.log('打开sku组件')
}

const onCloseSkuPopup = () => {
  console.log('关闭sku组件')
}

const addCart = (selectShop: any) => {
  console.log('加入购物车', selectShop)
  uni.showToast({ title: '加入购物车成功', icon: 'none' })
  setTimeout(() => {
    skuKey.value = false
  }, 300)
}

const buyNow = (selectShop: any) => {
  console.log('立即购买', selectShop)
  uni.showToast({ title: '立即购买', icon: 'none' })
}
</script>

<template>
  <view class="app">
    <button @click="openSkuPopup">打开SKU组件</button>

    <!-- 💡 变量在这里被使用了，这样上面就不会变灰了 -->
    <VkDataGoodsSkuPopup
      ref="skuPopup"
      v-model="skuKey"
      border-radius="20"
      :z-index="990"
      :localdata="goodsInfo"
      :mode="skuMode"
      @open="onOpenSkuPopup"
      @close="onCloseSkuPopup"
      @add-cart="addCart"
      @buy-now="buyNow"
    ></VkDataGoodsSkuPopup>
  </view>
</template>

<style lang="scss" scoped>
.app {
  padding: 30rpx;
}
</style>
