/**
 * 76. 最小覆盖子串（困难）★ · https://leetcode.cn/problems/minimum-window-substring/
 * 题干：plan/problems/sliding-window/076-minimum-window-substring.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（枚举所有子串 × 判覆盖，O(n²·|Σ|)）
 * 观察到的性质：____（窗口越长越容易覆盖 ⇒ 覆盖性单调 ⇒ 右扩左缩）
 * 否掉：____（能不能不维护 need/matched，每次重新比对计数表？为什么退化）
 * 最优：____（可变长滑动窗口 + need 计数表 + matched，O(m + n)）
 * 易错：____（matched 只在「刚好补满某个字符的需求」时 +1；收缩时同步 -1）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回 s 中最短覆盖 t 的子串，没有则返回 '' */
function minWindow(s, t) {
  throw new Error('076 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
  { name: '示例 2 全串即答案', args: ['a', 'a'], expected: 'a' },
  { name: '示例 3 需求重复字符', args: ['a', 'aa'], expected: '' },
  { name: 't 只有一个字符', args: ['ab', 'b'], expected: 'b' },
  { name: '答案在开头', args: ['abcde', 'abc'], expected: 'abc' },
  { name: '需要包含重复次数', args: ['aaabc', 'aab'], expected: 'aab' },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(minWindow) : minWindow(...one.args))
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
  describe('76. 最小覆盖子串', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { minWindow, CASES }
