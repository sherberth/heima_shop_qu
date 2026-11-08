<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getMemberProfileAPI, putMemberProfileAPI } from '@/services/profile'
import type { ProfileDetail, Gender } from '@/types/member'
import { useMemberStore } from '@/stores'
// 1. 引入 onShow
import { onShow } from '@dcloudio/uni-app'

const memberStore = useMemberStore()
// 2. 加上 onShow 钩子
onShow(() => {
  // 每次回到这个页面，主动打印一下最新数据，方便你确认
  console.log('回到我的页面，最新头像是：', memberStore.profile?.avatar)
})
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

// 👇 下一步：调用修改接口
// const res = await putMemberProfileAPI(formData)
// 如果成功：uni.showToast({ title: '修改成功' }); uni.navigateBack();

// ==========================================
// 3. 表单交互逻辑 (把你之前写的改一下数据源)
// ==========================================

// 修改头像
const onAvatarChange = () => {
  // 1. 先手动弹出微信原生的底部操作菜单
  uni.showActionSheet({
    itemList: ['拍照', '从手机相册选择'],
    success: (res) => {
      // res.tapIndex 是用户点击的索引：0是拍照，1是相册
      if (res.tapIndex === 0) {
        chooseImage('camera')
      } else if (res.tapIndex === 1) {
        chooseImage('album')
      }
    },
    fail: () => {
      // 用户点击了“取消”，什么都不做即可
      console.log('用户取消了选择')
    },
  })
}

// 2. 抽离出来的选图和上传逻辑
const chooseImage = (sourceType: 'camera' | 'album') => {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: [sourceType], // 💡 关键：根据菜单的选择指定来源
    success: (res) => {
      const { tempFilePath } = res.tempFiles[0]
      uni.showLoading({ title: '上传中...' })

      // 3. 上传文件（带降级兜底）
      uni.uploadFile({
        url: '/member/profile/avatar',
        name: 'file',
        filePath: tempFilePath,
        header: { Authorization: `Bearer ${uni.getStorageSync('token')}` },
        // ... uni.uploadFile 内部 ...
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const avatar = JSON.parse(res.data).result.avatar

            // 1. 更新当前页面数据
            profile.value!.avatar = avatar

            // 2. 💡 讲师的写法：直接同步给 Store 的头像
            if (memberStore.profile) {
              memberStore.profile.avatar = avatar
            }

            uni.showToast({ icon: 'success', title: '更新成功' })
          } else {
            // 降级兜底展示本地图片
            profile.value!.avatar = tempFilePath
            if (memberStore.profile) {
              memberStore.profile.avatar = tempFilePath // 兜底也同步
            }
            uni.showToast({ icon: 'success', title: '本地模拟更新成功' })
          }
        },
        fail: () => {
          profile.value!.avatar = tempFilePath
          uni.showToast({ icon: 'success', title: '本地模拟更新成功' })
        },
        complete: () => {
          uni.hideLoading()
        },
      })
    },
  })
}

// 修改性别
const onGenderChange: UniHelper.RadioGroupOnChange = (ev) => {
  // ev.detail.value 的类型是 string，我们需要断言成 Gender 类型
  if (profile.value) {
    profile.value.gender = ev.detail.value as Gender
  }
}

// 修改生日
const onBirthdayChange: UniHelper.DatePickerOnChange = (ev) => {
  if (profile.value) {
    profile.value.birthday = ev.detail.value
  }
}

// 处理昵称修改
const onNicknameChange = (e: any) => {
  if (profile.value) {
    profile.value.nickname = e.detail.value
  }
}

// 处理城市选择 (修改 profile.value.fullLocation)

// 💡 1. 新增一个专门存放代码的数组变量（讲师的思路）
let fullLocationCode: [string, string, string] = ['', '', '']

// 💡 2. 替换原来的 onRegionChange，使用 UniHelper 获取完整类型提示
const onFullLocationChange: UniHelper.RegionPickerOnChange = (ev) => {
  if (profile.value) {
    // 修改前端界面显示的文字
    profile.value.fullLocation = ev.detail.value.join(' ')

    // 提交后端更新的代码数组
    fullLocationCode = ev.detail.code!
  }
}
// 处理职业修改
const onProfessionChange = (e: any) => {
  if (profile.value) {
    profile.value.profession = e.detail.value
  }
}
// 保存表单 (后续这里会调用修改接口)
// 4. 保存表单（只保留这一个 onSave）
// ==========================================
const onSubmit = async () => {
  if (!profile.value) return

  // 解构出需要用的基础数据
  const { nickname, gender, birthday, profession } = profile.value
  const [provinceCode, cityCode, countyCode] = fullLocationCode
  try {
    uni.showLoading({ title: '保存中...' })

    const res = await putMemberProfileAPI({
      nickname,
      gender,
      birthday,
      profession,
      provinceCode,
      cityCode,
      countyCode,
    })

    uni.hideLoading()
    uni.showToast({ icon: 'success', title: '保存成功' })

    // 同步 Store（保留咱们之前的全局同步逻辑）
    if (memberStore.profile) {
      memberStore.profile.nickname = nickname
      memberStore.profile.gender = gender
      memberStore.profile.birthday = birthday
      memberStore.profile.profession = profession
      if (res && res.result) {
        Object.assign(memberStore.profile, res.result)
      }
    }

    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ icon: 'none', title: '保存失败' })
    console.error('保存失败:', error)
  }
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
          <picker
            class="picker"
            mode="region"
            :value="(profile?.fullLocation || '').split(' ')"
            @change="onFullLocationChange"
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
      <button class="form-button" @tap="onSubmit">保存</button>
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
