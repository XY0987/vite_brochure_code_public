// 模拟一个「很少变动」的第三方依赖，配置里会把它单独拆成 vendor chunk，
// 这样业务代码频繁改动时，vendor chunk 的哈希不变 → 用户浏览器缓存继续命中。
export function vendorHello() {
  return '来自 vendor-like 的稳定模块';
}
