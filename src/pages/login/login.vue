<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { postLoginWxMinAPI, postLoginWxMinSimpleAPI } from '@/services/login'
import { useMemberStore } from '@/stores'
import type { LoginResult } from '@/types/member'

// 1. 顶层统一声明 Store，所有函数共用
const memberStore = useMemberStore()
let code = ''

// 2. 页面加载获取 code
onLoad(async () => {
  const res = await uni.login({ provider: 'weixin' })
  code = res.code as string
  console.log('获取到的 code:', code)
})

// 3. 核心枢纽：登录成功后的统一处理函数
const loginSuccess = (profile: LoginResult) => {
  //const memberStore = useMemberStore()
  // 保存会员信息到 Pinia（插件会自动持久化到本地）
  memberStore.setProfile(profile)

  // 成功提示
  uni.showToast({ icon: 'success', title: '登录成功' })

  // 延迟跳转
  setTimeout(() => {
    // 如果你是从 my.vue 跳来的，用 navigateBack 体验最好。
    // 如果你想完全跟讲师一样，把这行换成 uni.switchTab({ url: '/pages/my/my' })
    uni.navigateBack()
  }, 500)
}

// ==========================================
// 以下为具体的登录触发方式
// ==========================================

// 方式一：模拟手机号码快捷登录（你目前测试用这个）
const onGetphonenumberSimple = async () => {
  const res = await postLoginWxMinSimpleAPI('13123456789')
  console.log('模拟登录结果：', res)

  if (res.result) {
    // 直接调用公共函数
    loginSuccess(res.result)
  } else {
    // 极端情况兜底：万一接口没返回数据，塞个假数据方便你后续测试
    loginSuccess({
      account: 'test_user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Felix&size=240',
      id: 1,
      mobile: '13123456789',
      nickname: '测试用户',
      token: 'mock-token-123456',
    })
  }
}

// 方式二：获取用户手机号码（真实企业环境用这个）
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev: any) => {
  // 拦截用户拒绝授权
  if (ev.detail.errMsg !== 'getPhoneNumber:ok') {
    return uni.showToast({ title: '您取消了授权', icon: 'none' })
  }

  const encryptedData = ev.detail!.encryptedData!
  const iv = ev.detail!.iv!

  // 发起真实请求
  const res = await postLoginWxMinAPI({ code, encryptedData, iv })
  console.log('真实登录结果:', res)

  if (res.result) {
    // 直接调用公共函数
    loginSuccess(res.result)
  }
}
</script>
<!-- 目前的代码里，核心用到了 4 个函数，分为两类：
1. 目前能走的流程（个人开发者测试用）

onLoad：页面加载时，静默获取微信登录的 code。

onGetphonenumberSimple：你目前唯一能走通的主流程。点击“模拟快捷登录”触发，调用接口，成功后调用 loginSuccess。

2. 真实所需函数（未来上线用）
onGetphonenumber：点击绿色大按钮触发。由于你没有企业 AppID，目前在真机上点击只会报“取消授权”。等你有了企业 AppID，这部分代码不需要改，直接就能用。

loginSuccess：公共核心枢纽。不管上面哪种方式登录成功，最后都会把拿到的数据交给它。由它统一负责：存 Pinia -> 提示成功 -> 跳转页面 -->

<template>
  <view class="viewport">
    <!-- 顶部 Logo -->
    <!-- 把那一大串 Base64 粘贴到 src 里 -->
    <image
      class="logo"
      src="/static/images/logo_icon.png"
      mode="aspectFit"
    ></image>

    <view class="login">
      <!-- 真实企业版按钮 -->
      <button
        class="button phone"
        open-type="getPhoneNumber"
        @getphonenumber="onGetphonenumber"
      >
        <text class="icon icon-phone"></text> 手机号快捷登录
      </button>

      <!-- 其他登录方式区域 -->
      <view class="extra">
        <view class="caption">
          <view class="line"></view>
          <text>其他登录方式</text>
          <view class="line"></view>
        </view>

        <view class="options">
          <button class="mock-btn" @tap="onGetphonenumberSimple">
            <view class="icon-circle">
              <text class="icon icon-phone"></text>
            </view>
            <text class="mock-text">模拟快捷登录</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 底部协议 -->
    <view class="tips">
      登录/注册即视为你同意《服务条款》和《小兔鲜儿隐私协议》
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #fff;
}

.viewport {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 60rpx;

  .logo {
    margin-top: 150rpx;
    width: 160rpx;
    height: 160rpx;
  }

  .login {
    width: 100%;
    margin-top: 80rpx;
    display: flex;
    flex-direction: column;
    flex: 1; /* 💡 占满剩余空间，辅助推底 */

    .button {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 44rpx;
      background-color: #27ba9b;
      color: #fff;
      font-size: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        border: none;
      }
      .icon {
        font-size: 36rpx;
        margin-right: 10rpx;
      }
    }

    .extra {
      margin-top: 100rpx;
      width: 100%;

      .caption {
        display: flex;
        align-items: center;
        width: 100%; /* 💡 确保容器占满 */
        color: #999;
        font-size: 26rpx;
        margin-bottom: 50rpx;

        /* 💡 采纳豆包建议：使用 flex: 1 自动占满两侧 */
        .line {
          flex: 1;
          height: 1px;
          background-color: #eee;
          margin: 0 20rpx;
        }
      }

      .options {
        display: flex;
        justify-content: center;

        /* 💡 采纳豆包建议：完善无背景纵向按钮样式 */
        .mock-btn {
          background-color: transparent;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: normal;
          width: auto;

          &::after {
            border: none;
          }

          .icon-circle {
            width: 80rpx;
            height: 80rpx;
            border: 1px solid #ccc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16rpx;

            .icon {
              font-size: 36rpx;
              color: #333;
            }
          }

          .mock-text {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }

  /* 💡 采纳豆包建议：margin-top: auto 强制沉底 */
  .tips {
    margin-top: auto;
    margin-bottom: 80rpx;
    text-align: center;
    font-size: 22rpx;
    color: #999;
    width: 100%;
  }
}
</style>
