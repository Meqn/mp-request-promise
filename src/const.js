export const pluginName = 'mp-request-promise'

export const defaults = {
  baseURL: '',
  method: 'GET',
  header: {
    'content-type': 'application/json'
  },
  dataType: 'json',
  // responseType: 'text' //支付宝不支持
}

export const methods = ['get', 'post', 'put', 'delete', 'options', 'head', 'trace', 'connect']
