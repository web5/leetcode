/**
 * 567. 字符串的排列（中等） · https://leetcode.cn/problems/permutation-in-string/
 * 题干：plan/problems/sliding-window/567-permutation-in-string.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（枚举所有长度 s1.length 的子串并比较计数）
 * 观察到的性质：____（和 438 同一个定长窗口模板，只是命中一次就能返回）
 * 否掉：____（能不能用双指针「不定长」？这题窗口长度必须固定，说明理由）
 * 最优：____（定长窗口 + 计数表差异量，O(n)；命中即 true 提前返回）
 * 易错：____（s1 比 s2 长直接 false；出窗口的元素要还原计数）
 * ─────────────────────────────────────────────────
 */

/** 作答区：判断 s2 是否包含 s1 的某个排列 */
function checkInclusion(s1, s2) {
  throw new Error('567 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: ['ab', 'eidbaooo'], expected: true },
  { name: '示例 2', args: ['ab', 'eidboaoo'], expected: false },
  { name: '单字符', args: ['a', 'a'], expected: true },
  { name: '窗口在末尾', args: ['adc', 'dcda'], expected: true },
  { name: '窗口在中间', args: ['abc', 'bbbca'], expected: true },
  { name: '字符数不够', args: ['aa', 'ab'], expected: false },
  { name: 's1 比 s2 长', args: ['abcd', 'ab'], expected: false },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(checkInclusion) : checkInclusion(...one.args))
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
  describe('567. 字符串的排列', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { checkInclusion, CASES }
