/**
 * 手撕 04：深拷贝
 * 参考实现（写完再对照）：archive/handwritten/deep-clone.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * JSON 方案的四大硬伤：____（函数/undefined 丢失、Date 变字符串、循环引用报错、原型丢失）
 * 为什么必须用 WeakMap：____（循环引用 + 不阻止 GC）
 * 还要处理：____（Date / RegExp / Map / Set / Symbol.keyFor 等）
 * ─────────────────────────────────────────────────
 */

/** 作答区：deepClone(value) —— 支持嵌套、数组、Date、RegExp、循环引用 */
function deepClone(value) {
  throw new Error('04 deepClone 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: '嵌套对象与数组：改副本不影响原值',
    run: async () => {
      const src = { a: 1, b: { c: [1, 2, { d: 3 }] } }
      const copy = deepClone(src)
      assertEqual(copy, src, '克隆结果应与原值相等')
      copy.b.c[2].d = 99
      assertEqual(src.b.c[2].d, 3, '改副本影响了原对象（说明是浅拷贝）')
    },
  },
  {
    name: 'Date / RegExp 类型保持',
    run: async () => {
      const d = new Date('2026-10-08T00:00:00Z')
      const r = /ab+c/gi
      const copy = deepClone({ d, r })
      assertEqual(copy.d instanceof Date && copy.d.getTime() === d.getTime(), true, 'Date 未正确克隆')
      assertEqual(copy.r instanceof RegExp && copy.r.source === 'ab+c' && copy.r.flags === 'gi', true, 'RegExp 未正确克隆')
    },
  },
  {
    name: '循环引用：不爆栈且指向副本自身',
    run: async () => {
      const src = { name: 'root' }
      src.self = src
      const copy = deepClone(src)
      assertEqual(copy.self === copy, true, '循环引用应指向副本自身（WeakMap 没兜住）')
    },
  },
  {
    name: '基本类型与 null 原样返回',
    run: async () => {
      assertEqual(deepClone(1), 1, 'number')
      assertEqual(deepClone(null), null, 'null')
      assertEqual(deepClone('x'), 'x', 'string')
      assertEqual(deepClone(false), false, 'boolean')
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

// 直接跑：node plan/handwritten/04-deep-clone.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 04 深拷贝', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { deepClone }
