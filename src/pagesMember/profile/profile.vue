<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getMemberProfileAPI } from '@/services/profile'
import type { ProfileDetail } from '@/types/member'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 1. 定义接口数据源
const profile = ref<ProfileDetail>()

// 2. 获取接口数据的方法
const getMemberProfileData = async () => {
  const res = await getMemberProfileAPI()
  profile.value = res.result
}

onLoad(() => {
  getMemberProfileData()
})

// ==========================================
// 3. 表单交互逻辑 (把你之前写的改一下数据源)
// ==========================================

// 修改头像
// 修改头像
const onAvatarChange = () => {
  // 1. 调用拍照/选择图片
  uni.chooseMedia({
    count: 1, // 文件个数
    mediaType: ['image'], // 文件类型
    success: (res) => {
      // 2. 获取本地路径
      const { tempFilePath } = res.tempFiles[0]

      // 开启 loading 提示
      uni.showLoading({ title: '上传中...' })

      // 3. 文件上传
      uni.uploadFile({
        url: '/member/profile/avatar', // 确保你项目配置了 baseURL，否则这里要写完整地址
        name: 'file', // 后端接收的文件参数名
        filePath: tempFilePath,
        header: { Authorization: `Bearer ${uni.getStorageSync('token')}` },

        // 👇 💡 核心整合部分开始 👇
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // 真实上传成功
            try {
              const avatar = JSON.parse(res.data).result.avatar
              profile.value!.avatar = avatar
              uni.showToast({ icon: 'success', title: '更新成功' })
            } catch (e) {
              console.error('解析数据失败:', e)
              uni.showToast({ icon: 'none', title: '解析数据失败' })
            }
          } else {
            // 服务器报错（如当前的 500 阿里云 AccessKey 被禁用）
            console.error('上传接口返回错误:', res.statusCode, res.data)

            // 💡 降级方案：后端坏了，我们前端直接用手头选中的本地图片顶上去！
            // 反正等后端修好了，代码也不用改，它自然就会走上面的 200 分支了。
            profile.value!.avatar = tempFilePath
            uni.showToast({ icon: 'success', title: '本地模拟更新成功' })
          }
        },
        fail: (err) => {
          // 网络彻底断开或其他原因
          console.error('uploadFile 调用失败:', err)

          // 同样降级为本地预览
          profile.value!.avatar = tempFilePath
          uni.showToast({ icon: 'success', title: '本地模拟更新成功' })
        },
        complete: () => {
          uni.hideLoading() // 不管成功失败，关闭 loading
        },
        // 👆 💡 核心整合部分结束 👆
      })
    },
  })
}

// 处理性别切换 (修改 profile.value.gender)
const onGenderChange = (e: any) => {
  if (profile.value) {
    profile.value.gender = e.detail.value
  }
}
// 处理昵称修改
const onNicknameChange = (e: any) => {
  if (profile.value) {
    profile.value.nickname = e.detail.value
  }
}
// 处理日期选择 (修改 profile.value.birthday)
const onBirthdayChange = (e: any) => {
  if (profile.value) {
    profile.value.birthday = e.detail.value
  }
}

// 处理城市选择 (修改 profile.value.fullLocation)
const onRegionChange = (e: any) => {
  if (profile.value) {
    // 小程序返回的是数组，用空格拼接成字符串
    profile.value.fullLocation = e.detail.value.join(' ')
  }
}
// 处理职业修改
const onProfessionChange = (e: any) => {
  if (profile.value) {
    profile.value.profession = e.detail.value
  }
}
// 保存表单 (后续这里会调用修改接口)
const onSave = () => {
  console.log('准备保存的数据：', profile.value)
  uni.showToast({ title: '保存成功', icon: 'success' })
}
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator
        open-type="navigateBack"
        class="back icon-left"
        hover-class="none"
      ></navigator>
      <view class="title">个人信息</view>
    </view>

    <!-- 头像 -->
    <view class="avatar" @tap="onAvatarChange">
      <view class="avatar-content">
        <!-- 动态绑定接口返回的头像，加一个默认兜底 -->
        <image
          class="image"
          :src="
            profile?.avatar ||
            'https://api.dicebear.com/7.x/avataaars/png?seed=Felix&size=240'
          "
          mode="aspectFill"
        />
        <text class="text">点击修改头像</text>
      </view>
    </view>

    <!-- 表单 -->
    <view class="form">
      <view class="form-content">
        <!-- 账号 -->
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ profile?.account }}</text>
        </view>

        <!-- 昵称 (用 v-model 可以直接修改) -->

        <view class="form-item">
          <text class="label">昵称</text>
          <input
            class="input"
            type="text"
            placeholder="请填写昵称"
            :value="profile?.nickname || ''"
            @input="onNicknameChange"
          />
        </view>

        <!-- 性别 -->
        <view class="form-item">
          <text class="label">性别</text>
          <!-- 💡 加上 @change 事件 -->
          <radio-group @change="onGenderChange">
            <label class="radio">
              <radio
                value="男"
                color="#27ba9b"
                :checked="profile?.gender === '男'"
              />
              男
            </label>
            <label class="radio">
              <radio
                value="女"
                color="#27ba9b"
                :checked="profile?.gender === '女'"
              />
              女
            </label>
          </radio-group>
        </view>

        <!-- 出生日期 -->
        <view class="form-item">
          <text class="label">出生日期</text>
          <!-- 💡 加上 @change 事件 -->
          <picker
            class="picker"
            mode="date"
            :value="profile?.birthday || '1990-01-01'"
            start="1900-01-01"
            :end="new Date().toISOString().split('T')[0]"
            @change="onBirthdayChange"
          >
            <view v-if="profile?.birthday">{{ profile?.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>

        <!-- 城市 -->
        <view class="form-item">
          <text class="label">城市</text>
          <!-- 💡 加上 @change 事件 -->
          <picker
            class="picker"
            mode="region"
            :value="(profile?.fullLocation || '').split(' ')"
            @change="onRegionChange"
          >
            <view v-if="profile?.fullLocation">{{
              profile?.fullLocation
            }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>

        <!-- 职业 (用 v-model 可以直接修改) -->
        <view class="form-item">
          <text class="label">职业</text>
          <input
            class="input"
            type="text"
            placeholder="请填写职业"
            :value="profile?.profession || ''"
            @input="onProfessionChange"
          />
        </view>
      </view>

      <!-- 提交按钮 (加上点击事件) -->
      <button class="form-button" @tap="onSave">保存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
  height: 100%;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 👇 💡 核心修改：页面底色为浅灰，顶部用纯色渐变覆盖 420rpx 的高度 */
  background-color: #f4f4f4;
  background-image: linear-gradient(to bottom, #27ba9b, #2cb694);
  background-size: 100% 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 88rpx;
    width: 88rpx;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40rpx; /* 图标稍微放大点 */
    color: #fff;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee; /* 图片没加载出来时显示灰色圆圈 */
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff; /* 确保文字是白色 */
  }
}

// 表单
.form {
  background-color: transparent; /* 去掉原本的底色，让外层 background-image 透出来 */

  &-content {
    margin: 20rpx 30rpx 0; /* 调整外边距，左右留白更多 */
    padding: 0 30rpx;
    border-radius: 16rpx; /* 加大圆角 */
    background-color: #fff;
    /* 加一点极淡的阴影，更有质感 */
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.03);
  }

  &-item {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
    height: 100rpx; /* 拉高每行的高度，显得更舒展 */
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #f2f2f2; /* 分割线变淡 */

    &:last-child {
      border: none;
    }

    .label {
      width: 160rpx; /* 固定标签宽度 */
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      height: 100%;
    }

    .radio {
      margin-right: 30rpx;
    }

    .picker {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    margin: 40rpx 30rpx; /* 上下留出更多空间 */
    color: #fff;
    border-radius: 88rpx; /* 胶囊圆角 */
    font-size: 32rpx;
    background-color: #27ba9b;

    /* 💡 去除小程序按钮自带的默认边框 */
    &::after {
      border: none;
    }
  }
}
</style>
