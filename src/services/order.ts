import { http } from '@/utils/http'
import type { OrderPreResult } from '@/types/order'
/**
 * 填写订单-获取预付订单
 */
export const getMemberOrderPreAPI = () => {
  return http<OrderPreResult>({
    method: 'GET',
    url: '/member/order/pre', // 💡 注意这里的路径不要带 T
  })
}
