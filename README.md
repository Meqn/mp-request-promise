# mp-request-promise

Promise based HTTP client for miniprogram.

基于 `promise` 的小程序网络请求库，实现拦截器、取消请求等功能，用法类似 `axios`。  
支持微信、QQ、支付宝、百度、头条、京东、360、Taro.js、Uni-App等小程序平台。



## Install

```
npm install mp-request-promise
```


## Usage

用法和 `axios` 一致, `config` 配置信息同小程序平台。


### 请求API

**请求方式别名:**
- `request(config)`
- `request(url[, config])`
- `request.get(url[, config])`
- `request.post(url[, config])`
- `request.put(url[, config])`
- `request.delete(url[, config])`
- `request.head(url[, config])`
- `request.options(url[, config])`
- `request.trace(url[, config])`
- `request.connect(url[, config])`

```js
import request from 'mp-request-promise'

// 设置通用配置
request.defaults.header['Content-Type'] = 'application/json'

// 1. get请求 
request('https://api.com')
request({ url: '', method: 'get' })
request.get('https://api.com')

// 2. post请求
request({ url: '', method: 'post', data: {} })
request.post('url', { data: {} })
```


### 新建实例

- `request.create(api[, config])`

```js
import request from 'mp-request-promise'
import Taro from '@tarojs/taro'


// 创建一个 `Taro` 平台的新对象
const instance = request.create(Taro, {
  baseURL: 'https://api.com',
  timeout: 6000,
  header: {
    'X-Request-With': 'XMLHttpRequest'
  }
})
```


### 拦截器

在请求或响应被 then 或 catch 处理前拦截它们。

```js
import request from 'mp-request-promise'

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
```

给自定义的实例添加拦截器。

```js
import request from 'mp-request-promise'

const instance = request.create()
instance.interceptors.request.use(function () {/*...*/})
```


### 取消请求

```js
import request from 'mp-request-promise'

let cancel

request.get('https://api.com/users', {
  data: { userId: 9527 },
  // 创建一个 cancel token
  cancelToken: new request.CancelToken(function(_cancel) {
    // 接收一个 cancel 函数作为参数
    cancel = _cancel
  })
})

// 取消请求
cancel()
```




