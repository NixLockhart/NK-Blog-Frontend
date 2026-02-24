import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { Result } from '@/types'
import { API_BASE_URL } from '@/config/env'

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加token等请求头
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const res = response.data

    // 检查响应状态码
    if (res.code === 200) {
      return res.data
    } else {
      console.error('接口错误:', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  (error) => {
    console.error('网络错误:', error.message)

    // 处理不同的HTTP状态码
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          console.error('未授权,请登录')
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`请求失败: ${status}`)
      }
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export default {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config)
  },

  upload<T = any>(url: string, formData: FormData): Promise<T> {
    return instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
