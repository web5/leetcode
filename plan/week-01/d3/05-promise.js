/**
 * 手撕 05：手写 Promise · 第 3 天：静态方法
 * 三天三份文件（都在第 1 周）：D1 状态机（week-01/d1）→ D2 then 链（week-01/d2）→ D3 静态方法（本文）
 * 学习资料：见 week-01/d1/ 的 05-promise.notes.md（讲解）与 05-promise.reference.js（分层参考实现）
 * 归档参考实现（另一种写法）：archive/handwritten/promise.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记（这题拆 3 天写：状态机 → then 链 → 静态方法）──────
 * 为什么回调必须异步：____（then 注册时若立即执行，会破坏「回调晚于同步代码」的约定）
 * then 为什么返回新 Promise：____（这样才能链式）
 * 值穿透 / 循环引用报错 / thenable 处理：____
 * 自带说明：await 一个 thenable 时，原生引擎会调用它的 then —— 所以下面用 await 测你的实现
 * ─────────────────────────────────────────────────
 */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const isThenable = (x) =>
  x !== null && (typeof x === 'object' || typeof x === 'function') && typeof x.then === 'function'

/** 作答区：手写 Promise，需支持 then / catch / resolve / reject / all / race */
class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = null
    this.callbacks = []

    const resolve = (value) => this._settle(FULFILLED, value)
    const reject = (reason) => this._settle(REJECTED, reason)

    try {
      executor(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }

  _settle(state, value) {
    if(this.state !== PENDING) return
    if(state === FULFILLED && isThenable(value)) {
      value.then(
        (v) => this._settle(FULFILLED, v),
        (r) => this._settle(REJECTED, r)
      )
      return
    }

    this.state = state
    this.value = value
    queueMicrotask(() => {
      for(const cb of this.callbacks) this._run(cb)
      this.callbacks = []
    })
  }

  _run(cb) {
    const handler = this.state === FULFILLED ? cb.onFulfilled : cb.onRejected
    if(typeof handler !== 'function') {
      if(this.state === FULFILLED) cb.resolve(this.value)
      else cb.reject(this.value)
      return
    }
    try {
      cb.resolve(handler(this.value))
    } catch(err) {
      cb.reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    const next = new MyPromise((resolve, reject) => {
      const cb = {
        onFulfilled,
        onRejected,
        resolve: (v) => {
          v === next ? reject(new TypeError('Chaining cycle detected for promise')) : resolve(v)
        },
        reject
      }
      if(this.state === PENDING) this.callbacks.push(cb)
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
      (e) => MyPromise.resolve(onFinally()).then(() => {
        throw e
      })
    )
  }

  // 静态方法

  static resolve(value) {
    return value instanceof MyPromise ? value : new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }

  // 全部成功才算成功
  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = [...iterable]
      if(items.length === 0) return resolve([])
      const out = new Array(items.length)
      let done = 0
      items.forEach((item, i) => {
        MyPromise.resolve(item).then((v) => {
          out[i] = v
          done += 1
          if(done === items.length) resolve(out)
        }, reject)
      })
    })
  }

  // 永不失败
  static allSettled(iterable) {
    return MyPromise.all([...iterable].map(item=> {
      return MyPromise.resolve(item).then(
        (value)=> ({status: 'fulfilled', value}),
        (reason) => ({status: 'rejected', reason})
      )
    }))
  }

  /** 第一个「结算」的说了算（成功或失败都算） */
  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      for(const item of iterable) {
        MyPromise.resolve(item).then(resolve, reject)
      }
    })
  }

  /** 第一个「成功」的说了算；全部失败才失败（AggregateError） */
  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = [...iterable]
      if(items.length === 0) return reject(new AggregateError([], 'All promises were rejected'))
      let failed = 0
      const errors = new Array(items.length)
      items.forEach((item, i) => {
        MyPromise.resolve(item).then(resolve, (reason) => {
          errors[i] = reason
          failed += 1
          if(failed === items.length) reject(new AggregateError(errors, 'All promises were rejected'))
        })
      })
    })
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
  {
    name: '静态方法 any：第一个成功就成功（失败的被忽略）',
    run: async () => {
      const p = MyPromise.any([
        wait(50).then(() => 'slow'),
        MyPromise.reject(new Error('先失败')),
        MyPromise.resolve('fast'),
      ])
      assertEqual(await withDeadline(p), 'fast', 'any 应取第一个成功的那个')
    },
  },
  {
    // 原生语义：全部失败抛 AggregateError，且 errors 按「入参下标」排列，不是「谁先失败」
    name: '静态方法 any 全失败 → AggregateError（errors 按下标）',
    run: async () => {
      let caught = null
      try {
        await withDeadline(
          MyPromise.any([
            wait(30).then(() => { throw new Error('慢的') }), // 下标 0，最后才失败
            MyPromise.reject(new Error('快的')),              // 下标 1，立刻失败
          ])
        )
      } catch (err) {
        caught = err
      }
      assertEqual(caught instanceof AggregateError, true, 'any 全失败应抛 AggregateError')
      assertEqual(
        caught.errors.map((e) => e.message),
        ['慢的', '快的'],
        'errors 要按入参下标排列（用 push 就会变成到达顺序，这里是反的）'
      )
    },
  },
  {
    name: 'finally：不改变结论，且保留原来的 rejection 原因',
    run: async () => {
      let ran = 0
      assertEqual(
        await withDeadline(MyPromise.resolve('ok').finally(() => { ran += 1 })),
        'ok',
        'finally 不应改变 fulfilled 的值'
      )

      const reason = new Error('原原因')
      let caught = null
      try {
        await withDeadline(MyPromise.reject(reason).finally(() => { ran += 1 }))
      } catch (err) {
        caught = err
      }
      assertEqual(caught === reason, true, 'finally 之后应原样保留 rejection 原因（不是 onFinally() 的返回值）')
      assertEqual(ran, 2, 'finally 的回调在成功 / 失败两条路上都应执行')
    },
  },
  {
    name: '静态方法 allSettled：全部出结果、永不失败',
    run: async () => {
      const list = await withDeadline(
        MyPromise.allSettled([MyPromise.resolve(1), MyPromise.reject('bad'), 3])
      )
      assertEqual(
        list,
        [
          { status: 'fulfilled', value: 1 },
          { status: 'rejected', reason: 'bad' },
          { status: 'fulfilled', value: 3 },
        ],
        'allSettled 应按下标给出每项的 status/value 或 status/reason'
      )
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

// 直接跑：node plan/week-01/d3/05-promise.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 05 手写 Promise', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { MyPromise }
