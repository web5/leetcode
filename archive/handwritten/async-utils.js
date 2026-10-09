/**
 * 手撕 11：异步工具族（sleep / 重试 / 超时 / 串行 / 并行）
 *
 * 这几个是「工程题」的常客，面试官想看你是否理解 Promise 的组合方式而不是背 API：
 *  ① sleep：把 setTimeout 包成 Promise（也是「Promise 化回调」的最简样板）
 *  ② retry：失败重试 + 指数退避；注意**首次调用不算重试**，所以循环是 attempt <= retries
 *  ③ withTimeout：Promise.race 实现，务必 finally 里 clearTimeout，否则留下悬挂定时器（Node 里会拖住进程）
 *  ④ asyncSeries：前一个完成才跑下一个（依赖前序结果、限流为 1 的并行）
 *  ⑤ asyncParallel：全部同时开跑
 *
 * 生产里还有两个常被追问的点：重试要「幂等」才安全；超时后原 promise 并不会被取消（要 AbortController）。
 */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// 指数退避重试：delay * factor^attempt
async function retry(fn, { retries = 3, delay = 0, factor = 1, onError } = {}) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt)
    } catch (err) {
      lastError = err
      if (onError) onError(err, attempt)
      if (attempt < retries && delay > 0) await sleep(delay * factor ** attempt)
    }
  }
  throw lastError
}

// 超时包装：超时后 reject，原 promise 继续跑（不可取消，除非用 AbortController）
function withTimeout(promise, ms, message = `Timeout after ${ms}ms`) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

// 串行执行（任务的函数节点，调用时才真正开跑）
async function asyncSeries(tasks) {
  const results = []
  for (const task of tasks) {
    results.push(await task())
  }
  return results
}

// 并行执行
async function asyncParallel(tasks) {
  return Promise.all(tasks.map((task) => task()))
}

module.exports = { sleep, retry, withTimeout, asyncSeries, asyncParallel }
