/**
 * 手撕 05：手写 Promise（A+ 核心 + 静态方法）· 第 1 天：状态机
 * 三天三份文件（都在第 1 周）：D1 状态机（本文）→ D2 then 链（week-01/d2/05-promise.js）→ D3 静态方法（week-01/d3/05-promise.js）
 * 学习资料（同目录）：05-promise.notes.md（讲解）· 05-promise.reference.js（分层参考实现 + 真机时序演示）
 * 归档参考实现（另一种写法）：archive/handwritten/promise.js
 * 复现：一刷 10-08 提示 · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记（这题拆 3 天写：状态机 → then 链 → 静态方法）──────
 * 为什么回调必须异步：____（then 注册时若立即执行，会破坏「回调晚于同步代码」的约定）
 * then 为什么返回新 Promise：____（这样才能链式）
 * 值穿透 / 循环引用报错 / thenable 处理：____
 * 自带说明：await 一个 thenable 时，原生引擎会调用它的 then —— 所以下面用 await 测你的实现
 * ─────────────────────────────────────────────────
 */

/** 作答区：第 1 天只做状态机 —— 三态 + 状态只迁移一次 + 回调进微任务
 *  今天的目标：让第 1 个 check 变绿（then 返回新 promise 留给 D2，静态方法留给 D3）
 */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

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
      reject(err)   // 构造器里抛错 = 主动 reject（规范要求，不是可选行为）
    }
  }

  _settle(state, value) {
    if (this.state !== PENDING) return   // ★ 状态只能迁移一次，先到先得
    this.state = state
    this.value = value
    queueMicrotask(() => {
      for (const cb of this.callbacks) {
        const handler = state === FULFILLED ? cb.onFulfilled : cb.onRejected
        if (typeof handler === 'function') handler(value)
      }
      this.callbacks = []
    })
  }

  then(onFulfilled, onRejected) {
    // 第 1 天就写这么土：两条路各自「排个微任务」，链式的活儿留到 D2
    if (this.state === FULFILLED) queueMicrotask(() => onFulfilled(this.value))
    else if (this.state === REJECTED) queueMicrotask(() => onRejected(this.value))
    else this.callbacks.push({ onFulfilled, onRejected })
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
      console.log("🚀 ~ order1:", order)
      await wait(0)
      console.log("🚀 ~ order2:", order)
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

// 加两道护栏：
//   ① 返回值护栏 —— then / catch / 静态方法忘了 return 时，直接说清原因，
//      而不是让断言报「期望 A，实际 undefined」这种看不懂的错
//   ② 超时护栏   —— 状态卡住时不会一直挂着，而是给出可读的失败原因
function withDeadline(p, ms = 800) {
  if (p === null || p === undefined || typeof p.then !== 'function') {
    return Promise.reject(
      new Error(
        `withDeadline 收到 ${String(p)}：then / catch / 静态方法必须返回一个新的 Promise（第 2 层），否则拿不到链式结果`
      )
    )
  }
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

// 直接跑：node plan/week-01/d1/05-promise.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 05 手写 Promise', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { MyPromise }
