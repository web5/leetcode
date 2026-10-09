/**
 * 1122. 数组的相对排序（简单） · https://leetcode.cn/problems/relative-sort-array/
 * 题干：plan/problems/sorting/1122-relative-sort-array.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（自定义比较函数 + 内置 sort）
 * 观察到的性质：____（值域只有 0..1000，比较排序的 O(n log n) 是浪费）
 * 否掉：____（比较函数写法的坑：不在 arr2 里的两个元素怎么比）
 * 最优：____（计数排序 O(n + k)）
 * 易错：____（arr2 里的元素在 arr1 中可能有多个，别只输出一个）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回重排后的新数组 */
function relativeSortArray(arr1, arr2) {
  throw new Error('1122 未作答')
}

/** 测试素材 */
const CASES = [
  {
    name: '示例 1',
    args: [[2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6]],
    expected: [2, 2, 2, 1, 4, 3, 3, 9, 6, 7, 19],
  },
  { name: '示例 2', args: [[28, 6, 22, 8, 44, 17], [22, 28, 8, 6]], expected: [22, 28, 8, 6, 17, 44] },
  { name: '末尾补升序', args: [[5, 3, 1], [3, 1]], expected: [3, 1, 5] },
  { name: '单元素', args: [[1], [1]], expected: [1] },
  { name: 'arr2 里的值有重复份数', args: [[7, 7, 7], [7]], expected: [7, 7, 7] },
  { name: '未出现的排后面', args: [[9, 8, 7, 6, 5], [5, 6]], expected: [5, 6, 7, 8, 9] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(relativeSortArray) : relativeSortArray(...one.args))
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
  describe('1122. 数组的相对排序', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { relativeSortArray, CASES }
