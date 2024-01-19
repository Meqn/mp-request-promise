export default function InterceptorManager() {
  this.handlers = []
}
InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({ fulfilled, rejected })
  return this.handlers.length - 1
}
InterceptorManager.prototype.forEach = function(fn) {
  this.handlers.forEach(h => {
    if (h !== null) {
      fn(h)
    }
  })
}
