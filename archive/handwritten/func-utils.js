/**
 * 手撕 08：函数工具族（柯里化 / 组合 / 只执行一次 / 缓存）
 *
 * 柯里化 curry 的两个考点：
 *  ① 参数够了就执行，不够就返回「继续收参数」的函数（fn.length 是「形参个数」，不含默认值与 rest）
 *  ② 支持一次传多个参数（add(1)(2,3) 与 add(1,2)(3) 都要能用）
 *
 * compose vs pipe：只差执行方向。compose 从右往左（数学上 f(g(x)) 的写法），pipe 从左往右（更符合阅读习惯）。
 *
 * once / memoize 共同点：都是「用闭包保存状态」的典型题，也都能接住「如何清空缓存」的追问。
 */

// 柯里化：参数累积到 fn.length 个就执行
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args)
    return (...rest) => curried.apply(this, [...args, ...rest])
  }
}

// 从右向左组合：compose(f, g)(x) === f(g(x))
function compose(...fns) {
  return function (initial) {
    return fns.reduceRight((acc, fn) => fn.call(this, acc), initial)
  }
}

// 从左向右组合：pipe(f, g)(x) === g(f(x))
function pipe(...fns) {
  return function (initial) {
    return fns.reduce((acc, fn) => fn.call(this, acc), initial)
  }
}

// 只执行一次，后续调用直接返回首次结果（含并发安全：第一次进入就置位）
function once(fn) {
  let called = false
  let result
  return function (...args) {
    if (!called) {
      called = true
      result = fn.apply(this, args)
    }
    return result
  }
}

// 缓存版：默认按第一个参数做 key，可自定义 resolver
function memoize(fn, resolver = (...args) => args[0]) {
  const cache = new Map()
  const memoized = function (...args) {
    const key = resolver(...args)
    if (cache.has(key)) return cache.get(key)
    const value = fn.apply(this, args)
    cache.set(key, value)
    return value
  }
  memoized.cache = cache // 暴露缓存，便于 clear()
  return memoized
}

module.exports = { curry, compose, pipe, once, memoize }
