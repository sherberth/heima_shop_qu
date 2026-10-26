import XgxSwiper from './XgxSwiper.vue'
import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XgxSwiper: typeof XgxSwiper
    CustomNavbar: typeof CustomNavbar
  }
}
export type XgxGuessInstance = InstanceType<typeof XgxGuess>
