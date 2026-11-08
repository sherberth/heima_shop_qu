import { http } from '@/utils/http'
import type { ProfileDetail } from '@/types/member'

/**
 * 获取个人信息
 */
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
  })
}

export type ProfileParams = {
  nickname?: string
  gender?: string
  birthday?: string
  profession?: string
  provinceCode?: string
  cityCode?: string
  countyCode?: string
}
export const putMemberProfileAPI = (data: ProfileParams) => {
  return http({
    method: 'PUT',
    url: '/member/profile',
    data,
  })
}
