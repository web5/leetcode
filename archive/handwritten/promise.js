/**
 * 手撕 05：手写 Promise（then 链 + 静态方法）
 *
 * 面试考的是「三个必须说清的状态机细节」：
 *  ① 状态只能 pending → fulfilled / rejected，且**单向不可逆**（所以 resolve/reject 里先判 state）
 *  ② then 的回调必须**异步执行**（A+ 规定用微任务，这里用 queueMicrotask），否则输出顺序会错
 *  ③ then 返回**新 Promise**，实现链式调用；返回值 x 要走「Promise 解析过程」resolvePromise
 *
 * resolvePromise（A+ 条款 2.3）要处理的四种情况：
 *  ① x === promise2 → 抛 TypeError（自己等自己，死循环）
 *  ② x 是 Promise → 直接把它的状态透传（x.then(resolve, reject)）
 *  ③ x 是 thenable（有 then 函数）→ 用 called 标志位防「既 resolve 又 reject」
 *  ④ 其它 → 直接 resolve(x)
 *
 * 复杂度：空间 O(1) / 每个实例（回调队列长度）；时间 O(1) / 每次状态流转
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('Chaining cycle detected for promise'))

  if (x instanceof MyPromise) {
    x.then(resolve, reject)
    return
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then
    try {
      then = x.then
    } catch (err) {
      return reject(err)
    }
    if (typeof then === 'function') {
      let called = false
      try {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (err) {
        if (!called) reject(err)
      }
      return
    }
  }

  resolve(x)
}

class MyPromise {
  constructor(executor) {
    if (typeof executor !== 'function') throw new TypeError('executor must be a function')

    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.fulfilledQueue = []
    this.rejectedQueue = []

    const resolve = (value) => {
      if (this.state !== PENDING) return // 状态不可逆
      this.state = FULFILLED
      this.value = value
      this.fulfilledQueue.forEach((fn) => fn())
      this.fulfilledQueue = []
      this.rejectedQueue = []
    }

    const reject = (reason) => {
      if (this.state !== PENDING) return
      this.state = REJECTED
      this.reason = reason
      this.rejectedQueue.forEach((fn) => fn())
      this.fulfilledQueue = []
      this.rejectedQueue = []
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err) // executor 里同步抛错 → 变成 rejected
    }
  }

  then(onFulfilled, onRejected) {
    // 透传：非函数参数被忽略（这就是 catch 能穿过链的原因）
    const fulfilledHandler = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
    const rejectedHandler =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e
          }

    const promise2 = new MyPromise((resolve, reject) => {
      const runFulfilled = () =>
        queueMicrotask(() => {
          try {
            resolvePromise(promise2, fulfilledHandler(this.value), resolve, reject)
          } catch (err) {
            reject(err)
          }
        })

      const runRejected = () =>
        queueMicrotask(() => {
          try {
            resolvePromise(promise2, rejectedHandler(this.reason), resolve, reject)
          } catch (err) {
            reject(err)
          }
        })

      if (this.state === FULFILLED) runFulfilled()
      else if (this.state === REJECTED) runRejected()
      else {
        this.fulfilledQueue.push(runFulfilled)
        this.rejectedQueue.push(runRejected)
      }
    })

    return promise2
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason
        })
    )
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }

  // 全成功才成功；任一失败立刻失败；空数组立刻成功
  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(iterable)
      if (items.length === 0) return resolve([])
      const results = new Array(items.length)
      let settled = 0
      items.forEach((item, i) => {
        MyPromise.resolve(item).then((value) => {
          results[i] = value // 按顺序落位，不是完成顺序
          settled++
          if (settled === items.length) resolve(results)
        }, reject)
      })
    })
  }

  static allSettled(iterable) {
    return MyPromise.all(
      Array.from(iterable).map((item) =>
        MyPromise.resolve(item).then(
          (value) => ({ status: 'fulfilled', value }),
          (reason) => ({ status: 'rejected', reason })
        )
      )
    )
  }

  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      for (const item of Array.from(iterable)) MyPromise.resolve(item).then(resolve, reject)
    })
  }

  // 有一个成功就成功；全部失败才失败（AggregateError）
  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(iterable)
      if (items.length === 0) return reject(new Error('All promises were rejected'))
      const errors = new Array(items.length)
      let rejected = 0
      items.forEach((item, i) => {
        MyPromise.resolve(item).then(resolve, (reason) => {
          errors[i] = reason
          rejected++
          if (rejected === items.length) reject(new Error('All promises were rejected'))
        })
      })
    })
  }
}

module.exports = { MyPromise, PENDING, FULFILLED, REJECTED }
