/**
 * 手撕 07：并发调度器 / 并发限制
 * 参考实现（写完再对照）：archive/handwritten/concurrency-limit.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * 核心结构一句话：____（固定数量的 worker，谁先空出来谁就从队列取下一个任务）
 * 结果怎么按下标落位：____（防止乱序）
 * 失败怎么处理：____（单个失败不该阻塞队列；用 allSettled 语义或不影响其它任务）
 * 追问：动态追加任务、AbortController 取消、与 p-limit 的差异
 * ─────────────────────────────────────────────────
 */

/**
 * 作答区 1：限并发 map
 * @param {number} limit 最大并发数
 * @param {Array} items 待处理元素
 * @param {(item: any, index: number) => Promise<any>} worker
 * @returns {Promise<Array>} 结果数组，顺序与 items 一致
 */
function asyncPool(limit, items, worker) {
  throw new Error('07 asyncPool 未作答')
}

/**
 * 作答区 2：返回一个限流函数，共用同一份并发额度
 * const limit2 = createLimiter(2)
 * await Promise.all(jobs.map((job) => limit2(job)))
 */
function createLimiter(limit) {
  throw new Error('07 createLimiter 未作答')
}

/** 自测素材：用「运行中计数器的峰值」来验证并发没有超限 */
const CHECKS = [
  {
    name: 'asyncPool：并发峰值不超过 limit',
    run: async () => {
      let running = 0
      let peak = 0
      const out = await asyncPool(3, [0, 1, 2, 3, 4, 5, 6, 7], (n) => {
        running += 1
        peak = Math.max(peak, running)
        return wait(10).then(() => { running -= 1; return n })
      })
      assertEqual(peak <= 3, true, `并发峰值 ${peak} 超过了 limit=3`)
      assertEqual(out, [0, 1, 2, 3, 4, 5, 6, 7], '结果应保持入参顺序')
    },
  },
  {
    name: 'asyncPool：单元素与 limit 大于数组长度都不出错',
    run: async () => {
      const one = await asyncPool(5, [7], (n) => Promise.resolve(n * 2))
      assertEqual(one, [14], '单元素结果不对')
    },
  },
  {
    name: 'createLimiter：同一限制器下的任务共享额度',
    run: async () => {
      const limitFn = createLimiter(2)
      let running = 0
      let peak = 0
      const jobs = Array.from({ length: 6 }, () =>
        limitFn(() => {
          running += 1
          peak = Math.max(peak, running)
          return wait(10).then(() => { running -= 1; return 'ok' })
        })
      )
      const out = await Promise.all(jobs)
      assertEqual(peak <= 2, true, `并发峰值 ${peak} 超过了 2`)
      assertEqual(out, ['ok', 'ok', 'ok', 'ok', 'ok', 'ok'], '任务返回值透传不对')
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

// 直接跑：node plan/week-08/d5/07-concurrency-limit.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 07 并发调度器', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { asyncPool, createLimiter }
