/**
 * 手撕 01：防抖 debounce / 节流 throttle（面试出现率最高）
 * 学习资料（同目录）：01-debounce-throttle.notes.md（讲解）· 01-debounce-throttle.reference.js（分层参考实现 + 时间线演示）
 * 归档参考实现（另一种写法）：archive/handwritten/debounce-throttle.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记（手撕考的是「边写边讲」）──────────────────
 * 一句话差别：____（防抖 = 停下来才算；节流 = 每 wait 最多一次）
 * 要准备到的 4 层追问：① 基础版 ② leading/trailing 开关 ③ this 与参数透传 ④ cancel / flush
 * 本文件的自测假定：debounce 默认 leading=false/trailing=true；throttle 默认 leading=true/trailing=true
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：防抖 —— 停止 wait 毫秒后执行一次 */
function debounce(fn, wait) {
  throw new Error('01 debounce 未作答')
}

/** 作答区 2：节流 —— 首次立即执行，冷却期内合并，冷却结束时补一次 */
function throttle(fn, wait) {
  throw new Error('01 throttle 未作答')
}

/** 自测素材：run 抛错即失败；等待时间给得很宽，避免抖动误报 */
const CHECKS = [
  {
    name: '防抖：连续调用只执行一次（trailing）',
    run: async () => {
      let count = 0
      const d = debounce(() => { count += 1 }, 40)
      d(); d(); d()
      assertEqual(count, 0, '等待期内不应执行')
      await wait(150)
      assertEqual(count, 1, '停下来后应只执行一次')
    },
  },
  {
    name: '防抖：透传最后一次调用的 this 与参数',
    run: async () => {
      const seen = []
      const obj = {
        tag: 'obj',
        fn: debounce(function (...args) { seen.push([this && this.tag, args]) }, 40),
      }
      obj.fn(1)
      obj.fn(2, 3)
      await wait(150)
      assertEqual(seen, [['obj', [2, 3]]], '应收到最后一次调用的 this/参数')
    },
  },
  {
    name: '节流：首次立即执行（leading）',
    run: async () => {
      let count = 0
      const t = throttle(() => { count += 1 }, 60)
      t()
      assertEqual(count, 1, 'leading 应立刻执行一次')
    },
  },
  {
    name: '节流：冷却期内合并、结束时补一次；冷却过后可再次立即执行',
    run: async () => {
      let count = 0
      const t = throttle(() => { count += 1 }, 60)
      t(); t(); t()
      assertEqual(count, 1, '冷却期内的调用不应立即执行')
      await wait(200)
      assertEqual(count, 2, 'trailing 应补一次')
      t()
      assertEqual(count, 3, '冷却结束后再调应立刻执行')
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

// 直接跑：node plan/handwritten/01-debounce-throttle.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 01 防抖 / 节流', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { debounce, throttle }
