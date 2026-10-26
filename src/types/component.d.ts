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
export type XgxGuessInstance = InstanceType<typeof XgxGuess>
// src/types/component.d.ts
export interface XgxGuessInstance {
  getMore: () => void
  resetData: () => void
}
