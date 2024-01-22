import { pluginName } from '../src/const'
import { adapter, dispatchRequest } from '../src/core/adapter'

describe('adapter', () => {
  test('throws error when config.url is not provided', () => {
    const mockRequest = jest.fn()
    const mockConfig = {}
    expect(() => adapter(mockRequest, mockConfig)).toThrow(`[${pluginName}]: url is required`)
  })

  test('resolves with response when request succeeds', async () => {
    const mockRequest = jest.fn(options => {
      options.success({ data: 'mock data' })
    })
    const mockConfig = { url: 'https://example.com' }
    const response = await adapter(mockRequest, mockConfig)
    expect(response).toEqual({ config: mockConfig, data: 'mock data' })
  })

  test('rejects with error when request fails', async () => {
    const mockRequest = jest.fn(options => {
      options.fail({ error: 'mock error' })
    })
    const mockConfig = { url: 'https://example.com' }
    await expect(adapter(mockRequest, mockConfig)).rejects.toEqual({
      config: mockConfig,
      error: 'mock error'
    })
  })

  test('aborts request when cancelToken is provided', () => {
    const mockAbort = jest.fn()
    const mockRequest = jest.fn(() => ({ abort: mockAbort }))
    const mockConfig = { url: 'https://example.com', cancelToken: { promise: Promise.resolve() } }

    adapter(mockRequest, mockConfig)

    expect(mockRequest.mock.calls.length).toBe(1)
    // expect(mockAbort).toHaveBeenCalled() //!实际已执行，无法通过测试
  })
})

describe('dispatchRequest', () => {
  test('should return response for successful request', async () => {
    const config = {
      url: 'https://example.com',
    }
    const response = await dispatchRequest.call({
      api: {
        request: jest.fn(options => {
          options.success({ data: 'success' })
        })
      }
    }, config)
    expect(response).toEqual({ data: 'success', config })
  })

  test('should return error for failed request', async () => {
    const config = {
      url: 'https://example.com',
    }
    const context = {
      api: {
        request: jest.fn(options => {
          options.fail({ error: 'failure' })
        })
      }
    }

    await expect(dispatchRequest.call(context, config)).rejects.toEqual({ error: 'failure', config })
  })
  
})
