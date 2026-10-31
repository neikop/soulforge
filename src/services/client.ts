import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import axios, { AxiosHeaders } from 'axios'
import { env } from 'config/env'
import { useAppStore } from 'store/appStore'

type RetriableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
})

function setAuthorizationHeader(request: InternalAxiosRequestConfig, accessToken: string) {
  if (typeof request.headers.set === 'function') {
    request.headers.set('Authorization', `Bearer ${accessToken}`)
    return
  }

  request.headers = AxiosHeaders.from({
    ...request.headers,
    Authorization: `Bearer ${accessToken}`,
  })
}

apiClient.interceptors.request.use((request) => {
  const accessToken = useAppStore.getState().accessToken

  if (accessToken) setAuthorizationHeader(request, accessToken)

  return request
})

apiClient.interceptors.response.use(undefined, (error: AxiosError) => {
  const request = error.config as RetriableRequest | undefined

  if (error.response?.status === 401 && request && !request._retry) {
    request._retry = true
    useAppStore.getState().resetSession()
  }

  return Promise.reject(error)
})
