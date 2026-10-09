/**
 * 手撕 07：并发控制（限制并发数）
 *
 * 两种形态，面试任选其一，但要知道对方要的是哪种：
 *  A. asyncPool(limit, items, iteratorFn)：一次性拿到全部任务，返回结果数组（保持入参顺序）
 *  B. createLimiter(limit)：返回一个「包装函数」，想加任务时随时调用（更通用，适合动态追加）
 *
 * A 的巧妙点：**不开 N 个 Promise 去抢，而是开 limit 个 worker 轮流取任务**
 *   —— 因为 JS 是单线程，worker 内部 `while` 取下一个下标天然是原子的，不需要锁。
 *
 * B 的巧妙点：用一个计数器 + 队列，任务完成时从队列里取下一个补位（类似 pm2 的进程池）。
 *
 * 易错点：
 *  - 结果必须按下标落位（不是完成顺序），否则顺序错乱
 *  - 任务抛错时要让整个 Promise 正确 reject（A 里让 worker 抛出 → Promise.all 短路）
 *  - limit 大于任务数时不要开多余的 worker
 */

// A. 批量任务 + 并发上限，返回与 items 顺序一致的结果数组
async function asyncPool(limit, items, iteratorFn) {
  const list = Array.from(items)
  const results = new Array(list.length)
  let nextIndex = 0

  const worker = async () => {
    while (nextIndex < list.length) {
      const current = nextIndex++ // 同步自增，天然互斥
      results[current] = await iteratorFn(list[current], current)
    }
  }

  const workerCount = Math.max(1, Math.min(limit, list.length))
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}

// B. 动态追加任务的限流器：const run = createLimiter(2); run(taskFn)
function createLimiter(limit) {
  let active = 0
  const queue = []

  const dequeue = () => {
    if (active >= limit || queue.length === 0) return
    active++
    const { task, resolve, reject } = queue.shift()
    Promise.resolve()
      .then(task)
      .then(resolve, reject)
      .finally(() => {
        active--
        dequeue() // 空出名额，立刻补位
      })
  }

  return function run(task) {
    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject })
      dequeue()
    })
  }
}

module.exports = { asyncPool, createLimiter }
