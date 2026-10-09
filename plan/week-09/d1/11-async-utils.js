/**
 * 手撕 11：异步工具族（sleep / retry / withTimeout / 串行 / 并行）
 * 参考实现（写完再对照）：archive/handwritten/async-utils.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * retry 的指数退避怎么写：____（delay * 2 ** attempt，再考虑加抖动 jitter）
 * withTimeout 超时后原 Promise 会怎样：____（不会被取消，只是我们不再等它——所以要提 AbortController）
 * 串行 vs 并行：____（for await 是串行；Promise.all 是并行）
 * 幂等与重试次数的边界：____
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：sleep(ms) → Promise */
function sleep(ms) {
  throw new Error('11 sleep 未作答')
}

/**
 * 作答区 2：retry —— 失败重试
 * @param {() => Promise<any>} fn 要执行的任务
 * @param {number} retries 重试次数（总尝试次数 = 1 + retries）
 * @param {number} delay 每次重试前的等待毫秒
 * @returns {Promise<any>} 成功则返回结果；全部失败则抛出**最后一次**的错误
 */
function retry(fn, retries, delay) {
  throw new Error('11 retry 未作答')
}

/** 作答区 3：withTimeout(promise, ms) —— 超时抛错 */
function withTimeout(promise, ms) {
  throw new Error('11 withTimeout 未作答')
}

/** 作答区 4：asyncSeries(items, worker) —— 严格串行，返回结果数组（按入参顺序） */
function asyncSeries(items, worker) {
  throw new Error('11 asyncSeries 未作答')
}

/** 作答区 5：asyncParallel(items, worker) —— 全部并发启动，结果按入参顺序 */
function asyncParallel(items, worker) {
  throw new Error('11 asyncParallel 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'sleep：至少等待指定的毫秒数',
    run: async () => {
      const t0 = Date.now()
      await sleep(30)
      assertEqual(Date.now() - t0 >= 25, true, '实际等待时间不足 25ms')
    },
  },
  {
    name: 'retry：失败若干次后成功，尝试次数正确',
    run: async () => {
      let n = 0
      const out = await retry(async () => {
        n += 1
        if (n < 3) throw new Error('fail')
        return 'ok'
      }, 5, 1)
      assertEqual([out, n], ['ok', 3], '应失败 2 次、第 3 次成功')
    },
  },
  {
    name: 'retry：超过次数后抛出最后一次的错误',
    run: async () => {
      let n = 0
      let msg = ''
      try {
        await retry(async () => { n += 1; throw new Error(`e${n}`) }, 3, 1)
      } catch (err) {
        msg = err.message
      }
      assertEqual([msg, n], ['e4', 4], `总尝试次数应为 1+3=4，实际 ${n} 次`)
    },
  },
  {
    name: 'withTimeout：未超时返回原值，超时抛错',
    run: async () => {
      assertEqual(await withTimeout(wait(10).then(() => 'ok'), 100), 'ok', '未超时应返回原值')
      let timedOut = false
      try {
        await withTimeout(wait(80).then(() => 'late'), 20)
      } catch (err) {
        timedOut = true
      }
      assertEqual(timedOut, true, '超时应抛错')
    },
  },
  {
    name: 'asyncSeries：严格串行（上一个结束才启动下一个）',
    run: async () => {
      const order = []
      const out = await asyncSeries([1, 2, 3], async (n) => {
        order.push(`start${n}`)
        await wait(5)
        order.push(`end${n}`)
        return n * 2
      })
      assertEqual(order, ['start1', 'end1', 'start2', 'end2', 'start3', 'end3'], '未串行执行')
      assertEqual(out, [2, 4, 6], '结果顺序不对')
    },
  },
  {
    name: 'asyncParallel：同时启动，结果按入参顺序返回',
    run: async () => {
      const order = []
      const out = await asyncParallel([30, 5, 15], async (ms) => {
        order.push(`s${ms}`)
        await wait(ms)
        return ms
      })
      assertEqual(out, [30, 5, 15], '结果应按入参顺序，而不是完成顺序')
      assertEqual(order[0], 's30', '所有任务应几乎同时启动')
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

// 直接跑：node plan/week-09/d1/11-async-utils.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 11 异步工具族', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { sleep, retry, withTimeout, asyncSeries, asyncParallel }
