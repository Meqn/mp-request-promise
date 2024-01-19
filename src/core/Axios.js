import InterceptorManager from './InterceptorManager'
import { dispatchRequest } from './adapter'
import { pluginName, defaults, methods } from '../const'
import { isPlainObject, merge, optimizeConfig, getRequest } from '../utils'

/**
 * Axios构造函数
 * @param {Object|Function} api - 请求API对象或方法
 * @param {Object} [config={}] - 配置项
 */
function Axios(api, config = {}) {
  this.api = {}
  if (typeof api === 'function') {
    this.api.request = api
  } else if (typeof api !== 'undefined' && typeof api.request === 'function') {
    this.api = api
  } else {
    this.api = getRequest()
    config = api
  }
  if (!this.api.request) {
    throw new Error(`[${pluginName}]: request API does not exist.`)
  }

  this.defaults = merge({}, defaults, config)
  // 保存拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
}

Axios.prototype.request = function(url, config = {}) {
  if (typeof url === 'string') {
    config.url = url
  }
  if (isPlainObject(url)) {
    config = merge(config, url)
  }
  config = optimizeConfig(merge({}, this.defaults, config), this.api)
  
  // 1.将请求拦截器、发送请求、响应拦截器分别追加到chains数组中
  // 2.通过Promise链式调用特性依次执行，并返回Promise结果
  const chains = [dispatchRequest.bind(this), undefined]
  let promise = Promise.resolve(config)
  
  // 遍历请求拦截器，使用 unshift 追加到chains数组头部
  this.interceptors.request.forEach(interceptor => {
    chains.unshift(interceptor.fulfilled, interceptor.rejected)
  })

  // 遍历响应拦截器，使用 push 追加到chains数组尾部
  this.interceptors.response.forEach(interceptor => {
    chains.push(interceptor.fulfilled, interceptor.rejected)
  })
  
  // 遍历chains数组
  while (chains.length) {
    promise = promise.then(chains.shift(), chains.shift())
  }
  return promise
}

// 将请求方式追加到Axios原型上
methods.forEach(type => {
  Axios.prototype[type] = function(url, config = {}) {
    return this.request(url, merge(config, { method: type.toUpperCase() }))
  }
})

export default Axios
