/**
 * 手撕 15：手写 Object.create / Object.assign
 * 参考实现：无（对照原生 Object.create / Object.assign）
 * 排期：第 4 周 D3
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * Object.create 的两种写法：____（ES5 的 Object.create 或 __proto__ / setPrototypeOf）
 * 为什么 Object.create(null) 有用：____（干净字典，不带 toString 等原型方法）
 * Object.assign 是浅拷贝：____（嵌套对象仍共享引用）
 * assign 会拷贝哪些属性：____（只拷贝自身可枚举属性、Symbol 属性也会拷；null/undefined 源被忽略）
 * 追问：浅冻结 vs 深冻结（Object.freeze 只冻第一层）
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：myCreate(proto) —— 创建一个原型指向 proto 的新对象 */
function myCreate(proto) {
  throw new Error('15 myCreate 未作答')
}

/** 作答区 2：myAssign(target, ...sources) —— 浅拷贝，返回 target 本身 */
function myAssign(target, ...sources) {
  throw new Error('15 myAssign 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'myCreate：原型链正确、没有自身属性',
    run: async () => {
      const proto = { greet() { return 'hi' } }
      const obj = myCreate(proto)
      assertEqual(obj.greet(), 'hi', '应能取到原型上的方法')
      assertEqual(Object.getPrototypeOf(obj) === proto, true, '原型应直接指向传入对象')
      assertEqual(Object.keys(obj).length, 0, '不应有自身可枚举属性')
    },
  },
  {
    name: 'myCreate(null)：没有原型，不继承 Object.prototype',
    run: async () => {
      const obj = myCreate(null)
      assertEqual(Object.getPrototypeOf(obj), null, '原型应为 null')
      assertEqual('toString' in obj, false, '不应继承 Object.prototype')
    },
  },
  {
    name: 'myAssign：合并多个源、后者覆盖前者、返回 target 本身',
    run: async () => {
      const target = { a: 1 }
      const out = myAssign(target, { b: 2 }, { a: 9, c: 3 })
      assertEqual(out, { a: 9, b: 2, c: 3 }, '合并结果不对')
      assertEqual(out === target, true, '应返回 target 本身（不是新对象）')
    },
  },
  {
    name: 'myAssign：忽略 null/undefined 源；是浅拷贝（嵌套仍共享引用）',
    run: async () => {
      const nested = { deep: { x: 1 } }
      const out = myAssign({}, nested, null, undefined)
      assertEqual(out, { deep: { x: 1 } }, '结果不对（null/undefined 源应被忽略）')
      assertEqual(out.deep === nested.deep, true, 'assign 是浅拷贝，嵌套对象应共享引用')
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

// 直接跑：node plan/week-04/d3/15-object-utils.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 15 Object.create / assign', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { myCreate, myAssign }
