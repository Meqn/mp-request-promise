
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

// 兼容 header 和 headers
export function mergeConfig(source = {}, target = {}) {
  const config = { ...source, ...target }
  Object.keys(config).forEach(key => {
    const val = config[key]
    if (isPlainObject(val)) {
      config[key] = { ...source[key], ...target[key] }
    } else if (Array.isArray(val)) {
      config[key] = val.slice()
    }
  })
  return config
}
