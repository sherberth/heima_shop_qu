<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCategoryTopAPI } from '@/services/category'
import { getHomeBannerAPI } from '@/services/home'
import type { BannerItem } from '@/types/home'
import type { CategoryTopItem } from '@/types/category'
import { processGoodsData } from '@/utils/goodsHandler'

// ================= 数据获取 =================
// 轮播图
const bannerList = ref<BannerItem[]>([])
const getBannerData = async () => {
  const res = await getHomeBannerAPI(2)
  bannerList.value = res.result
}

// 分类数据
const categoryList = ref<CategoryTopItem[]>([])
// 👇 补充这个处理图片链接的函数
const handleImageUrl = (url: string) => {
  if (!url) return ''
  return url.replace('http://', 'https://')
}
const activeIndex = ref(0) // 左侧高亮下标
const getCategoryTopData = async () => {
  const res = await getCategoryTopAPI()

  // 👇 加个 || [] 防止后端返回 null 导致 .map 报错
  const rawList = res.result || []

  categoryList.value = rawList.map((topItem) => {
    return {
      ...topItem,
      // 如果 children 可能是空，加个 || []
      children: (topItem.children || []).map((childItem) => {
        return {
          ...childItem,
          // 调用过滤函数
          goods: processGoodsData(childItem.goods || []),
        }
      }),
    }
  })
}

// 👇 【方案二整合点 1】：定义控制滚动定位的响应式变量
const scrollIntoViewId = ref('')
// ================= 核心魔法 =================
// 提取当前选中的二级分类数据
// 当 activeIndex 改变时，subCategoryList 会自动重新计算
const subCategoryList = computed(() => {
  return categoryList.value[activeIndex.value]?.children || []
})
// 👇 【方案二整合点 2】：左侧点击切换事件
const onLeftTabClick = (index: number) => {
  activeIndex.value = index

  // 当点击左侧切换大类时，右侧内容会瞬间重新渲染。
  // 此时我们强制让右侧滚动到第一个二级分类的锚点位置（即面板顶部）。
  // 注意：这里为了确保能触发滚动，通常需要配合 nextTick 或者 setTimeout
  setTimeout(() => {
    scrollIntoViewId.value = 'anchor-0'

    // 小技巧：清除一下绑定，防止连续点击同一个分类时，因为值没变而不触发滚动
    setTimeout(() => {
      scrollIntoViewId.value = ''
    }, 100)
  }, 50)
}

// 页面加载
onLoad(() => {
  getBannerData()
  getCategoryTopData()
})
</script>

<template>
  <view class="viewport">
    <!-- 搜索框 (略) -->
    <!-- 如果想保留搜索框，确保它在最上面 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">女靴</text>
      </view>
    </view>
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="onLeftTabClick(index)"
        >
          {{ item.name }}
        </view>
      </scroll-view>

      <!-- 右侧：二级分类 -->
      <!-- 👇 【方案二整合点 3】：绑定 scroll-into-view 属性 -->
      <scroll-view
        class="secondary"
        scroll-y
        :scroll-into-view="scrollIntoViewId"
        scroll-with-animation
      >
        <!-- 轮播图这里可以作为头部，不参与锚点 -->
        <XgxSwiper class="banner" :list="bannerList" />

        <!-- 内容区域 -->
        <!-- 👇 【方案二整合点 4】：给每一个二级分类面板绑定唯一的 ID 作为锚点 -->
        <view
          class="panel"
          v-for="(item, index) in subCategoryList"
          :key="item.id"
          :id="'anchor-' + index"
        >
          <view class="title">
            <text class="name">{{ item.name }}</text>
            <navigator class="more" hover-class="none">全部</navigator>
          </view>

          <!-- 商品列表 -->
          <view class="section">
            <navigator
              v-for="goods in item.goods"
              :key="goods.id"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=${goods.id}`"
            >
              <image class="image" mode="aspectFill" :src="handleImageUrl(goods.picture)"></image>
              <view class="name ellipsis">{{ goods.name }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ goods.price }}</text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* ================= 锁死大框架 ================= */
page {
  height: 100%;
  overflow: hidden; /* 🚨 核心：禁止整个页面滚动 */
  background-color: #f7f8fa;
}

.viewport {
  height: 100vh; /* 高度撑满屏幕 */
  display: flex;
  flex-direction: column;
}

/* 搜索框 */
.search {
  padding: 20rpx;
  background-color: #fff;
  flex-shrink: 0; /* 防止搜索框被压缩 */
  .input {
    height: 64rpx;
    background-color: #f5f5f5;
    border-radius: 32rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #999;
  }
}

/* ================= 左右分栏 ================= */
.categories {
  display: flex;
  flex: 1; /* 占据剩余高度 */
  overflow: hidden; /* 🚨 核心：内部各自滚动 */

  /* 左侧一级分类 */
  /* 左侧一级分类 */
  .primary {
    width: 60rpx; /*改成 150rpx，这个宽度在 90% 的手机上看起来是最舒服的 */
    flex-shrink: 0; /* 保持不变，锁定宽度 */
    height: 100%;
    background-color: #f7f8fa;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100rpx;
      width: 100%; /* 限制宽度 */
      padding: 10rpx; /* 给一点点内边距 */
      font-size: 26rpx;
      box-sizing: border-box; /* 防止 padding 撑破 120rpx */
      color: #333;
      text-align: center;
      /* 删掉 white-space: nowrap; 等属性，让文字自然居中即可 */

      /* 选中高亮状态 */
      &.active {
        background-color: #fff;
        color: #27ba9b;
        font-weight: bold;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 8rpx;
          height: 40rpx;
          background-color: #27ba9b;
        }
      }
    }
  }

  /* 右侧二级分类与商品 */
  .secondary {
    flex: 1; /* 右侧自动填满剩下的空间 */
    height: 100%; /* 🚨 核心：必须给 100% 高度才能独立滚动 */
    background-color: #fff;

    .banner {
      margin: 20rpx;
      height: 200rpx;
    }

    .panel {
      padding: 0 20rpx;
      margin-bottom: 40rpx;

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;

        .name {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }
        .more {
          font-size: 24rpx;
          color: #999;
        }
      }

      /* 商品网格布局 */
      .section {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;

        .goods {
          width: calc((100% - 40rpx) / 3);
          display: flex;
          flex-direction: column;

          .image {
            width: 100%;
            height: 180rpx;
            border-radius: 8rpx;
            background-color: #f5f5f5;
            /* 因为 template 加了 mode="aspectFill"，所以这里只设宽高即可 */
          }

          .name {
            font-size: 24rpx;
            color: #333;
            margin-top: 10rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            height: 68rpx; /* 固定高度防错位 */
          }

          .price {
            margin-top: 6rpx;
            color: #cf4444;
            font-size: 26rpx;
            .symbol {
              font-size: 70%;
            }
          }
        }
      }
    }
  }
}
</style>
