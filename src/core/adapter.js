import { pluginName } from '../const'
// 发送适配器请求
export function adapter(request, config) {
  if (!config.url) {
    throw new Error(`[${pluginName}]: url is required`)
  }

  const { cancelToken, ...rest } = config
  
  return new Promise((resolve, reject) => {
    const requestTask = request({
      ...rest,
      success(response) {
        // 不需要处理状态码 2xx
        resolve({ config, ...response })
      },
      fail(error) {
        // 请求发送失败，断网|取消请求|请求超时了
        reject({ config, ...error })
      }
    })
    if (cancelToken) {
      cancelToken.promise.then(function () {
        requestTask.abort()
      })
    }
  })
}

// 使用配置的适配器将请求分派到服务器。
export function dispatchRequest(config) {
  return adapter(this.api.request, config)
    .then(response => {
      return response
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
