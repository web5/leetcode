/**
 * 438. 找到字符串中所有字母异位词（中等） · https://leetcode.cn/problems/find-all-anagrams-in-a-string/
 * 题干：plan/problems/sliding-window/438-find-all-anagrams-in-a-string.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（每个起点截子串 + 排序比较，O(n·k log k)）
 * 观察到的性质：____（窗口长度固定 = p.length ⇒ 定长窗口，进一个出一个）
 * 否掉：____（能不能用可变长窗口那套？为什么这里定长更直接）
 * 最优：____（定长窗口 + 计数表 + diff 差异量，diff == 0 即命中，O(n)）
 * 易错：____（进/出的先后顺序；p 比 s 长时直接返回 []）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回所有 p 的异位词子串的起始索引（顺序任意，用例按升序比对） */
function findAnagrams(s, p) {
  throw new Error('438 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: ['cbaebabacd', 'abc'], expected: [0, 6] },
  { name: '示例 2 前后缀重叠', args: ['abab', 'ab'], expected: [0, 1, 2] },
  { name: '命中在中间', args: ['baa', 'aa'], expected: [1] },
  { name: 'p 比 s 长', args: ['a', 'ab'], expected: [] },
  { name: '完全相同', args: ['aa', 'aa'], expected: [0] },
  { name: '整体就是一个异位词', args: ['abc', 'cba'], expected: [0] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(findAnagrams) : findAnagrams(...one.args))
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
  describe('438. 找到字符串中所有字母异位词', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { findAnagrams, CASES }
