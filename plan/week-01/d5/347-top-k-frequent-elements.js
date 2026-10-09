/**
 * 347. 前 K 个高频元素（中等） · https://leetcode.cn/problems/top-k-frequent-elements/
 * 题干：plan/problems/heap/347-top-k-frequent-elements.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（哈希计数 + 全量排序取前 k，O(n log n)，过不了进阶）
 * 观察到的性质：____（频次最大不过 n，所以「频次」这个值域能用桶代替排序）
 * 否掉：____（大顶堆一次弹 k 个可以，但为什么小顶堆更优）
 * 最优：____（哈希计数 + 桶排序 O(n)；再写一遍小顶堆 O(n log k)）
 * 易错：____（桶数组长度要 n+1）；返回顺序任意，用例已按升序比对
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回频率前 k 高的元素（顺序任意） */
function topKFrequent(nums, k) {
  throw new Error('347 未作答')
}

/** 测试素材：题目允许任意顺序，norm 统一升序后再比对 */
const CASES = [
  { name: '示例 1', args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
  { name: '示例 2 单元素', args: [[1], 1], expected: [1] },
  { name: '示例 3', args: [[1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2], expected: [1, 2] },
  { name: '只有一个不同元素', args: [[4, 4, 4, 4], 1], expected: [4] },
  { name: 'k 等于不同元素个数', args: [[1, 2, 3, 4], 4], expected: [1, 2, 3, 4] },
  { name: '并列频次要能取满', args: [[5, 5, 6, 6, 7], 2], expected: [5, 6] },
  { name: '负数', args: [[-1, -1, 2, 2, 2, 3], 2], expected: [-1, 2] },
]

// ── 以下不用改 ──────────────────────────────────────
const asc = (list) => [...list].sort((a, b) => a - b)

function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(topKFrequent) : topKFrequent(...one.args))
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
  describe('347. 前 K 个高频元素', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { topKFrequent, CASES, asc }
