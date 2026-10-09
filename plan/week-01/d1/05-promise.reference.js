/**
 * 学习参考 · 手撕 05：手写 Promise
 *
 * 配套讲解：plan/week-01/d1/05-promise.notes.md
 * 你的作答文件：plan/week-01/d1/05-promise.js（同题的第 2、3 天副本在 week-01/d2、week-01/d3）
 * 归档参考实现：archive/handwritten/promise.js（另一种写法，可对照）
 *
 * 跑演示（看真机时序）：node plan/week-01/d1/05-promise.reference.js
 * 本文件只有实现和演示，没有断言，随便改着玩。
 *
 * 分三块读，对应计划里拆的三天：
 *   A. 三态状态机 + then（第 1 天 · 状态机）
 *   B. then 返回新 promise：链式 / 值穿透 / 抛错捕获 / 循环引用（第 2 天 · then 链）
 *   C. 静态方法 resolve / reject / all / allSettled / race / any（第 3 天 · 静态方法）
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const isThenable = (x) =>
  x !== null && (typeof x === 'object' || typeof x === 'function') && typeof x.then === 'function'

// ═══════════════════════════════════════════════════════════
// A. 第 1 层：三态状态机 + 只有一个「能跑」的 then
//    先不追求链式，只要能把「回调必须异步」这件事做对
// ═══════════════════════════════════════════════════════════
class PromiseV1 {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.callbacks = []

    const resolve = (value) => {
      if (this.state !== PENDING) return // 状态只能迁移一次，后面全部忽略
      this.state = FULFILLED
      this.value = value
      queueMicrotask(() => this.callbacks.forEach((cb) => cb.onFulfilled(value)))
    }
    const reject = (reason) => {
      if (this.state !== PENDING) return
      this.state = REJECTED
      this.value = reason
      queueMicrotask(() => this.callbacks.forEach((cb) => cb.onRejected(reason)))
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err) // 构造器里抛错 = 主动 reject，这是规范要求的
    }
  }

  then(onFulfilled, onRejected) {
    // 无论当前是什么状态，回调都必须异步执行 —— 这是最容易写错的地方
    if (this.state === FULFILLED) queueMicrotask(() => onFulfilled(this.value))
    else if (this.state === REJECTED) queueMicrotask(() => onRejected(this.value))
    else this.callbacks.push({ onFulfilled, onRejected })
    // 注意：V1 不返回新 promise，所以不能链式调用
  }
}

// ═══════════════════════════════════════════════════════════
// B + C. 完整版：状态机 + 链式 then + 静态方法
// ═══════════════════════════════════════════════════════════
class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.callbacks = [] // pending 期间攒下的 then 回调

    const resolve = (value) => this._settle(FULFILLED, value)
    const reject = (reason) => this._settle(REJECTED, reason)

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  /** 状态迁移：只能从 pending 走一次；resolve 一个 thenable 时「跟随」它 */
  _settle(state, value) {
    if (this.state !== PENDING) return

    if (state === FULFILLED && isThenable(value)) {
      // resolve 另一个 promise/thenable：把它的结果接过来（这就是 async/await 能 await 任意 thenable 的原因）
      value.then(
        (v) => this._settle(FULFILLED, v),
        (r) => this._settle(REJECTED, r)
      )
      return
    }

    this.state = state
    this.value = value
    queueMicrotask(() => {
      for (const cb of this.callbacks) this._run(cb)
      this.callbacks = []
    })
  }

  /** 执行一个 then 回调，并把结果/错误接到下一个 promise 上 */
  _run(cb) {
    const handler = this.state === FULFILLED ? cb.onFulfilled : cb.onRejected

    // 值穿透：then 没传 handler（或传的不是函数）时，沿用当前状态往下传
    if (typeof handler !== 'function') {
      if (this.state === FULFILLED) cb.resolve(this.value)
      else cb.reject(this.value)
      return
    }

    try {
      cb.resolve(handler(this.value))
    } catch (err) {
      cb.reject(err) // then 回调里抛错 → 新 promise 变 rejected（不是往外扔）
    }
  }

  then(onFulfilled, onRejected) {
    const next = new MyPromise((resolve, reject) => {
      const cb = {
        onFulfilled,
        onRejected,
        // 循环引用检查：then 回调返回自己 → 抛 TypeError（规范要求）
        resolve: (v) =>
          v === next ? reject(new TypeError('Chaining cycle detected for promise')) : resolve(v),
        reject,
      }
      if (this.state === PENDING) this.callbacks.push(cb)
      else queueMicrotask(() => this._run(cb))
    })
    return next
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    return this.then(
      (v) => MyPromise.resolve(onFinally()).then(() => v),
      (e) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw e
        })
    )
  }

  // ---------- C. 静态方法 ----------
  static resolve(value) {
    return value instanceof MyPromise ? value : new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }

  /** 全部成功才成功；结果顺序 = 入参顺序（不是完成顺序）；有一个失败就立刻失败 */
  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = [...iterable]
      if (items.length === 0) return resolve([])
      const out = new Array(items.length)
      let done = 0
      items.forEach((item, i) => {
        MyPromise.resolve(item).then((v) => {
          out[i] = v // 按下标落位，防止乱序
          done += 1
          if (done === items.length) resolve(out)
        }, reject)
      })
    })
  }

  /** 永不失败；每项都变成 { status, value | reason } */
  static allSettled(iterable) {
    return MyPromise.all(
      [...iterable].map((item) =>
        MyPromise.resolve(item).then(
          (value) => ({ status: 'fulfilled', value }),
          (reason) => ({ status: 'rejected', reason })
        )
      )
    )
  }

  /** 第一个「结算」的说了算（成功或失败都算） */
  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      for (const item of iterable) MyPromise.resolve(item).then(resolve, reject)
    })
  }

  /** 第一个「成功」的说了算；全部失败才失败（AggregateError） */
  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = [...iterable]
      if (items.length === 0) return reject(new Error('All promises were rejected'))
      let failed = 0
      items.forEach((item) => {
        MyPromise.resolve(item).then(resolve, () => {
          failed += 1
          if (failed === items.length) reject(new Error('All promises were rejected'))
        })
      })
    })
  }
}

// ═══════════════════════════════════════════════════════════
// 演示：把「时序」这件事打成可见的
// ═══════════════════════════════════════════════════════════
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function demo() {
  console.log('\n  ── ① then 回调是异步的（微任务）──')
  const trace = []
  new MyPromise((resolve) => resolve('A')).then(() => trace.push('my.then'))
  Promise.resolve('B').then(() => trace.push('native.then'))
  trace.push('sync')
  await wait(0)
  console.log(`     顺序：${trace.join('  →  ')}`)
  console.log('     （sync 一定在最前；两个 then 都排在同步代码之后）')

  console.log('\n  ── ② 链式 then 与值透传 ──')
  const chained = await new MyPromise((resolve) => resolve(1))
    .then((v) => v + 1)
    .then((v) => v * 10)
  console.log(`     1 → then(+1) → then(*10) = ${chained}`)
  const passed = await MyPromise.resolve(7).then().then((v) => v)
  console.log(`     值穿透（中间的 then 不传 handler）：${passed}`)

  console.log('\n  ── ③ 构造器里抛错 → 走 catch ──')
  const caught = await new MyPromise(() => {
    throw new Error('boom')
  }).catch((e) => `caught: ${e.message}`)
  console.log(`     ${caught}`)

  console.log('\n  ── ④ 静态方法 ──')
  console.log(`     all        → [${(await MyPromise.all([MyPromise.resolve(1), 2, Promise.resolve(3)])).join(', ')}]`)
  console.log(
    `     race       → ${await MyPromise.race([wait(60).then(() => 'slow'), MyPromise.resolve('fast')])}`
  )
  const settled = await MyPromise.allSettled([MyPromise.resolve(1), MyPromise.reject(new Error('x'))])
  console.log(`     allSettled → ${settled.map((r) => r.status).join(', ')}`)
  console.log(
    `     any        → ${await MyPromise.any([MyPromise.reject(new Error('e1')), MyPromise.resolve('first-ok')])}`
  )

  console.log('\n  ── ⑤ 循环引用会被拒绝（不是死循环）──')
  const p = MyPromise.resolve(1)
  const cyc = p.then(() => cyc)
  console.log(`     ${await cyc.catch((e) => `${e.constructor.name}: ${e.message}`)}`)

  console.log('')
}

module.exports = { MyPromise, PromiseV1, PENDING, FULFILLED, REJECTED }

if (require.main === module) demo()
