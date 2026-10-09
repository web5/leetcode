/**
 * 手撕 02：call / apply / bind
 *
 * 核心原理（一句话）：**函数也是对象上的属性**。
 * 把函数挂到目标对象上、以 `obj.fn()` 的形式调用，`this` 自然就指向 obj，
 * 调用完删掉这个临时属性即可——这就是 call/apply 的全部秘密。
 *
 * 三者的差别只有两处：
 *  - call(context, a, b)     逐个传参
 *  - apply(context, [a, b])  数组传参
 *  - bind(context, a)        不调用，返回一个「this 已固化」的新函数（还支持 new）
 *
 * 必须处理的边界：
 *  ① context 为 null/undefined → 指向全局对象（非严格模式语义）
 *  ② context 是原始值（数字/字符串）→ 包装成对象
 *  ③ bind 后的函数被 new 调用时，context 必须被忽略，且原型链要正确
 *  ④ 临时属性用 Symbol，避免覆盖用户已有属性
 */

const TEMP_KEY = Symbol('myCallKey')

function resolveContext(context) {
  if (context === null || context === undefined) return globalThis
  return Object(context) // 原始值包装成对象
}

Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== 'function') throw new TypeError(`${this} is not a function`)
  const ctx = resolveContext(context)
  ctx[TEMP_KEY] = this
  try {
    return ctx[TEMP_KEY](...args)
  } finally {
    delete ctx[TEMP_KEY] // 一定要清理，否则污染目标对象
  }
}

Function.prototype.myApply = function (context, args = []) {
  if (typeof this !== 'function') throw new TypeError(`${this} is not a function`)
  const ctx = resolveContext(context)
  ctx[TEMP_KEY] = this
  try {
    return ctx[TEMP_KEY](...args)
  } finally {
    delete ctx[TEMP_KEY]
  }
}

Function.prototype.myBind = function (context, ...boundArgs) {
  if (typeof this !== 'function') throw new TypeError(`${this} is not a function`)
  const target = this

  function bound(...args) {
    // new bound() 时 new.target 有值：忽略 context，走真正的构造语义
    if (new.target) return Reflect.construct(target, [...boundArgs, ...args], new.target)
    return target.apply(context, [...boundArgs, ...args])
  }

  // 让 new bound() 出来的实例 instanceof 原构造函数
  if (target.prototype) bound.prototype = target.prototype
  return bound
}

module.exports = { resolveContext }
