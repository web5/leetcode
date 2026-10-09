/**
 * 209. 长度最小的子数组（中等） · https://leetcode.cn/problems/minimum-size-subarray-sum/
 * 题干：plan/problems/sliding-window/209-minimum-size-subarray-sum.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（枚举起点 + 累加，O(n²)）
 * 观察到的性质：____（全是正整数 ⇒ 窗口和随右扩只增、随左缩只减，天然单调）
 * 否掉：____（能不能有负数？如果有负数这套还能用吗——这就是 76 和本题的分界）
 * 最优：____（可变长窗口 O(n)；进阶：前缀和 + 二分 O(n log n)）
 * 易错：____（收缩用 while 不是 if，要一直缩到不满足为止；res 初值取 Infinity）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回长度最小的和 ≥ target 的子数组长度，不存在返回 0 */
function minSubArrayLen(target, nums) {
  throw new Error('209 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [7, [2, 3, 1, 2, 4, 3]], expected: 2 },
  { name: '示例 2 单元素就够', args: [4, [1, 4, 4]], expected: 1 },
  { name: '示例 3 全加起来也不够', args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 },
  { name: '经典长数组', args: [15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]], expected: 2 },
  { name: '超大元素直接命中', args: [6, [10, 2, 3]], expected: 1 },
  { name: '需要三个 1', args: [3, [1, 1, 1, 1, 1, 1]], expected: 3 },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(minSubArrayLen) : minSubArrayLen(...one.args))
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
  describe('209. 长度最小的子数组', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { minSubArrayLen, CASES }
