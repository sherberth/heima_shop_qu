/**
 * declare module '@vue/runtime-core'
 *   现调整为
 * declare module 'vue'
 */
import 'vue'
import XgxSwiper from '@/components/XgxSwiper.vue'
import XgxGuess from '@/components/XgxGuess.vue'

declare module 'vue' {
  export interface GlobalComponents {
    // 👇 把你自己写的组件名字加在这里
    XgxSwiper: typeof XgxSwiper
    XgxGuess: typeof XgxGuess
  }
}
//
// 组件实例类型

// src/types/component.d.ts
export interface XgxGuessInstance {
  getMore: () => void
  resetData: () => void
}
// 在 components.d.ts 最下面加上这个
/** SKU 选中事件对象 */
export type SkuPopupEvent = {
  _id: string
  buy_num: number
  [key: string]: any // 其他字段
}
