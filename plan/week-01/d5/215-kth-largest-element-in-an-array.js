/**
 * 215. 数组中的第 K 个最大元素（中等）★ 重刷（快速选择）· https://leetcode.cn/problems/kth-largest-element-in-an-array/
 * 题干（旧题，在归档区）：archive/problems/heap/215-kth-largest-element-in-an-array.md
 * 已有答案（盲写完再看）：archive/solutions/215-kth-largest-element-in-an-array.js · archive/tests/215-kth-largest-element-in-an-array.test.js
 * 复现：一刷 ____（旧题） · 二刷 ____ · 三刷 ____
 *
 * ── 本日目标：用「快速选择」重写（不是全排序）────────────
 * 下标换算：第 k 大 = 升序后的下标 ____（写出来；这题一半的错误都在这里）
 * 快速选择：____（分区后只递归「答案所在的那一侧」，平均 O(n)、最坏 O(n²)，随机 pivot 规避）
 * 否掉：____（全排序 O(n log n) 能做但没必要；小顶堆 O(n log k) 在 k 很小时更优——说清取舍）
 * 易错：____（重复值会让普通分区退化，考虑三路分区或双指针分区；别递归两侧）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回第 k 大的元素（不是第 k 大不同的元素，重复要算进去） */
function findKthLargest(nums, k) {
  throw new Error('215 findKthLargest 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1：[3,2,1,5,6,4], k = 2 → 5', args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
  { name: '示例 2：[3,2,3,1,2,4,5,5,6], k = 4 → 4（不去重）', args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
  { name: '单元素', args: [[7], 1], expected: 7 },
  { name: '边界：k = 1 取最大', args: [[2, 1], 1], expected: 2 },
  { name: '边界：k = n 取最小', args: [[2, 1], 2], expected: 1 },
  { name: '全相同（三路分区的考点）', args: [[2, 2, 2, 2, 2], 3], expected: 2 },
  { name: '大量重复', args: [[5, 5, 4, 4, 3, 3], 2], expected: 5 },
  { name: '含负数', args: [[-1, -5, -3], 2], expected: -3 },
  { name: '两个元素取第二大', args: [[9, 8], 2], expected: 8 },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const nums = one.args[0].slice() // 快速选择会原地分区，给副本
  return findKthLargest(nums, one.args[1])
}

function runAll() {
  let pass = 0
  for (const one of CASES) {
    try {
      const actual = actualOf(one)
      if (actual === one.expected) {
        pass++
        console.log(`✅ ${one.name}`)
      } else {
        console.log(`❌ ${one.name}：期望 ${one.expected}，实际 ${actual}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

// 直接跑：node plan/week-01/d5/215-kth-largest-element-in-an-array.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('215. 数组中的第 K 个最大元素（快速选择重写）', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toBe(one.expected))
  })
}

module.exports = { findKthLargest, CASES }
