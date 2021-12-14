# mp-request-promise

Promise based HTTP client for miniprogram.

基于 promise 的小程序网络请求库，用法类似axios。支持微信、QQ、支付宝、百度、头条、Taro.js、Uni-App等小程序平台。


## Features

* 🍡 Promise API，支持`finally()`
* 🍯 默认参数配置及create创建新的对象
* 🥪 拦截请求和响应
* 🍱 支持微信、QQ、支付宝、百度、头条、Taro、Uni-App等小程序平台



## Usage

### install

```
npm install mp-request-promise
```

### 1. 直接使用
> 默认基于 `微信小程序` 平台，其他平台则需要创建新对象。
```js
import request from 'mp-request-promise'

// 使用 1
request({ url, method: 'post', data })
// 使用 2
request.post(url, data, config = {})
 .then(data => {})
 .catch(err => {})
 .finally(() => {})


// 1. get请求 
request({ url: '', method: 'get' })
request.get('url')

// 2. post请求
request({ url: '', method: 'post', data: {} })
request.post('url', data, { ...config })

// 3. put请求
request({ url: '', method: 'post', data: {} })
request.put('url', data)

// 4. delete
request({ url: '', method: 'delete' })
request.delete('url')
```

### 2. 创建新对象
基于 Taro.js框架
> 微信小程序，则 `Request.create(wx, config)`
```js
// request.js

import Request from 'mp-request-promise'
import Taro from '@tarojs/taro'

// 创建新的对象
const service = Request.create(Taro, {
  // BASE_URL: '',
  // timeout: 12000
})

// request拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    const { data, statusCode } = response
    if (statusCode >= 200 && statusCode < 300) {
      return data
    } else {
      // 统一错误处理
      const errMsg = data?.message || 'Error'
      Taro.showToast({ icon: 'none', title: errMsg })
      return Promise.reject(new Error(errMsg))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
```

项目中使用
```js
import request from '../utils/request.js'

// get 请求
request({ url: '' });
// 或
request.get('url');

// post请求
request.post('url', { username: '', password: '' })
  .then(data => {
    console.log('response', data)
  })
  .catch(err => {
    console.error(err)
  })
  .finally(() => {
    this.loading = false
  })
```
