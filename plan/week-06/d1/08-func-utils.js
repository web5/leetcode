/**
 * 手撕 08：柯里化 / 组合 / once / memoize
 * 参考实现（写完再对照）：archive/handwritten/func-utils.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * curry 靠什么判断「参数够了」：____（fn.length，注意默认参数与剩余参数会让 length 失真）
 * memoize 的缓存 key 怎么定：____（单参数最简单；多参数要 join 或 Map 嵌套）
 * once 的返回值语义：____（后续调用返回首次的结果）
 * 组合函数的 this 怎么处理：____
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：curry —— 分步收集参数，凑够 fn.length 个才执行 */
function curry(fn) {
  throw new Error('08 curry 未作答')
}

/** 作答区 2：compose —— 从右往左组合 */
function compose(...fns) {
  throw new Error('08 compose 未作答')
}

/** 作答区 3：pipe —— 从左往右组合 */
function pipe(...fns) {
  throw new Error('08 pipe 未作答')
}

/** 作答区 4：once —— 只真正执行一次，后续返回首次结果 */
function once(fn) {
  throw new Error('08 once 未作答')
}

/** 作答区 5：memoize —— 按参数缓存结果 */
function memoize(fn) {
  throw new Error('08 memoize 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'curry：逐参调用与部分参数都能收口',
    run: async () => {
      const add3 = curry((a, b, c) => a + b + c)
      assertEqual(add3(1)(2)(3), 6, '逐参调用')
      assertEqual(add3(1, 2)(3), 6, '部分参数一次给')
    },
  },
  {
    name: 'compose 从右到左 / pipe 从左到右',
    run: async () => {
      const inc = (x) => x + 1
      const dbl = (x) => x * 2
      assertEqual(compose(dbl, inc)(3), 8, 'compose 应先 inc(3)=4 再 dbl=8')
      assertEqual(pipe(inc, dbl)(3), 8, 'pipe 应先 inc(3)=4 再 dbl=8')
    },
  },
  {
    name: 'once：只执行一次且返回首次结果',
    run: async () => {
      let n = 0
      const f = once(() => { n += 1; return n })
      assertEqual([f(), f()], [1, 1], '应缓存首次结果')
      assertEqual(n, 1, `实际执行了 ${n} 次，应为 1 次`)
    },
  },
  {
    name: 'memoize：相同入参命中缓存，不重复计算',
    run: async () => {
      let calls = 0
      const slow = memoize((x) => { calls += 1; return x * 2 })
      assertEqual([slow(2), slow(2), slow(3), slow(2)], [4, 4, 6, 4], '结果不对')
      assertEqual(calls, 2, `实际计算 ${calls} 次，应为 2 次（2 与 3 各一次）`)
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

// 直接跑：node plan/week-06/d1/08-func-utils.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 08 函数工具', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { curry, compose, pipe, once, memoize }
