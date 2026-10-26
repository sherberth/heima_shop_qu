<script setup lang="ts">
import type { BannerItem } from '@/types/home'
import { ref } from 'vue'

const activeIndex = ref(0)
//当swiper下标发生变化时触发取ev
const onChange: UniHelper.SwiperOnChange = (ev) => {
  if (ev.detail && ev.detail.current !== undefined) {
    // 2. 把当前索引赋值给 activeIndex，让指示点联动
    activeIndex.value = ev.detail.current
  }
}
//定义props接收
// 写法二：定义接口（推荐，更清晰）
interface Props {
  list: BannerItem[]
}
const props = defineProps<Props>()

// console.log(props)
// // 在 script 里定义你喜欢的那两张网图的下标
// const favoriteNetworkImages = [0, 3] // 代表取 list[0] 和 list[2] 的图
// // 👇 新增：处理图片路径的核心函数
// const getImageUrl = (item: BannerItem, index: number) => {
//   // 1. 偶数位置：显示本地图（循环使用 3 张本地图）
//   if (index % 2 === 0) {
//     const localIndex = ((index / 2) % 3) + 1 // 0->1, 2->2, 4->3, 6->1...
//     return `/static/images/banner${localIndex}.png`
//   }

//   // 2. 奇数位置：显示你喜欢的网图（在这 2 张里循环交替）
//   // Math.floor(index / 2) 能得到 0, 1, 2, 3...
//   // 再对 2 取模，就能让它在 0 和 1 之间反复横跳
//   const netImgIndex = favoriteNetworkImages[Math.floor(index / 2) % 2]
//   let netIndex = Math.floor(index / 2) // 获取当前的网图序号 (0, 1, 2, 3, 4...)

//   // 👇 核心拦截：如果是第四张网图（索引 3），直接把它变成第五张（索引 4）
//   if (netIndex === 3) {
//     netIndex = 4
//   }
//   // 取出那张网图的链接，加个兜底
//   return props.list[netImgIndex]?.imgUrl || '/static/images/banner1.png'
// }
/* // 1. 如果后端压根没传图，或者传了个空字符串，给个默认本地图垫底
  if (!url) return '/static/images/banner1.png'
  // 2. 如果是完整的网络图片（http 或 https 开头），直接用
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 3. 如果是本地绝对路径（以 / 开头，比如 /static/images/banner1.png），直接用
  if (url.startsWith('/')) {
    return url
  }
  // 4. 如果只是返回了文件名（比如 banner1.png），自动给它拼上本地目录
  return `/static/images/${url}`
} <template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <!-- 第1张图 -->
      <!-- 修改后 👇 -->
      <swiper-item v-for="(item, index)in list" :key="item.id">
        <navigator :url="item.hrefUrl || '/pages/index/index'" hover-class="none" class="navigator">
          <!-- <image
            mode="aspectFill"
            class="image"
            :src="getImageUrl(item, index)"
            @error="item.imgUrl = '/static/images/banner1.png'"
          ></image> -->
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 轮播图指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>*/
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <!-- 循环渲染后端返回的数据 -->
      <swiper-item v-for="(item, index) in list" :key="item.id">
        <!-- 注意这里 url 前面必须要有冒号 : -->
        <navigator :url="item.hrefUrl || '/pages/index/index'" hover-class="none" class="navigator">
          <!-- 直接使用后端的网络图 -->
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 轮播图指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
/* 绝对不要加 scoped */
:host {
  display: block;
  height: 280rpx;
}

/* 轮播图 */
.carousel {
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;

  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;

    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }

    .active {
      background-color: #fff;
    }
  }

  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
