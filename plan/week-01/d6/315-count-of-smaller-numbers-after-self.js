/**
 * 315. 计算右侧小于当前元素的个数（困难） · https://leetcode.cn/problems/count-of-smaller-numbers-after-self/
 * 题干：plan/problems/sorting/315-count-of-smaller-numbers-after-self.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（对每个 i 往右数一遍，O(n²)，n=1e5 超时）
 * 观察到的性质：____（归并时「右边元素先出队」= 它比左边剩余元素都小，可一次性结算一批）
 * 否掉：____（能不能用静态前缀和/哈希计数？右侧是动态变化的）
 * 最优：____（归并排序 + 下标数组计数，O(n log n)）
 * 易错：____（搬的是下标不是值；相等时先取左边，保证「严格小于」）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回数组 counts */
function countSmaller(nums) {
  throw new Error('315 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[5, 2, 6, 1]], expected: [2, 1, 1, 0] },
  { name: '示例 2 单元素', args: [[-1]], expected: [0] },
  { name: '示例 3 两相同', args: [[-1, -1]], expected: [0, 0] },
  { name: '升序无贡献', args: [[1, 2, 3, 4]], expected: [0, 0, 0, 0] },
  { name: '降序全额贡献', args: [[4, 3, 2, 1]], expected: [3, 2, 1, 0] },
  { name: '混合', args: [[2, 0, 1]], expected: [2, 0, 0] },
  { name: '含负数', args: [[-5, -1, -5]], expected: [1, 1, 0] },
  { name: '重复值边界', args: [[3, 2, 1, 2, 1]], expected: [4, 2, 0, 1, 0] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(countSmaller) : countSmaller(...one.args))
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
  describe('315. 计算右侧小于当前元素的个数', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { countSmaller, CASES }
