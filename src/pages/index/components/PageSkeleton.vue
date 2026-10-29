<template name="skeleton">
  <!-- <view is="components/XgxSwiper">
    <view class="carousel XgxSwiper--carousel sk-carousel">
      <swiper :circular="true" :interval="3000" :current="0" :autoplay="false"></swiper>
      <view class="indicator XgxSwiper--indicator">
        <text class="dot XgxSwiper--dot active XgxSwiper--active sk-dot sk-dot-active"></text>
        <text class="dot XgxSwiper--dot sk-dot"></text>
        <text class="dot XgxSwiper--dot sk-dot"></text>
        <text class="dot XgxSwiper--dot sk-dot"></text>
        <text class="dot XgxSwiper--dot sk-dot"></text>
      </view>
    </view>
  </view> -->
  <view is="pages/index/components/CategoryPanel">
    <view class="category CategoryPanel--category">
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-366 sk-text"
          style="background-position-x: 50%"
          >居家</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-424 sk-text"
          style="background-position-x: 50%"
          >锦鲤</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-17 sk-text"
          style="background-position-x: 50%"
          >服饰</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-122 sk-text"
          style="background-position-x: 50%"
          >母婴</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-94 sk-text"
          style="background-position-x: 50%"
          >个护</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-925 sk-text"
          style="background-position-x: 50%"
          >严选</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-320 sk-text"
          style="background-position-x: 50%"
          >数码</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-294 sk-text"
          style="background-position-x: 50%"
          >运动</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-926 sk-text"
          style="background-position-x: 50%"
          >杂项</text
        >
      </navigator>
      <navigator
        class="category-item CategoryPanel--category-item"
        hover-class="none"
      >
        <image
          class="icon CategoryPanel--icon sk-image"
          mode="aspectFit"
        ></image>
        <text
          class="text CategoryPanel--text sk-transparent sk-text-14-2857-73 sk-text"
          style="background-position-x: 50%"
          >品牌</text
        >
      </navigator>
    </view>
  </view>
  <view is="pages/index/components/HotPanel">
    <view class="panel HotPanel--panel hot HotPanel--hot">
      <view class="item HotPanel--item">
        <view class="title HotPanel--title">
          <text
            class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-245 sk-text"
            style="background-position-x: 50%"
            >特惠</text
          >
          <text
            class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-730 sk-text"
            style="background-position-x: 50%"
            >精选全攻略</text
          >
        </view>
        <navigator class="cards HotPanel--cards" hover-class="none">
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
        </navigator>
      </view>
      <view class="item HotPanel--item">
        <view class="title HotPanel--title">
          <text
            class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-944 sk-text"
            style="background-position-x: 50%"
            >爆款</text
          >
          <text
            class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-803 sk-text"
            style="background-position-x: 50%"
            >最受欢迎</text
          >
        </view>
        <navigator class="cards HotPanel--cards" hover-class="none">
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
        </navigator>
      </view>
      <view class="item HotPanel--item">
        <view class="title HotPanel--title">
          <text
            class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-627 sk-text"
            style="background-position-x: 50%"
            >一站买全</text
          >
          <text
            class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-663 sk-text"
            style="background-position-x: 50%"
            >精心优选</text
          >
        </view>
        <navigator class="cards HotPanel--cards" hover-class="none">
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
        </navigator>
      </view>
      <view class="item HotPanel--item">
        <view class="title HotPanel--title">
          <text
            class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-256 sk-text"
            style="background-position-x: 50%"
            >新鲜好物</text
          >
          <text
            class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-497 sk-text"
            style="background-position-x: 50%"
            >生活加分项</text
          >
        </view>
        <navigator class="cards HotPanel--cards" hover-class="none">
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
          <image
            class="image HotPanel--image sk-image"
            mode="aspectFit"
          ></image>
        </navigator>
      </view>
    </view>
  </view>
  <view is="components/XgxGuess" class="r r">
    <view class="caption XgxGuess--caption">
      <text
        class="text XgxGuess--text sk-transparent sk-text-0-0000-807 sk-text sk-pseudo sk-pseudo-circle"
        style="background-position-x: 50%"
        >猜你喜欢</text
      >
    </view>
  </view>
  <!-- 新增：猜你喜欢下方的商品卡片骨架 -->
  <view class="sk-guess-list">
    <view class="sk-guess-item" v-for="i in 4" :key="i">
      <view class="sk-image sk-guess-img"></view>
      <view class="sk-text sk-guess-name"></view>
      <view class="sk-text sk-guess-name short"></view>
      <view class="sk-text sk-guess-price"></view>
    </view>
  </view>
</template>

<style>
/* ========== 核心：骨架灰度升级，色块更明显 ========== */
/* 三级灰度体系：
   大区块/主图：#d8d8d8（最深，最醒目）
   小图标/辅助图：#e0e0e0
   文字占位条：#e5e5e5
*/

.sk-transparent {
  color: transparent !important;
}

/* 文字占位基础规则 */
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}

/* 批量统一所有文字条的灰色为 #e5e5e5，比原版 #eeeeee 更深更明显 */
.sk-text-14-2857-555,
.sk-text-14-2857-147,
.sk-text-14-2857-366,
.sk-text-14-2857-424,
.sk-text-14-2857-17,
.sk-text-14-2857-122,
.sk-text-14-2857-94,
.sk-text-14-2857-925,
.sk-text-14-2857-320,
.sk-text-14-2857-294,
.sk-text-14-2857-926,
.sk-text-14-2857-73,
.sk-text-14-2857-245,
.sk-text-14-2857-730,
.sk-text-14-2857-944,
.sk-text-14-2857-803,
.sk-text-14-2857-627,
.sk-text-14-2857-663,
.sk-text-14-2857-256,
.sk-text-14-2857-497 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #e5e5e5 0%,
    #e5e5e5 85.7143%,
    transparent 0%
  ) !important;
  position: relative !important;
}

.sk-text-0-0000-807 {
  background-image: linear-gradient(
    transparent 0%,
    #e5e5e5 0%,
    #e5e5e5 100%,
    transparent 0%
  ) !important;
  background-size: 100% 25.3623rpx;
  position: relative !important;
}

/* 图片占位基础样式加深 */
.sk-image {
  background: #d8d8d8 !important;
  border-radius: 12rpx;
}

/* 分类小图标稍浅，区分层级，圆形更贴合业务形态 */
.sk-icon {
  background: #e0e0e0 !important;
  border-radius: 50%;
}

/* 商品图圆角优化，更贴近真实商品卡片 */
.sk-goods-img {
  border-radius: 16rpx;
  width: 100%;
  height: 100%;
}

/* ========== 补全：轮播区骨架色块 ========== */
.sk-carousel {
  width: 100%;
  height: 300rpx;
  background: #d8d8d8 !important;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
}

/* 轮播指示器骨架 */
.sk-dot {
  display: inline-block;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5) !important;
  margin: 0 6rpx;
}
.sk-dot-active {
  background: #ffffff !important;
  width: 24rpx;
  border-radius: 6rpx;
}

/* 伪元素占位 */
.sk-pseudo::before,
.sk-pseudo::after {
  background: #e0e0e0 !important;
  background-image: none !important;
  color: transparent !important;
  border-color: transparent !important;
}

.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
  border-radius: 0 !important;
}

.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
  border-radius: 50% !important;
}

.sk-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
/* 补充猜你喜欢商品骨架样式 */
.sk-guess-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
}
.sk-guess-item {
  width: 48%;
  background: #fff;
  padding: 20rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}
.sk-guess-img {
  width: 100%;
  height: 260rpx;
  margin-bottom: 20rpx;
}
.sk-guess-name {
  width: 100%;
  height: 28rpx;
  margin-bottom: 12rpx;
}
.sk-guess-name.short {
  width: 60%;
}
.sk-guess-price {
  width: 30%;
  height: 32rpx;
  margin-top: 10rpx;
}
</style>
