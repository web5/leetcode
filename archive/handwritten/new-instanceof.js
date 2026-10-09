/**
 * 手撕 03：手写 new / instanceof
 *
 * new 做了四件事（背下来直接用）：
 *  ① 创建一个新对象，原型指向构造函数的 prototype
 *  ② 把构造函数的 this 绑定到这个新对象（执行构造函数体）
 *  ③ 构造函数若返回对象/函数，则用它的返回值；否则用新对象
 *  ④ 返回结果
 *
 * instanceof 的原理：沿原型链向上找，看能不能碰到 Ctor.prototype。
 * 与 typeof 的分界：typeof 判断原始类型（且对 null / 数组 / 函数都不精确），instanceof 判断引用类型的构造关系。
 */

function myNew(Ctor, ...args) {
  if (typeof Ctor !== 'function') throw new TypeError('Ctor must be a function')

  const obj = Object.create(Ctor.prototype) // ① + ②
  const result = Ctor.apply(obj, args) // ②

  // ③：构造函数显式返回引用类型时以它为准（返回原始值则忽略）
  const isObjectLike = result !== null && (typeof result === 'object' || typeof result === 'function')
  return isObjectLike ? result : obj
}

function myInstanceof(obj, Ctor) {
  if (typeof Ctor !== 'function') throw new TypeError('Right-hand side of instanceof is not callable')
  // 原始值一律不是实例（null 单独挡掉，否则 getPrototypeOf 会抛）
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) return false

  const target = Ctor.prototype
  let proto = Object.getPrototypeOf(obj)

  while (proto !== null) {
    if (proto === target) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

module.exports = { myNew, myInstanceof }
