import { defaults } from './const'
import { extend, bind, merge } from './utils'
import CancelToken from './core/CancelToken'
import Axios from './core/Axios'

// 创建一个实例
function createInstance(api, defaultConfig = {}) {
  const context = new Axios(api, defaultConfig)
  // 绑定request到新创建的实例上
  const instance = bind(Axios.prototype.request, context)
  
  // 将实例对象原型上的方法 扩展到 request()上, 比如 get/post 等
  extend(instance, Axios.prototype, context)
  // 将实例对象本身属性 扩展到 request()上, 比如 defaults, 拦截器 等
  extend(instance, context)
  
  instance.create = (api, instanceConfig) => createInstance(api, merge(defaultConfig, instanceConfig))
  return instance
}

const request = createInstance(defaults)
request.Request = Axios
request.CancelToken = CancelToken
request.default = request

export { request as default, request, createInstance, CancelToken, Axios as MpRequest }
