/**
 * 添加拦截器:
 *   拦截 request 请求
 *   拦截 uploadFile 文件上传
 *
 * TODO:
 *   1. 非 http 开头需拼接地址
 *   2. 请求超时
 *   3. 添加小程序端请求头标识
 *   4. 添加 token 请求头标识
 */
import { useMemberStore } from '@/stores'
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2. 请求超时, 默认 60s
    options.timeout = 10000
    //头标
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    //token头标
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    //
    console.log(options)
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 请求成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型, 支持泛型
 *  3. 请求失败
 *    3.1 网络错误 -> 提示用户换网络
 *    3.2 401错误  -> 清理用户信息, 跳转到登录页
 *    3.3 其他错误 -> 根据后端错误信息轻提示
 */
// 1. 定义后端的标准返回结构接口
interface Data<T> {
  code: string
  msg: string
  result: T
}
// 2.2 添加类型，支持泛型
// 这里的 <T> 相当于一个“占位符”，你传什么类型，它到时候就是什么类型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 Promise 对象，并规定 Promise 成功后返回的类型是 Data<T>
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 2. 请求成功
      success(res) {
        // 2.1 提取核心数据 res.data（因为 request 原本的 res 里包含了 headers、statusCode 等一堆不相关的东西）
        //res.statusCode = 401 👈 强行走 401 分支，测试完一定要删掉！
        // 并用 as 断言它为 Data<T> 类型
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode == 401) {
          //401错误则跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()

          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          //其他错误
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res) // 👈 必须加上这句，把错误抛给页面
        }
      },
      // (截图里没截全，但下面通常还需要写 fail 来 reject)
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误, 换个网络试试',
        })
        reject(err)
      },
    })
  })
}

export {}
