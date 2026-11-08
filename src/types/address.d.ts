/** 添加/修改收货地址 请求参数 */
export type AddressParams = {
  receiver: string
  contact: string
  provinceCode: string
  cityCode: string
  countyCode: string
  address: string
  isDefault: number
}

/** 收货地址项 */
export type AddressItem = AddressParams & {
  /** 收货地址 id */
  id: string
  /** 省市区 */
  fullLocation: string
}
