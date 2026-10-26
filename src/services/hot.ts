import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'

// 组合类型：分页参数 + 当前页面特有的 subType
type HotParams = PageParams & { subType?: string }

/**
 * 通用热门推荐类型
 * @param url 请求地址
 * @param data 请求参数
 */
// ✅ 正确写法：加 <T>，并传给 http<T>
export const getHotRecommendAPI = <T>(url: string, data?: HotParams) => {
  return http<T>({ method: 'GET', url, data })
}
