/**
 * 手撕 04：深拷贝
 *
 * 面试注意：不要一上来就 `JSON.parse(JSON.stringify(obj))`——主动指出它的四个硬伤，
 * 再给出完整实现，这是拿分点：
 *  ① undefined / 函数 / Symbol 会被丢掉
 *  ② Date 变字符串、RegExp 变空对象 {}
 *  ③ 循环引用直接抛错
 *  ④ 无法处理 Map / Set / BigInt
 *
 * 完整实现的三条主线：
 *  ① 原始值直接返回（typeof !== 'object' 或为 null）
 *  ② 特殊内置类型单独处理：Date / RegExp / Map / Set
 *  ③ 循环引用靠 WeakMap 记忆（键是原对象，值是拷贝对象，且必须**先登记再递归**）
 *
 * 进阶可提：不可枚举属性 / 原型链（Object.create(getPrototypeOf)）/ 属性描述符（getOwnPropertyDescriptor）
 */

function deepClone(value, seen = new WeakMap()) {
  // ① 原始值、函数、Symbol：原样返回（函数一般按引用共享）
  if (value === null || typeof value !== 'object') return value
  if (seen.has(value)) return seen.get(value)

  // ② 内置对象
  if (value instanceof Date) return new Date(value.getTime())
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)

  if (value instanceof Map) {
    const copy = new Map()
    seen.set(value, copy) // 先登记，才能处理「自己引用自己」
    for (const [k, v] of value) copy.set(deepClone(k, seen), deepClone(v, seen))
    return copy
  }

  if (value instanceof Set) {
    const copy = new Set()
    seen.set(value, copy)
    for (const v of value) copy.add(deepClone(v, seen))
    return copy
  }

  // ③ 数组保留数组形态，其余对象保留原型（class 实例拷贝后仍是同类实例）
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, copy)

  for (const key of Reflect.ownKeys(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, key)
    if (!desc || !desc.enumerable) continue // 只拷可枚举自有属性（含 Symbol 键）
    copy[key] = deepClone(value[key], seen)
  }

  return copy
}

module.exports = { deepClone }
