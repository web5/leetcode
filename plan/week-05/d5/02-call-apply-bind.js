/**
 * 手撕 02：手写 call / apply / bind
 * 参考实现（写完再对照）：archive/handwritten/call-apply-bind.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * 核心原理一句话：____（把函数挂到目标对象上当临时方法，再调用）
 * 必答追问：① bind 的 new 语义（返回的函数被 new 时 this 应指向新对象）
 *          ② 偏函数 ③ Symbol 防属性名污染 ④ 箭头函数没有自己的 this
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：myCall(fn, ctx, ...args) */
function myCall(fn, ctx, ...args) {
  throw new Error('02 myCall 未作答')
}

/** 作答区 2：myApply(fn, ctx, argsArray) */
function myApply(fn, ctx, argsArray) {
  throw new Error('02 myApply 未作答')
}

/** 作答区 3：myBind(fn, ctx, ...preset) → 返回新函数，支持偏应用 */
function myBind(fn, ctx, ...preset) {
  throw new Error('02 myBind 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'myCall：绑定 this 并透传参数',
    run: async () => {
      function who(...args) { return [this.tag, args] }
      assertEqual(myCall(who, { tag: 'a' }, 1, 2), ['a', [1, 2]], 'this 或参数不对')
    },
  },
  {
    name: 'myApply：第二参是参数数组',
    run: async () => {
      function who(a, b) { return [this.tag, a + b] }
      assertEqual(myApply(who, { tag: 'b' }, [1, 2]), ['b', 3], 'apply 语义不对')
    },
  },
  {
    name: 'myBind：返回新函数、支持偏应用、可重复调用',
    run: async () => {
      function who(a, b) { return `${this.tag}-${a}-${b}` }
      const bound = myBind(who, { tag: 'c' }, 1)
      assertEqual(bound(2), 'c-1-2', '偏应用不对')
      assertEqual(bound(9), 'c-1-9', '同一绑定函数应可重复调用')
    },
  },
  {
    name: 'myCall：ctx 为 null 时不报错（严格模式下 this 为 null/undefined）',
    run: async () => {
      function who() { return this === null || this === undefined || typeof this === 'object' }
      assertEqual(myCall(who, null), true, 'ctx 为 null 时不应抛错')
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

// 直接跑：node plan/week-05/d5/02-call-apply-bind.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 02 call / apply / bind', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { myCall, myApply, myBind }
