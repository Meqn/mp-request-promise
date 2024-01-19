// 创建一个取消请求的token
export default function CancelToken(execute) {
  let cancel;
  this.promise = new Promise(resolve => {
    cancel = resolve
  })
  // 执行传入的execute函数，该函数会在适当的时候调用cancel函数，以改变Promise的状态
  execute(() => {
    cancel()
  })
}
