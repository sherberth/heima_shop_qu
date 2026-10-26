<script setup lang="ts">
import { useMemberStore } from '@/stores'
import { http } from '@/utils/http'

const memberStore = useMemberStore()

const getData = async () => {
  // 直接使用 await 调用封装好的 http
  const res = await http({
    url: '/home/banner',
    method: 'GET',
    header: {},
  })

  // 在控制台打印结果
  console.log('请求成功的数据：', res)
  // 👇 真正的业务数据在 res.data 里
  console.log('核心业务数据：', res.result)
  // 现在你可以直接打印 res.result，并且 VS Code 知道它是个数组
  console.log('请求成功', res.result)
}
</script>

<template>
  <view class="my">
    <view>会员信息：{{ memberStore.profile }}</view>
    <button
      @tap="
        memberStore.setProfile({
          nickname: '黑马先锋',
          token: '123233',
        })
      "
      size="mini"
      plain
      type="primary"
    >
      保存用户信息
    </button>
    <button @tap="memberStore.clearProfile()" size="mini" plain type="warn">清理用户信息</button>
    <button @tap="getData" size="mini" plain type="default">测试请求</button>
  </view>
</template>

<style lang="scss">
//
</style>
