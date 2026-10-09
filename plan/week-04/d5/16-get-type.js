/**
 * 手撕 16：类型判断 getType（区分 array / null / date / regexp）
 * 参考实现：无（对照 Object.prototype.toString.call）
 * 排期：第 4 周 D5
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * typeof 的三处失真：____（null → 'object'、数组 → 'object'、NaN → 'number'）
 * 为什么 Object.prototype.toString.call 最可靠：____（内部 [[Class]]，不受原型篡改影响）
 * 为什么不能写 obj.toString()：____（对象自己可能重写了 toString）
 * 追问：instanceof 跨 iframe 失效；Symbol.toStringTag 会改变 toString 的结果
 * ─────────────────────────────────────────────────
 */

/** 作答区：getType(value) → 'null' | 'array' | 'date' | 'regexp' | 'object' | 'number' | 'string' | 'boolean' | 'undefined' | 'function' | 'symbol' | 'map' | 'set'（小写） */
function getType(value) {
  throw new Error('16 getType 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: '四个老大难：null / array / date / regexp',
    run: async () => {
      assertEqual(getType(null), 'null', 'null（typeof null 是 object，别被带偏）')
      assertEqual(getType([]), 'array', 'array')
      assertEqual(getType(new Date()), 'date', 'date')
      assertEqual(getType(/ab/gi), 'regexp', 'regexp')
    },
  },
  {
    name: '基本类型与 function / undefined',
    run: async () => {
      assertEqual(getType(1), 'number', 'number')
      assertEqual(getType('s'), 'string', 'string')
      assertEqual(getType(true), 'boolean', 'boolean')
      assertEqual(getType(undefined), 'undefined', 'undefined')
      assertEqual(getType(() => {}), 'function', 'function')
      assertEqual(getType({}), 'object', 'object')
    },
  },
  {
    name: 'Map / Set / NaN 也要准',
    run: async () => {
      assertEqual(getType(new Map()), 'map', 'map')
      assertEqual(getType(new Set()), 'set', 'set')
      assertEqual(getType(NaN), 'number', 'NaN 仍然是 number')
    },
  },
  {
    name: '不受对象重写 toString 影响',
    run: async () => {
      const tricky = { toString: () => '[object Array]' }
      assertEqual(getType(tricky), 'object', '别用 obj.toString()，要用 Object.prototype.toString.call')
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

// 直接跑：node plan/handwritten/16-get-type.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 16 类型判断 getType', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { getType }
