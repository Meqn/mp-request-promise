
export const Defaults = {
  url: '',
  method: 'GET',
  header: {
    'content-type': 'application/json'
  },
  dataType: 'json',
  responseType: 'text'
}

export const Methods = ['get', 'post', 'put', 'delete', 'options', 'head', 'trace', 'connect']

/**
 * 网络 { `请求`: request, `上传`: uploadFile, `下载`: downloadFile }
 * 
 * 平台
 * Taro: (Taro)[http://taro-docs.jd.com/taro/docs/]
 * UniApp: (uni)[https://uniapp.dcloud.io/api/request/request]
 * 微信: (wx)[https://developers.weixin.qq.com/miniprogram/dev/api/]
 * QQ: (qq)[https://q.qq.com/wiki/develop/miniprogram/API/]
 * 支付宝: (my)[https://opendocs.alipay.com/mini/api/]
 * 百度: (swan)[https://smartprogram.baidu.com/docs/develop/api/apilist/]
 * 字节: (tt)[https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/start/introduction]
 * 京东: (jd)[https://vapp.jd.com/]
 */
export const Platform = {
  /* wechat: wx,
  taro: taro,
  qq: qq,
  alipay: my,
  baidu: swan,
  toutiao: tt,
  jd: jd */
}