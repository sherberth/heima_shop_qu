import { http } from '@/utils/http'
// 👇 引入讲师定义的 GoodsResult
import type { GoodsResult } from '@/types/goods'

/**
 * 获取商品详情
 * @param id 商品id
 */
export function getGoodsByIdAPI(id: string) {
  return http<GoodsResult>({
    // 👈 使用 GoodsResult
    method: 'GET',
    url: '/goods',
    data: { id },
  })
}
