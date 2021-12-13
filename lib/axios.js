import { Methods } from './const'
import { isPlainObject, mergeConfig } from './utils'

Promise.prototype.finally = Promise.prototype.finally || function(callback) {
  const P = this.constructor
  return this.then(
    value => P.resolve(callback(value)).then(() => value),
    reason => P.resolve(callback(reason)).then(() => Promise.reject(reason))
  )
}

function interceptors() {
  return {
    use(resolve, reject) {
      typeof resolve === 'function' && (this.success = resolve)
      typeof reject === 'function' && (this.error = reject)
    },
    success(config) {
      return config
    },
    error(error) {
      return error
    }
  }
}

function Axios(api, config) {
  if (!api) {
    return console.error('Request: platform API is not found.')
  }
  this.API = api
  this.defaults = config
  this.interceptors = {
    request: interceptors(),
    response: interceptors()
  }
}

Axios.prototype.getRequest = function() {
  // request, uploadFile, downloadFile
}

Axios.prototype.request = function(config) {
  if (!this.API.request) {
    return console.error('Request: request API does not exist.')
  }
  const responseHandler = this.interceptors.response
  const requestHandler = this.interceptors.request
  
  try {
    config = mergeConfig(this.defaults, config)
    config.method = config.method.toLocaleUpperCase()
    
    return new Promise((resolve, reject) => {
      // response拦截器
      const responseInterceptor = {
        success(response) {
          const data = responseHandler.success(response)
          resolve(data)
        },
        fail(response) {
          const data = responseHandler.error(response)
          reject(data)
        }
      }
      config = Object.assign(config, responseInterceptor)
      
      // request拦截器
      config = requestHandler.success(config)

      // request请求
      this.API.request(config)
    })
  } catch (e) {
    // return Promise.reject(error)
    return requestHandler.error(e)
  }
}
/* 
Axios.prototype.abort = function() {
  const requestor = this.requester
  requestor && requestor.abort && requestor.abort()
}
 */
Methods.forEach(method => {
  Axios.prototype[method] = function(url, data, config = {}) {
    config = isPlainObject(url) ? mergeConfig(url, { method }) : mergeConfig(config, { method, url, data })
    return this.request(config)
  }
})

export default Axios
