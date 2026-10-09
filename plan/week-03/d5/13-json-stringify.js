/**
 * 手撕 13：手写 JSON.stringify
 * 参考实现：无（对照原生 JSON.stringify 的输出来验证）
 * 排期：第 3 周 D5
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记（本题的难点全在「省略 vs null」这条规则上）─────────
 * 字符串要转义哪些字符：____（\" \\ \n \r \t \b \f 以及 \u0000-\u001f）
 * undefined / function / symbol：____（作为**对象属性**直接省略；作为**数组元素**变成 null）
 * 特殊数字：____（NaN / Infinity / -Infinity → 'null'）
 * 循环引用：____（原生会抛 TypeError: Converting circular structure to JSON）
 * 本文件的自测口径：**直接拿原生 JSON.stringify 的结果当标准答案**（只用你实现的子集去比）
 * ─────────────────────────────────────────────────
 */

/** 作答区：myStringify(value) —— 覆盖字符串转义、数字、布尔、null、数组、对象、Date、循环引用 */
function myStringify(value) {
  throw new Error('13 myStringify 未作答')
}

/** 自测素材：以原生实现为 oracle */
const CHECKS = [
  {
    name: '字符串转义与基本类型',
    run: async () => {
      for (const v of ['hello', 'a"b', 'a\nb', '\t\r', 'x\\y']) {
        assertEqual(myStringify(v), JSON.stringify(v), `字符串 ${JSON.stringify(v)}`)
      }
      assertEqual(myStringify(42), '42', '整数')
      assertEqual(myStringify(-0.5), '-0.5', '小数')
      assertEqual(myStringify(true), 'true', '布尔')
      assertEqual(myStringify(null), 'null', 'null')
    },
  },
  {
    name: '特殊数字：NaN / Infinity → null',
    run: async () => {
      assertEqual(myStringify(NaN), JSON.stringify(NaN), 'NaN')
      assertEqual(myStringify(Infinity), JSON.stringify(Infinity), 'Infinity')
      assertEqual(myStringify(-Infinity), JSON.stringify(-Infinity), '-Infinity')
    },
  },
  {
    name: '对象属性省略 undefined / function；数组元素变 null',
    run: async () => {
      const obj = { a: 1, b: undefined, c: () => {}, d: 'x' }
      assertEqual(myStringify(obj), JSON.stringify(obj), '对象应省略 undefined/function 属性')
      const arr = [1, 'a', undefined, () => {}]
      assertEqual(myStringify(arr), JSON.stringify(arr), '数组里的 undefined/function 应变 null')
    },
  },
  {
    name: '嵌套结构与 Date',
    run: async () => {
      const v = { a: { b: [1, 2, { c: 'deep' }] }, list: [[], {}] }
      assertEqual(myStringify(v), JSON.stringify(v), '嵌套结构')
      const d = { d: new Date('2026-10-08T00:00:00Z') }
      assertEqual(myStringify(d), JSON.stringify(d), 'Date 应序列化为 ISO 字符串')
    },
  },
  {
    name: '循环引用应抛错（原生抛 TypeError）',
    run: async () => {
      const circular = { name: 'root' }
      circular.self = circular
      let threw = ''
      try {
        myStringify(circular)
      } catch (err) {
        threw = err.constructor.name
      }
      assertEqual(threw, 'TypeError', '循环引用应抛 TypeError（不是 RangeError 爆栈）')
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

// 直接跑：node plan/handwritten/13-json-stringify.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 13 JSON.stringify', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { myStringify }
