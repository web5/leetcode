/**
 * 274. H 指数（中等） · https://leetcode.cn/problems/h-index/
 * 题干：plan/problems/sorting/274-h-index.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（对每个候选 h 数「引用 ≥ h 的论文有几篇」，O(n²)）
 * 观察到的性质：____（升序排好后下标 i 代表什么？该从左还是从右扫）
 * 否掉：____（能不能不排序？排序消掉了哪一层枚举）
 * 最优：____（排序 + 单指针 O(n log n)；有余力补计数排序 O(n) 版）
 * 易错：____（h 的上界是 n 不是 max(citations)）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回 h 指数 */
function hIndex(citations) {
  throw new Error('274 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[3, 0, 6, 1, 5]], expected: 3 },
  { name: '示例 2', args: [[1, 3, 1]], expected: 1 },
  { name: '只有一篇 0 引用', args: [[0]], expected: 0 },
  { name: '只有一篇高引用', args: [[100]], expected: 1 },
  { name: '全 0', args: [[0, 0, 0]], expected: 0 },
  { name: '四篇都 4 引用', args: [[4, 4, 4, 4]], expected: 4 },
  { name: '严格递增', args: [[1, 2, 3, 4, 5]], expected: 3 },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(hIndex) : hIndex(...one.args))
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
  describe('274. H 指数', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { hIndex, CASES }
