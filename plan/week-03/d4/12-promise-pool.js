/**
 * 手撕 12：Promise.all 的并发限制版（promisePool）
 * 参考实现：无（归档的 07-concurrency-limit.js 是同一套思路，可对照）
 * 排期：第 3 周 D4
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * 与 Promise.all 的差别：____（all 会一次性全部启动；pool 只放 limit 个进去）
 * 为什么结果要按下标落位：____（完成顺序 ≠ 入参顺序）
 * 单个任务失败怎么办：____（本文件用 allSettled 语义：收集 { status, value|reason }，不整体 reject）
 * 追问：动态追加任务、AbortController 取消、与 p-limit 的差异
 * ─────────────────────────────────────────────────
 */

/**
 * 作答区：promisePool(tasks, limit)
 * @param {Array<() => Promise<any>>} tasks 任务工厂（元素是函数，不是已启动的 Promise）
 * @param {number} limit 最大并发数
 * @returns {Promise<Array<{status: 'fulfilled'|'rejected', value?: any, reason?: any}>>}
 *          结果顺序与 tasks 一致；任何单个失败都不让整体 reject
 */
function promisePool(tasks, limit) {
  throw new Error('12 promisePool 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: '并发峰值不超过 limit',
    run: async () => {
      let running = 0
      let peak = 0
      const tasks = Array.from({ length: 9 }, (_, i) => () => {
        running += 1
        peak = Math.max(peak, running)
        return wait(10).then(() => { running -= 1; return i })
      })
      await promisePool(tasks, 3)
      assertEqual(peak <= 3, true, `并发峰值 ${peak} 超过了 limit=3`)
    },
  },
  {
    name: '结果按入参顺序返回，且带上 status',
    run: async () => {
      const out = await promisePool(
        [() => wait(40).then(() => 'slow'), () => Promise.resolve('fast')],
        2
      )
      assertEqual(out.map((r) => r.status), ['fulfilled', 'fulfilled'], 'status 不对')
      assertEqual(out.map((r) => r.value), ['slow', 'fast'], '结果应按入参顺序，而不是完成顺序')
    },
  },
  {
    name: '单个任务失败不阻塞其它任务，也不整体 reject',
    run: async () => {
      const out = await promisePool(
        [() => Promise.resolve(1), () => Promise.reject(new Error('bad')), () => Promise.resolve(3)],
        2
      )
      assertEqual(out[0].value, 1, '第一个任务的结果丢了')
      assertEqual(out[1].status, 'rejected', '第二个应为 rejected')
      assertEqual(out[1].reason.message, 'bad', '应保留失败原因')
      assertEqual(out[2].value, 3, '失败不应阻塞后续任务')
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

// 直接跑：node plan/week-03/d4/12-promise-pool.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 12 Promise.all 限流版', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { promisePool }
