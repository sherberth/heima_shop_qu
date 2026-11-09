import type { DefineComponent } from 'vue'
import type { SkuPopupInstanceType } from './sku-popup' // 忽略这行，直接看下面的完整代码

// ================= 完整的 SKU 弹窗类型定义 =================

/** SKU 弹出层属性 */
export type SkuPopupProps = {
  /** 双向绑定，true 为打开组件，false 为关闭组件 */
  modelValue: boolean
  /** 商品信息本地数据源 */
  localdata: SkuPopupLocaldata
  /** 按钮模式 1: 都显示 2: 只显示购物车 3: 只显示立即购买 */
  mode?: 1 | 2 | 3
  /** 该商品已抢完时的按钮文字 */
  noStockText?: string
  /** 库存文字 */
  stockText?: string
  /** 点击遮罩是否关闭组件 */
  maskCloseAble?: boolean
  /** 顶部圆角值 */
  borderRadius?: string | number
  /** 最小购买数量 */
  minBuyNum?: number
  /** 最大购买数量 */
  maxBuyNum?: number
  /** 每次点击后的数量 */
  stepBuyNum?: number
  /** 是否显示“加入购物车”按钮 */
  showAddCart?: boolean
  /** 是否显示“立即购买”按钮 */
  showBuyNow?: boolean
  /** 自定义主题色 */
  theme?: string
  /** 是否显示库存 */
  showStock?: boolean
  /** 是否显示价格 */
  showPrice?: boolean
  /** 是否显示缩略图 */
  showThumb?: boolean
  /** 规格键名称，如“规格” */
  specKeyName?: string
}

/** SKU 弹出层本地数据源 */
export type SkuPopupLocaldata = {
  /** 商品 ID */
  _id: string
  /** 商品名称 */
  name: string
  /** 商品缩略图 */
  goods_thumb: string
  /** 商品规格列表 */
  spec_list: {
    name: string
    list: {
      name: string
    }[]
  }[]
  /** 商品 SKU 库存列表 */
  sku_list: SkuPopupSkuItem[]
}

/** SKU 组件信息 */
export type SkuPopupSkuItem = {
  /** SKU ID */
  _id: string
  /** 商品 ID */
  goods_id: string
  /** 商品名称 */
  goods_name: string
  /** 商品图片 */
  image: string
  /** SKU 价格 * 100, 注意: 需要乘以 100 */
  price: number
  /** SKU 规格组成, 注意: 需要与 spec_list 数组顺序对应 */
  sku_name_arr: string[]
  /** SKU 库存 */
  stock: number
}

/** 当前选择的 sku 数据 */
export type SkuPopupEvent = SkuPopupSkuItem & {
  /** 商品购买数量 */
  buy_num: number
}

/** SKU 弹出层实例 */
export type SkuPopup = Component<SkuPopupProps> & {
  open: () => void
  close: () => void
  setSku: (skuId: string) => void
}

/** 全局组件类型声明 */
declare module 'vue' {
  export interface GlobalComponents {
    'vk-data-goods-sku-popup': SkuPopup
  }
}
