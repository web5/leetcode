/**
 * 手撕 03：手写 new / instanceof
 * 参考实现（写完再对照）：archive/handwritten/new-instanceof.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * new 的四步：____（建对象 → 连原型 → 执行构造函数 → 返回值规则）
 * 返回值规则一句话：____（构造函数返回**对象**则覆盖，返回基本类型则忽略）
 * instanceof 的原理：____（沿 __proto__ 向上找，找不到就 false）
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：myNew(Ctor, ...args) */
function myNew(Ctor, ...args) {
  throw new Error('03 myNew 未作答')
}

/** 作答区 2：myInstanceof(obj, Ctor) */
function myInstanceof(obj, Ctor) {
  throw new Error('03 myInstanceof 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'myNew：实例属性与原型链都正确',
    run: async () => {
      function Person(name) { this.name = name }
      const p = myNew(Person, 'tom')
      assertEqual(p.name, 'tom', '属性未挂到实例上')
      assertEqual(p instanceof Person, true, '原型链未接上')
    },
  },
  {
    name: 'myNew：构造函数返回对象时以返回值为准',
    run: async () => {
      function Weird() { return { hijack: true } }
      assertEqual(myNew(Weird).hijack, true, '应返回构造函数返回的那个对象')
    },
  },
  {
    name: 'myNew：构造函数返回基本类型时忽略返回值',
    run: async () => {
      function Prim() { this.ok = 1; return 123 }
      assertEqual(myNew(Prim).ok, 1, '基本类型返回值应被忽略')
    },
  },
  {
    name: 'myInstanceof：沿原型链判断，基本类型 / null 为 false',
    run: async () => {
      assertEqual(myInstanceof([], Array), true, '数组应为 Array 的实例')
      assertEqual(myInstanceof({}, Array), false, '普通对象不是数组')
      assertEqual(myInstanceof(1, Number), false, '基本类型应 false')
      assertEqual(myInstanceof(null, Object), false, 'null 应 false')
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

// 直接跑：node plan/handwritten/03-new-instanceof.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 03 new / instanceof', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { myNew, myInstanceof }
