// src/composables/index.ts
import type { XgxGuessInstance } from '@/types/component'
import { ref } from 'vue'

/** 猜你喜欢组合式函数 */
export const useGuessList = () => {
  // 1. 获取猜你喜欢组件实例 (必须初始化为 undefined，否则可能会有警告)
  const guessRef = ref<XgxGuessInstance>()

  // 2. 滚动触底事件：通知子组件去加载下一页数据
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }

  // 3. 返回 ref 和事件处理函数，供页面使用
  return {
    guessRef,
    onScrolltolower,
  }
}
