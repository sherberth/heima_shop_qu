import type { GoodsItem } from './global'

/** 详情属性 */
export type DetailProperty = {
  name: string
  value: string
}

/** 商品详情（属性 + 详情图片） */
export type Details = {
  properties: DetailProperty[]
  pictures: string[]
}

/** SKU 信息 */
export type SkuItem = any
/** 规格信息 */
export type SpecItem = any

/** 地址信息 */
export type UserAddressItem = {
  address: string
  cityCode: string
  countyCode: string
  fullLocation: string
  id: string
  isDefault: number
  provinceCode: string
}

/** 商品信息 (完全按照讲师PPT) */
export type GoodsResult = {
  /** id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品描述 */
  desc: string
  /** 当前价格 */
  price: number
  /** 原价 */
  oldPrice: number
  /** 商品详情：包含详情属性 + 详情图片 */
  details: Details
  /** 主图图片集合[ 主图图片链接 ] */
  mainPictures: string[]
  /** 同类商品[ 商品信息 ] */
  similarProducts: GoodsItem[]
  /** sku集合[ sku信息 ] */
  skus: SkuItem[]
  /** 可选规格集合备注[ 可选规格信息 ] */
  specs: SpecItem[]
  /** 用户地址列表[ 地址信息 ] */
  userAddresses: UserAddressItem[]
}
