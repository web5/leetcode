/**
 * 手撕 06：事件总线 / 发布订阅 EventEmitter
 *
 * 面试常问的三个点：
 *  ① on 返回「取消订阅函数」的写法（React useEffect 里很实用）
 *  ② once 的实现：不能只在回调里 unshift，要在触发时精确移除那一条
 *  ③ emit 遍历前必须**拷贝一份**监听器数组——回调里可能 on/off，直接遍历原数组会漏执行或死循环
 *
 * 数据结构选择：Map<eventName, Array<{ fn, once }>>
 *  - 用 Set 会丢「同一个 fn 注册两次」的语义
 *  - 用对象 {} 有原型污染风险（__proto__ 之类），Map 没这个问题
 */

class EventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  on(event, fn) {
    if (typeof fn !== 'function') throw new TypeError('listener must be a function')
    const list = this.listeners.get(event)
    if (list) list.push({ fn, once: false })
    else this.listeners.set(event, [{ fn, once: false }])
    return () => this.off(event, fn) // 返回取消订阅函数
  }

  once(event, fn) {
    if (typeof fn !== 'function') throw new TypeError('listener must be a function')
    const list = this.listeners.get(event)
    if (list) list.push({ fn, once: true })
    else this.listeners.set(event, [{ fn, once: true }])
    return () => this.off(event, fn)
  }

  off(event, fn) {
    const list = this.listeners.get(event)
    if (!list) return this
    const idx = list.findIndex((item) => item.fn === fn)
    if (idx > -1) list.splice(idx, 1)
    if (list.length === 0) this.listeners.delete(event)
    return this
  }

  emit(event, ...args) {
    const list = this.listeners.get(event)
    if (!list || list.length === 0) return false

    // 拷贝再遍历：监听器内部可能增删，直接遍历原数组会踩坑
    for (const item of list.slice()) {
      if (item.once) {
        const current = this.listeners.get(event)
        if (current) {
          const idx = current.indexOf(item)
          if (idx > -1) current.splice(idx, 1)
          if (current.length === 0) this.listeners.delete(event)
        }
      }
      item.fn.apply(this, args)
    }
    return true
  }

  listenerCount(event) {
    const list = this.listeners.get(event)
    return list ? list.length : 0
  }

  removeAllListeners(event) {
    if (event === undefined) this.listeners.clear()
    else this.listeners.delete(event)
    return this
  }
}

module.exports = { EventEmitter }
