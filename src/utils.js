export function isObject(arg) {
  return null !== arg && typeof arg === 'object'
}

export function isPlainObject(arg) {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

export function bind(fn, context) {
  return function wrap(...args) {
    return fn.apply(context, args)
  }
}

export function extend(t, o, c) {
  for(let key in o) {
    if (Object.prototype.hasOwnProperty.call(o, key)) {
      if (typeof o[key] === 'function') {
        t[key] = bind(o[key], c)
      } else {
        t[key] = o[key]
      }
    }
  }
  return t
}

// 合并对象
export function merge(target, ...sources) {
  if (isObject(target)) {
    for (const source of sources) {
      if (isObject(source)) {
        Object.keys(source).forEach(key => {
          if (isObject(source[key])) {
            // 如果目标对象的相应属性也是对象，则递归合并
            if (isObject(target[key])) {
              target[key] = merge(target[key], source[key])
            } else {
              // 否则直接赋值
              // !注: 这里是浅拷贝，某些情况下会有问题
              target[key] = Array.isArray(source[key]) ? [...source[key]] : { ...source[key] }
            }
          } else {
            // 非对象属性直接赋值
            target[key] = source[key]
          }
        })
      }
    }
  }

  return target
}

// 处理配置项 (过滤掉多余属性)
export function optimizeConfig(configuration, api) {
  const { baseURL, url, header, headers, ...config } = configuration
  
  if (baseURL && !url.startsWith('http') && !url.startsWith('/')) {
    config.url = `${baseURL}/${url}`
  } else {
    config.url = url
  }

  config.method = (config.method || 'GET').toUpperCase()

  // 支付宝小程序仅支持 headers
  if (typeof my !== 'undefined' && api === my) {
    config.headers = headers || header
  } else {
    config.header = header || headers
  }
  
  return config
}

/**
 * 获取对应平台的 request
 * 网络 { `请求`: request, `上传`: uploadFile, `下载`: downloadFile }
 * 
 * 平台
 * Taro: (Taro)[https://taro-docs.jd.com/docs/]
 * UniApp: (uni)[https://uniapp.dcloud.net.cn/api/]
 * 微信: (wx)[https://developers.weixin.qq.com/miniprogram/dev/api/]
 * QQ: (qq)[https://q.qq.com/wiki/develop/miniprogram/API/]
 * 支付宝: (my)[https://opendocs.alipay.com/mini/api/]
 * 百度: (swan)[https://smartprogram.baidu.com/docs/develop/api/apilist/]
 * 头条: (tt)[https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/start/introduction]
 * 京东: (jd)[https://vapp.jd.com/]
 * 360: (qh)[https://mp.360.cn/doc/miniprogram/dev]
 */
export function getRequest() {
  if (typeof uni !== 'undefined' && typeof uni.request === 'function') {
    return uni
  } else if (typeof Taro !== 'undefined' && typeof Taro.request === 'function') {
    return Taro
  } else if (typeof wx !== 'undefined' && typeof wx.request === 'function') {
    return wx
  } else if (typeof tt !== 'undefined' && typeof tt.request === 'function') {
    return tt
  } else if (typeof my !== 'undefined' && typeof my.request === 'function') {
    return my
  } else if (typeof qq !== 'undefined' && typeof qq.request === 'function') {
    return qq
  } else if (typeof swan !== 'undefined' && typeof swan.request === 'function') {
    return swan
  } else if (typeof jd !== 'undefined' && typeof jd.request === 'function') {
    return jd
  } else if (typeof qh !== 'undefined' && typeof qh.request === 'function') {
    return qh
  }
}
