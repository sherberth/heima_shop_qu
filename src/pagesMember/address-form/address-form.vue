<script setup lang="ts">
import { ref } from 'vue'
import {
  getMemberAddressByIDAPI,
  postMemberAddressAPI,
  putMemberAddressByIDAPI,
} from '@/services/address'
import { onLoad } from '@dcloudio/uni-app'
// 表单数据 (完全按照讲师截图定义)
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})
const rules: UniHelper.UniFormsRules = {
  receiver: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
  fullLocation: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请填写详细地址' }],
  },
}

// 表单组件实例 (用于调用校验方法)
const formRef = ref<UniHelper.UniFormsInstance>()
// 获取页面参数 (用 defineProps 接收 url 里的 id)
const query = defineProps<{
  id?: string
}>()

// // 动态设置标题 (有 id 说明是修改，没有 id 说明是新建)
// uni.setNavigationBarTitle({
//   title: query.id ? '修改地址' : '新建地址',
// 页面加载时触发
// onLoad(async () => {
//   // 动态设置标题
//   uni.setNavigationBarTitle({
//     title: query.id ? '修改地址' : '新建地址',
//   })

//   // 💡 核心逻辑：如果存在 id，说明是修改地址，需要回显数据
//   if (query.id) {
//     const res = await getMemberAddressByIDAPI(query.id)

//     // 把后端返回的数据直接赋值给 form 即可（字段完全对应）
//     // 使用了 Object.assign 进行合并，保证所有字段都被覆盖
//     Object.assign(form.value, res.result)
//   }
// })
// 获取收货地址详情数据
const getMemberAddressByIdData = async () => {
  const id = query.id
  if (id) {
    // 1. 发送请求获取详情
    const res = await getMemberAddressByIDAPI(id)

    // 2. 💡 将获取到的详情数据赋值给表单，实现回显
    Object.assign(form.value, res.result)
  }
}

// 页面加载
onLoad(() => {
  uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })
  getMemberAddressByIdData()
})

// 所在地区选择事件
const onRegionChange: UniHelper.RegionPickerOnChange = (ev) => {
  // 💡 讲师图5的 console.log(ev.detail)
  //console.log('地区选择器返回值：', ev.detail)

  form.value.fullLocation = ev.detail.value.join(' ')
  const [provinceCode, cityCode, countyCode] = ev.detail.code!
  Object.assign(form.value, { provinceCode, cityCode, countyCode })
}

// 默认地址 Switch 切换事件
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  // switch 返回的是 boolean，后端通常需要 1 或 0
  form.value.isDefault = ev.detail.value ? 1 : 0
}

// 提交保存（暂时留空，等讲师后续讲接口）
// 提交表单
// 提交表单
const onSubmit = async () => {
  // 1. 简单校验（非常有必要，防止空数据提交）
  //   if (!form.value.receiver) return uni.showToast({ title: '请填写收货人', icon: 'none' })
  //   if (!form.value.contact) return uni.showToast({ title: '请填写手机号', icon: 'none' })
  //   if (!form.value.fullLocation) return uni.showToast({ title: '请选择所在地区', icon: 'none' })
  //   if (!form.value.address) return uni.showToast({ title: '请填写详细地址', icon: 'none' })

  try {
    await formRef.value?.validate?.()
    // 修复：把前端展示的 fullLocation 剔除掉，只传后端需要的字段
    const { fullLocation, ...submitData } = form.value
    uni.showLoading({ title: '保存中...' })
    if (query.id) {
      // TODO: 等讲师封装修改接口后解开这里
      await putMemberAddressByIDAPI(query.id, submitData)
      //console.log('准备修改，ID:', query.id)
    } else {
      // 3. 发送新建请求
      await postMemberAddressAPI(submitData)
    }

    uni.hideLoading()
    uni.showToast({ icon: 'success', title: '保存成功' })

    // 4. 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error: any) {
    uni.hideLoading()
    // 💡 打印出详细的报错信息，方便排查
    console.error('【保存失败详细报错】：', error)
    uni.showToast({ icon: 'error', title: '保存失败' })
  }
}
</script>

<template>
  <view class="content">
    <!-- 💡 引入 uni-forms 组件 -->
    <uni-forms :rules="rules" :model="form" ref="formRef">
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input
          class="input"
          type="text"
          placeholder="请填写收货人姓名"
          v-model="form.receiver"
        />
      </uni-forms-item>

      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          type="number"
          placeholder="请填写收货人手机号码"
          v-model="form.contact"
        />
      </uni-forms-item>

      <uni-forms-item name="fullLocation" class="form-item">
        <text class="label">所在地区</text>
        <picker
          @change="onRegionChange"
          class="picker"
          mode="region"
          :value="form.fullLocation.split(' ')"
        >
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>

      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input
          class="input"
          placeholder="街道、楼牌号等信息"
          v-model="form.address"
        />
      </uni-forms-item>

      <!-- 默认地址 -->
      <view class="form-item">
        <text class="label">设为默认地址</text>
        <switch
          class="switch"
          color="#27ba9b"
          :checked="form.isDefault === 1"
          @change="onSwitchChange"
        />
      </view>
    </uni-forms>

    <!-- 提交按钮 -->
    <button class="button" @tap="onSubmit">保存地址</button>

    <!-- 调试数据 -->
    <view class="debug-data">
      {{ form }}
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}
.viewport {
  padding-bottom: 50rpx;
}
// .content {
//   margin: 20rpx 20rpx 0;
//   padding: 0 20rpx;
//   border-radius: 10rpx;
//   background-color: #fff;

//   .form-item {
//     position: relative;
//     display: flex;
//     height: 100rpx;
//     line-height: 100rpx;
//     padding: 0 10rpx;
//     border-bottom: 1rpx solid #eee;

//     &:last-child {
//       border-bottom: none;
//     }

//     .label {
//       width: 180rpx;
//       font-size: 28rpx;
//       color: #333;
//     }

//     .input {
//       flex: 1;
//       height: 100%;
//       font-size: 28rpx;
//     }

//     .picker {
//       flex: 1;
//       font-size: 28rpx;
//     }

//     .placeholder {
//       color: #808080;
//     }

//     .switch {
//       position: absolute;
//       right: 10rpx; /* 稍微往左靠一点 */
//       top: 25rpx; /* 垂直居中 */
//       transform: scale(0.8);
//     }
//   }
// }
.content {
  /* 移除之前的 padding/margin，因为现在外面包裹了 uni-forms */
  padding-top: 20rpx;
}

/* 覆盖 uni-forms-item 默认的样式 */
.form-item {
  display: flex;
  align-items: center;
  height: 100rpx;
  padding: 0 30rpx !important; /* 强制覆盖 */
  background-color: #fff;
  border-bottom: 1rpx solid #eee;

  /* uni-forms-item 内部默认的 label 容器可能占空间，需要调整 */
  :deep(.uni-forms-item__content) {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .label {
    width: 180rpx;
    font-size: 28rpx;
    color: #333;
  }

  .input {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
  }

  .picker {
    flex: 1;
    font-size: 28rpx;
  }

  .placeholder {
    color: #808080;
  }

  .switch {
    position: absolute;
    right: 20rpx;
    transform: scale(0.8);
  }
}

/* 最后一个 item 去除底边框 */
:deep(.uni-forms-item:last-child) {
  border-bottom: none;
}
/* 提交按钮 */
.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
  line-height: 80rpx;

  &::after {
    border: none;
  }
}

/* 调试数据显示区域 */
.debug-data {
  padding: 20rpx;
  font-size: 24rpx;
  color: #666;
  word-break: break-all;
}
</style>
