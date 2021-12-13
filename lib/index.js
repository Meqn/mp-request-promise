import Axios from './axios'
import { extend, bind, mergeConfig } from './utils'
import { Defaults } from './const'

function createInstance(api, defaultConfig = {}) {
  const context = new Axios(api, defaultConfig)
  const instance = bind(Axios.prototype.request, context)

  extend(instance, Axios.prototype, context)
  extend(instance, context)

  instance.create = (api, instanceConfig) => createInstance(api, mergeConfig(defaultConfig, instanceConfig))
  return instance
}

const axios = createInstance(wx, Defaults)
axios.Axios = Axios

export default axios
