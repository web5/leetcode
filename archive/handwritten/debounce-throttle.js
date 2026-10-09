/**
 * 手撕 01：防抖 debounce / 节流 throttle（前端面试出现率最高的一题）
 *
 * 语义差别（一定要能一句话说清）：
 *  - 防抖 debounce：事件不断触发就**一直不执行**，停下来的 wait 毫秒后执行一次（搜索框联想）
 *  - 节流 throttle：每 wait 毫秒**最多执行一次**（滚动监听、拖拽）
 *
 * 面试四个递进问法（准备到第 4 层才算过关）：
 *  ① 基础版（setTimeout / 时间戳）
 *  ② leading / trailing 两个开关（首次是否立即执行、停止后是否补一次）
 *  ③ this 与参数透传、返回值
 *  ④ cancel / flush 手动控制，以及「throttle 就是 leading + trailing 的 debounce」这层关系
 *
 * 复杂度：时间 O(1)，空间 O(1)
 */

function debounce(fn, wait, { leading = false, trailing = true } = {}) {
  let timer = null
  let lastArgs = null
  let lastThis = null

  const invoke = () => {
    timer = null
    if (trailing && lastArgs) {
      const args = lastArgs
      const ctx = lastThis
      lastArgs = null
      lastThis = null
      fn.apply(ctx, args)
    }
  }

  function debounced(...args) {
    lastArgs = args
    lastThis = this

    const callNow = leading && timer === null // 首次触发立即执行
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(invoke, wait)

    if (callNow) {
      const ctx = this
      lastArgs = null // 已消费，避免 trailing 再补一次
      lastThis = null
      fn.apply(ctx, args)
    }
  }

  debounced.cancel = () => {
    if (timer !== null) clearTimeout(timer)
    timer = null
    lastArgs = null
    lastThis = null
  }

  // 立刻执行挂起的 trailing 调用（如组件卸载前收尾）
  debounced.flush = () => {
    if (timer === null) return
    clearTimeout(timer)
    invoke()
  }

  return debounced
}

function throttle(fn, wait, { leading = true, trailing = true } = {}) {
  let lastTime = 0 // 上次真正执行的时间；0 表示还没执行过
  let timer = null
  let lastArgs = null
  let lastThis = null

  function invoke() {
    lastTime = Date.now()
    timer = null
    if (!lastArgs) return
    const args = lastArgs
    const ctx = lastThis
    lastArgs = null
    lastThis = null
    fn.apply(ctx, args)
  }

  return function throttled(...args) {
    const now = Date.now()
    if (!lastTime && !leading) lastTime = now // 首次不立即执行时，把起点设在现在

    const remaining = wait - (now - lastTime)

    if (remaining <= 0) {
      // 冷却结束：立刻执行（并清掉可能挂着的尾部定时器）
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      fn.apply(this, args)
      return
    }

    // 冷却中：只记录参数，安排一次尾部执行
    lastArgs = args
    lastThis = this
    if (timer === null && trailing) {
      timer = setTimeout(invoke, remaining)
    }
  }
}

module.exports = { debounce, throttle }
