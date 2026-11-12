import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AddressItem } from '@/types/address'

export const useAddressStore = defineStore('address', () => {
  // 用户选中的地址
  const selectedAddress = ref<AddressItem>()

  // 修改选中的地址
  const changeSelectedAddress = (val: AddressItem) => {
    selectedAddress.value = val
  }

  return {
    selectedAddress,
    changeSelectedAddress,
  }
})
