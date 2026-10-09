/**
 * 75. 颜色分类（中等） · https://leetcode.cn/problems/sort-colors/
 * 题干：plan/problems/sorting/075-sort-colors.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____
 * 观察到的性质：____（只有 3 种取值，这件事能怎么用）
 * 否掉：____（能不能直接调内置 sort？本题进阶为什么不让）
 * 最优：____（三路分区 / 双指针，写清指针语义与循环不变量）
 * 易错：____（换到右边后为什么不能 i++）
 * ─────────────────────────────────────────────────
 */

/** 作答区：原地排序，不需要返回值 */
function sortColors(nums) {
  throw new Error('075 未作答')
}

/** 测试素材：原地题用 run(fn) 返回被改写的入参 */
const CASES = [
  { name: '示例 1', run: (fn) => call(fn, [2, 0, 2, 1, 1, 0]), expected: [0, 0, 1, 1, 2, 2] },
  { name: '示例 2', run: (fn) => call(fn, [2, 0, 1]), expected: [0, 1, 2] },
  { name: '单个 0', run: (fn) => call(fn, [0]), expected: [0] },
  { name: '乱序混合', run: (fn) => call(fn, [1, 2, 0]), expected: [0, 1, 2] },
  { name: '全 2', run: (fn) => call(fn, [2, 2, 2]), expected: [2, 2, 2] },
]

// ── 以下不用改 ──────────────────────────────────────
function call(fn, nums) {
  const copy = [...nums]
  fn(copy)
  return copy
}
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(sortColors) : sortColors(...one.args))
}
function expectedOf(one) {
  return (one.norm || ((v) => v))(one.expected)
}

if (require.main === module) {
  let pass = 0
  for (const one of CASES) {
    try {
      const actual = actualOf(one)
      if (JSON.stringify(actual) === JSON.stringify(expectedOf(one))) {
        pass++
        console.log(`✅ ${one.name}`)
      } else {
        console.log(`❌ ${one.name}\n   期望 ${JSON.stringify(one.expected)}\n   实际 ${JSON.stringify(actual)}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

if (typeof describe === 'function') {
  describe('75. 颜色分类', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { sortColors, CASES }
