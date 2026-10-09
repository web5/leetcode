/**
 * 手撕 05：手写 Promise · 第 2 天：then 链
 * 三天三份文件（都在第 1 周）：D1 状态机（week-01/d1）→ D2 then 链（本文）→ D3 静态方法（week-01/d3）
 * 学习资料：见 week-01/d1/ 的 05-promise.notes.md（讲解）与 05-promise.reference.js（分层参考实现）
 * 归档参考实现（另一种写法）：archive/handwritten/promise.js
 * 复现：一刷 10-09 提示 · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记（这题拆 3 天写：状态机 → then 链 → 静态方法）──────
 * 为什么回调必须异步：____（then 注册时若立即执行，会破坏「回调晚于同步代码」的约定）
 * then 为什么返回新 Promise：____（这样才能链式）
 * 值穿透 / 循环引用报错 / thenable 处理：____
 * 自带说明：await 一个 thenable 时，原生引擎会调用它的 then —— 所以下面用 await 测你的实现
 * ─────────────────────────────────────────────────
 */

/** 作答区：第 2 天 —— then 返回新 promise，_run 决定「值透传 / 喂给下一个 / 抛错转 reject」
 *  今天的目标：让第 2、3 个 check 变绿（静态方法留给 D3）
 */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const isThenable = (x) =>
  x !== null
  && (typeof x === 'object' || typeof x === 'function')
  && typeof x.then === 'function'

class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = null
    this.callbacks = []

    const resolve = (value) => this._settle(FULFILLED, value)
    const reject = (reason) => this._settle(REJECTED, reason)

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  _settle(state, value) {
    if (this.state !== PENDING) return
    if (state === FULFILLED && isThenable(value)) {   // 跟随 thenable（A+ 2.3）
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

  _run(cb) {
    const handler = this.state === FULFILLED ? cb.onFulfilled : cb.onRejected

    if (typeof handler !== 'function') {      // 值穿透：没给 handler 就把状态原样传下去
      if (this.state === FULFILLED) cb.resolve(this.value)
      else cb.reject(this.value)
      return
    }

    try {
      cb.resolve(handler(this.value))         // 返回值喂给下一个 promise
    } catch (err) {
      cb.reject(err)                          // 回调里抛错 → 下一个变 rejected
    }
  }

  then(onFulfilled, onRejected) {
    const next = new MyPromise((resolve, reject) => {
      const cb = {
        onFulfilled,
        onRejected,
        resolve: (v) => (v === next
          ? reject(new Error('Chaining cycle detected for promise'))   // 回调返回自己 → 报错，别递归
          : resolve(v)),
        reject,                               // ★ 之前漏了这个属性，_run 的两条路都要用
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
    // TODO(D3)：依赖静态 resolve / reject；且 onFinally() 返回非 promise 时下面会炸，等静态方法写完再修
    return this.then(
      (v) => MyPromise.resolve(onFinally()).then(() => v),
      (e) => MyPromise.reject(onFinally()).then(() => { throw e })
    )
  }
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'then 回调是异步的（晚于同步代码）',
    run: async () => {
      const order = []
      new MyPromise((resolve) => resolve(1)).then(() => order.push('then'))
      order.push('sync')
      await wait(0)
      assertEqual(order, ['sync', 'then'], 'then 回调必须在当前同步代码之后执行')
    },
  },
  {
    name: '链式 then 与值透传',
    run: async () => {
      const p = new MyPromise((resolve) => resolve(1)).then((v) => v + 1).then((v) => v * 10)
      assertEqual(await withDeadline(p), 20, '链式 then 的结果不对')
    },
  },
  {
    name: '构造函数内抛错 → 走 catch',
    run: async () => {
      const p = new MyPromise(() => { throw new Error('boom') }).catch((e) => `caught:${e.message}`)
      assertEqual(await withDeadline(p), 'caught:boom', '构造内抛错应变成 reject')
    },
  },
  {
    name: '静态方法 resolve / all（保持入参顺序）',
    run: async () => {
      assertEqual(await withDeadline(MyPromise.resolve(7)), 7, 'resolve 静态方法')
      const list = await withDeadline(MyPromise.all([MyPromise.resolve(1), 2, wait(20).then(() => 3)]))
      assertEqual(list, [1, 2, 3], 'all 的结果应按入参顺序')
    },
  },
  {
    name: '静态方法 race（取最先结算的）',
    run: async () => {
      const p = MyPromise.race([wait(80).then(() => 'slow'), MyPromise.resolve('fast')])
      assertEqual(await withDeadline(p), 'fast', 'race 应取最先结算的那个')
    },
  },
]

// ── 以下不用改 ──────────────────────────────────────────
function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) throw new Error(`${label}：期望 ${e}，实际 ${a}`)
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// 加超时护栏：实现有 bug 时不会一直挂着，而是给出可读的失败原因
function withDeadline(p, ms = 800) {
  return Promise.race([
    Promise.resolve(p),
    wait(ms).then(() => { throw new Error(`${ms}ms 内未结算（检查 then 是否被调用 / 状态是否卡住）`) }),
  ])
}

async function runAll() {
  let pass = 0
  for (const one of CHECKS) {
    try {
      await one.run()
      pass += 1
      console.log(`✅ ${one.name}`)
    } catch (err) {
      console.log(`❌ ${one.name}\n   ${err.message}`)
    }
  }
  console.log(`\n${pass}/${CHECKS.length} 通过`)
  if (pass < CHECKS.length) process.exitCode = 1
}

// 直接跑：node plan/week-01/d2/05-promise.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 05 手写 Promise', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { MyPromise }
