import MpRequest from './request'
import { extend, bind, mergeConfig } from './utils'
import { Defaults } from './const'

function createInstance(api, defaultConfig = {}) {
  const context = new MpRequest(api, defaultConfig)
  const instance = bind(MpRequest.prototype.request, context)

  extend(instance, MpRequest.prototype, context)
  extend(instance, context)

  instance.create = (api, instanceConfig) => createInstance(api, mergeConfig(defaultConfig, instanceConfig))
  return instance
}

const request = createInstance(wx, Defaults)
request.Request = MpRequest

export default request
