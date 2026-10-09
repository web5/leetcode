/**
 * 学习参考 · 手撕 01：防抖 debounce / 节流 throttle
 *
 * 配套讲解：plan/learn/01-debounce-throttle.md
 * 你的作答文件：plan/week-02/d2/01-debounce-throttle.js（看完这里再自己写，别抄）
 *
 * 跑时间线演示：node plan/learn/01-debounce-throttle.js
 * 本文件只有注释和实现，没有断言，随便改着玩。
 */

// ═══════════════════════════════════════════════════════════
// 防抖 debounce
// 语义：事件不断触发就一直不执行；**停下来 wait 毫秒后**执行一次
// 典型场景：搜索框联想、窗口 resize 后重排、表单校验
// ═══════════════════════════════════════════════════════════

/** 第 1 层：最朴素的骨架 —— 面试官说「先写个能跑的」时给这个 */
function debounceV1(fn, wait) {
  let timer = null
  return function (...args) {
    // 关键就这一行：每次触发先清掉上一次的定时器，等于「重新计时」
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}
// 缺点：this 丢了（fn(...args) 是裸调用）；也没有 leading/trailing 开关。

/** 第 2 层：透传 this 与参数 —— 面试官追问「对象方法调用时 this 呢」 */
function debounceV2(fn, wait) {
  let timer = null
  return function (...args) {
    if (timer !== null) clearTimeout(timer)
    // 这里用箭头函数，才能拿到「debounced 被调用时的 this」
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, wait)
  }
}
// 缺点：第一次触发要等 wait 才执行；也没有手动取消的手段。

/**
 * 第 3 层：加上 leading / trailing 两个开关 + cancel / flush（完整版）
 *
 * leading  = true  → 首次触发立即执行一次
 * trailing = true  → 停止触发后补执行一次（默认行为）
 * 四个组合：{leading:false,trailing:true} 是默认（搜索框）；两者都 true 常用于按钮防连点
 */
function debounce(fn, wait, { leading = false, trailing = true } = {}) {
  let timer = null
  let lastArgs = null
  let lastThis = null

  // 真正的「尾部执行」：只在有攒下的参数、且允许 trailing 时才调 fn
  const invokeTrailing = () => {
    timer = null
    if (!trailing || lastArgs === null) return
    const args = lastArgs
    const ctx = lastThis
    lastArgs = null
    lastThis = null
    fn.apply(ctx, args)
  }

  function debounced(...args) {
    // 只有「当前没有挂着的定时器」才算一个 burst 的开始
    const callNow = leading && timer === null

    lastArgs = args
    lastThis = this

    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(invokeTrailing, wait)

    if (callNow) {
      // 已经立刻执行过了，把攒的参数清掉，避免 trailing 再补一次
      lastArgs = null
      lastThis = null
      fn.apply(this, args)
    }
  }

  // 组件卸载 / 路由离开前丢掉未执行的调用
  debounced.cancel = () => {
    if (timer !== null) clearTimeout(timer)
    timer = null
    lastArgs = null
    lastThis = null
  }

  // 立刻把挂起的那次执行掉（比如输入框失焦时确保数据已提交）
  debounced.flush = () => {
    if (timer === null) return
    clearTimeout(timer)
    invokeTrailing()
  }

  return debounced
}

// ═══════════════════════════════════════════════════════════
// 节流 throttle
// 语义：每 wait 毫秒**最多执行一次**
// 典型场景：滚动监听、拖拽、鼠标移动、游戏主循环
// 三种写法行为不同，面试要能说出差别
// ═══════════════════════════════════════════════════════════

/** 写法 A：时间戳版 —— 首次立即执行；最后一次「不补」（会丢尾部） */
function throttleByTimestamp(fn, wait) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn.apply(this, args)
    }
    // 不满足条件就直接丢弃这次调用
  }
}

/** 写法 B：定时器版 —— 首次延迟执行；最后一次「会补」（不丢尾部） */
function throttleByTimer(fn, wait) {
  let timer = null
  return function (...args) {
    if (timer !== null) return // 冷却中，直接丢弃
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, wait)
  }
}

/** 写法 C：两者结合（leading + trailing）—— 工程里最常用，也是作答文件的默认口径 */
function throttle(fn, wait, { leading = true, trailing = true } = {}) {
  let lastTime = 0 // 上次真正执行的时间；0 表示还没执行过
  let timer = null
  let lastArgs = null
  let lastThis = null

  const invoke = () => {
    lastTime = Date.now()
    timer = null
    if (lastArgs === null) return
    const args = lastArgs
    const ctx = lastThis
    lastArgs = null
    lastThis = null
    fn.apply(ctx, args)
  }

  return function throttled(...args) {
    const now = Date.now()
    if (lastTime === 0 && !leading) lastTime = now // 首次不立即执行时，把起点设在现在

    const remaining = wait - (now - lastTime)

    if (remaining <= 0) {
      // 冷却期已过：立刻执行，并清掉可能挂着的尾部定时器（否则会多执行一次）
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      fn.apply(this, args)
      return
    }

    // 仍在冷却期：记下参数，安排一次尾部执行
    lastArgs = args
    lastThis = this
    if (timer === null && trailing) timer = setTimeout(invoke, remaining)
  }
}

// ═══════════════════════════════════════════════════════════
// 时间线演示：直观看两者的差别
// ═══════════════════════════════════════════════════════════
function demo() {
  const WAIT = 60
  const t0 = Date.now()
  const at = () => `@${String(Date.now() - t0).padStart(4)}ms`
  const events = []

  console.log(`\n  防抖 vs 节流 时间线（wait = ${WAIT}ms）`)
  console.log(`  调用序列：0ms · 20ms · 40ms 各触发一次，之后静默 200ms\n`)

  const debounced = debounce(() => events.push(`防抖 真正执行 ${at()}`), WAIT)
  const throttled = throttle(() => events.push(`节流 真正执行 ${at()}`), WAIT)

  for (const ms of [0, 20, 40]) {
    setTimeout(() => {
      debounced()
      throttled()
    }, ms)
  }

  setTimeout(() => {
    for (const e of events) console.log('    ' + e)
    console.log('\n  解读：')
    console.log('    防抖：3 次触发被合并成 1 次，落在「最后一次触发 + wait」≈ 100ms')
    console.log('    节流：首次立刻执行（≈0ms），冷却结束时补一次（≈60ms），共 2 次')
    console.log('\n  一句话记住：防抖要「静默」，节流只看「距上次多久」\n')
  }, 240)
}

module.exports = {
  debounce,
  debounceV1,
  debounceV2,
  throttle,
  throttleByTimestamp,
  throttleByTimer,
}

if (require.main === module) demo()
