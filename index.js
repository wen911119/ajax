import axios from 'axios'

const isCustomCatch = error => {
  const catchConfig = error.config.headers.catch
  if (catchConfig) {
    if (catchConfig === 'all') {
      return true
    } else {
      const status = error.response && error.response.status
      if (status) {
        const needCatchedStatusCodes = catchConfig
          .split(',')
          .map(statusCodeStr => parseInt(statusCodeStr))
        if (needCatchedStatusCodes.includes(status)) {
          return true
        }
      }
    }
  }
  return false
}

let defaultErrorHandler = error => {
  console.warn('需要自定义错误处理函数')
  console.log(error)
}

let Loading = {
  show: () => {
    console.warn('需要自定义loading.show方法')
  },
  hide: () => {
    console.warn('需要自定义loading.hide方法')
  }
}

let onRequestHandler = config => {}

axios.interceptors.request.use(config => {
  if (config.headers.loading !== 'false') {
    Loading.show()
  }
  onRequestHandler && onRequestHandler(config)
  return config
})

axios.interceptors.response.use(
  response => {
    if (response.config.headers.loading !== 'false') {
      Loading.hide()
    }
    return response.data
  },
  error => {
    if (error.config.headers.loading !== 'false') {
      Loading.hide()
    }
    if (isCustomCatch(error)) {
      // 用户希望自己处理异常
      return Promise.reject(error)
    } else {
      // 默认错误处理
      defaultErrorHandler(error)
      // 终止promise链
      return new Promise(() => {})
    }
  }
)

export default axios

export const setDefaultErrorHander = handler => (defaultErrorHandler = handler)
export const setLoadingMethod = loadingMethod => (Loading = loadingMethod)
export const setOnRequestHandler = handler => (onRequestHandler = handler)
