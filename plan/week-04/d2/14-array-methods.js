/**
 * 手撕 14：手写数组方法 map / filter / reduce
 * 参考实现：无（对照原生 map / filter / reduce）
 * 排期：第 4 周 D2
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * 回调的三个参数顺序：____（item, index, 原数组——第三个最容易漏）
 * map / filter 的稀疏数组行为：____（原生跳过空洞）
 * reduce 不传初值且数组为空：____（原生抛 TypeError: Reduce of empty array with no initial value）
 * 还要能说清「不改原数组 / 返回新数组 / reduce 返回累积值」的区别
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：myMap(arr, fn) —— fn(item, index, arr)，返回等长新数组 */
function myMap(arr, fn) {
  throw new Error('14 myMap 未作答')
}

/** 作答区 2：myFilter(arr, fn) —— 返回 fn 为真值的元素组成的新数组 */
function myFilter(arr, fn) {
  throw new Error('14 myFilter 未作答')
}

/** 作答区 3：myReduce(arr, fn, init) —— 不传 init 时以首元素为初值；空数组无初值应抛错 */
function myReduce(arr, fn, init) {
  throw new Error('14 myReduce 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'myMap：回调收到 (item, index, arr)，返回新数组、不改原数组',
    run: async () => {
      const src = [1, 2, 3]
      const seen = []
      const out = myMap(src, (item, index, arr) => {
        seen.push([item, index, arr === src])
        return item * 2
      })
      assertEqual(out, [2, 4, 6], '返回值不对')
      assertEqual(seen, [[1, 0, true], [2, 1, true], [3, 2, true]], '回调参数不对（漏了 index 或原数组？）')
      assertEqual(src, [1, 2, 3], '不应修改原数组')
    },
  },
  {
    name: 'myFilter：按真值筛选且不改原数组',
    run: async () => {
      const src = [1, 0, 2, '', 3, null]
      assertEqual(myFilter(src, (x) => x), [1, 2, 3], '筛选结果不对')
      assertEqual(myFilter(src, (x, i) => i % 2 === 0), [1, 2, 3], '按下标筛选不对')
      assertEqual(src, [1, 0, 2, '', 3, null], '不应修改原数组')
    },
  },
  {
    name: 'myReduce：带初值 / 不带初值',
    run: async () => {
      assertEqual(myReduce([1, 2, 3], (acc, x) => acc + x, 0), 6, '带初值')
      assertEqual(myReduce([1, 2, 3], (acc, x) => acc + x, 10), 16, '初值参与累积')
      assertEqual(myReduce([1, 2, 3], (acc, x) => acc + x), 6, '不带初值应以首元素为初值')
      assertEqual(myReduce(['a'], (acc, x) => acc + x), 'a', '单元素不带初值应返回该元素')
    },
  },
  {
    name: 'myReduce：空数组且无初值应抛错（与原生一致）',
    run: async () => {
      let threw = false
      try {
        myReduce([], (acc, x) => acc + x)
      } catch (err) {
        threw = true
      }
      assertEqual(threw, true, '空数组无初值应抛 TypeError')
      assertEqual(myReduce([], (acc, x) => acc + x, 5), 5, '空数组带初值应返回初值')
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

// 直接跑：node plan/week-04/d2/14-array-methods.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 14 数组方法', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { myMap, myFilter, myReduce }
