import { http } from '@/utils/http'
// 💡 1. 引入刚才定义的类型
import type { LoginResult } from '@/types/member'

// 真实登录参数类型
export type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}

/**
 * 小程序登录
 * @param data 请求参数
 */
// 💡 2. 加上 <LoginResult> 泛型
export const postLoginWxMinAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}

/**
 * 小程序登录_内测版
 * @param phoneNumber 模拟手机号码
 */
// 💡 3. 加上 <LoginResult> 泛型
export const postLoginWxMinSimpleAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}
