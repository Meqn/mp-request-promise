import { isPlainObject, bind, extend, merge, optimizeConfig, getRequest } from '../src/utils'

describe('isPlainObject', () => {
  test('returns true for plain object', () => {
    expect(isPlainObject({})).toBe(true)
  })

  test('returns false for non-plain object', () => {
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject('test')).toBe(false)
    expect(isPlainObject(true)).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
  })
})

describe('bind', () => {
  test('bind function returns a new function', () => {
    const originalFn = function () {}
    const boundFn = bind(originalFn, {})
    expect(boundFn).not.toBe(originalFn)
  })

  test('new function applies the context to the original function', () => {
    const context = { key: 'value' }
    const originalFn = function () {
      expect(this).toBe(context)
    }
    const boundFn = bind(originalFn, context)
    boundFn()
  })

  test('new function accepts and passes arguments to the original function', () => {
    const originalFn = jest.fn()
    const boundFn = bind(originalFn, {})
    boundFn(1, 2, 3)
    expect(originalFn).toHaveBeenCalledWith(1, 2, 3)
  })
})

describe('extend', () => {
  test('extend object properties and functions', () => {
    const target = {}
    const source = {
      name: 'John',
      age: 30,
      greet: function () {
        return 'Hello, ' + this.name
      }
    }
    const context = {
      name: 'Jane'
    }

    extend(target, source, context)

    expect(target.name).toBe('John')
    expect(target.age).toBe(30)
    expect(target.greet()).toBe('Hello, Jane')

    extend(target, source, {})
    expect(target.greet()).toBe('Hello, undefined')
  })

  test('not extend non-own properties', () => {
    // Arrange
    const target = {}
    const source = {}
    source.__proto__.prop1 = 'value1'

    // Act
    const result = extend(target, source)

    // Assert
    expect(result).toEqual({})
    expect(result.hasOwnProperty('prop1')).toBe(false)
  })
})

describe('merge', () => {
  let target
  let source1, source2
  beforeEach(() => {
    target = {
      a: {
        b: 1
      },
      d: 3
    }
    source1 = {
      a: {
        b: 2
      }
    }
    source2 = {
      a: {
        b: 2,
        c: 3
      },
      d: 4
    }
  })
  test('should merge two objects with objects', () => {
    const expectedResult = {
      a: {
        b: 2
      },
      d: 3
    }

    expect(merge(target, source1)).toEqual(expectedResult)
  })

  test('should merge multiple objects with nested objects', () => {
    const expectedResult = {
      a: {
        b: 2,
        c: 3
      },
      d: 4
    }

    expect(merge(target, source1, source2)).toEqual(expectedResult)
  })

  test('should return the target object if no source objects are provided', () => {
    const target = {
      a: 1,
      b: 2
    }

    expect(merge(target)).toBe(target)
  })

  test('should return a non-objects when target is not a object', () => {
    expect(merge(null, source1)).toBeNull()
    expect(merge(undefined, source1, source2)).toBeUndefined()
    expect(merge(0, source1, source2)).toBe(0)
    expect(merge(true, source1, source2)).toBe(true)
    expect(merge(/\w/i, source1, source2)).toBeInstanceOf(RegExp)
  })

  test('merge an object with an array property', () => {
    const target = { a: [1, 2, 3] }
    const source = { a: [5, 6] }
    expect(merge(target, source)).toEqual({ a: [5, 6, 3] })
  })
})

describe('optimizeConfig', () => {
  test('test with baseURL and relative url', () => {
    const configuration = {
      baseURL: 'https://example.com',
      url: 'api/data',
      method: 'get',
      header: { Authorization: 'Bearer token' }
    }
    const api = null
    const result = optimizeConfig(configuration, api)
    expect(result.url).toBe('https://example.com/api/data')
  })

  test('test with baseURL and absolute url', () => {
    const configuration = {
      baseURL: 'https://example.com',
      url: 'https://anotherexample.com/api/data',
      method: 'get',
      header: { Authorization: 'Bearer token' }
    }
    const api = null
    const result = optimizeConfig(configuration, api)
    expect(result.url).toBe('https://anotherexample.com/api/data')
  })

  test('test with method in lowercase', () => {
    const configuration = {
      url: 'api/data',
      method: 'post',
      header: { Authorization: 'Bearer token' }
    }
    const api = null
    const result = optimizeConfig(configuration, api)
    expect(result.method).toBe('POST')
  })

  test('test with method in uppercase', () => {
    const configuration = {
      url: 'api/data',
      method: 'POST',
      header: { Authorization: 'Bearer token' }
    }
    const api = null
    const result = optimizeConfig(configuration, api)
    expect(result.method).toBe('POST')
  })

  test('test with my API', () => {
    global.my = 'my'

    const configuration = {
      url: 'api/data',
      method: 'GET',
      header: { Authorization: 'Bearer token' }
    }
    const result = optimizeConfig(configuration, 'my')
    expect(result.headers).toEqual({ Authorization: 'Bearer token' })
    delete global.my
  })

  test('test with non-my API', () => {
    const configuration = {
      url: 'api/data',
      method: 'GET',
      header: { Authorization: 'Bearer token' }
    }
    const api = 'notMy'
    const result = optimizeConfig(configuration, api)
    expect(result.header).toEqual({ Authorization: 'Bearer token' })
  })
})

describe('getRequest', () => {
  test('getRequest returns uni for UniApp platform', () => {
    global.uni = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.uni)
    delete global.uni
  })

  test('getRequest returns Taro for Taro platform', () => {
    global.Taro = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.Taro)
    delete global.Taro
  })

  test('getRequest returns wx for WeChat platform', () => {
    global.wx = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.wx)
    delete global.wx
  })

  test('getRequest returns tt for Bytedance platform', () => {
    global.tt = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.tt)
    delete global.tt
  })

  test('getRequest returns my for Alipay platform', () => {
    global.my = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.my)
    delete global.my
  })

  test('getRequest returns qq for QQ platform', () => {
    global.qq = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.qq)
    delete global.qq
  })

  test('getRequest returns swan for Baidu platform', () => {
    global.swan = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.swan)
    delete global.swan
  })

  test('getRequest returns jd for JD platform', () => {
    global.jd = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.jd)
    delete global.jd
  })

  test('getRequest returns qh for 360 platform', () => {
    global.qh = {
      request: jest.fn()
    }
    expect(getRequest()).toEqual(global.qh)
    delete global.qh
  })
})
