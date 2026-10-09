/**
 * 242. 有效的字母异位词（简单） · https://leetcode.cn/problems/valid-anagram/
 * 题干：plan/problems/hash-table/242-valid-anagram.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（各自排序后比较，O(n log n)）
 * 观察到的性质：____（异位词 = 每个字符出现次数完全相同）
 * 否掉：____（排序法不够好；用数组下标当计数桶为什么比 Map 更合适）
 * 最优：____（长度不等直接 false；26 位计数数组，一个加一个减，O(n)）
 * 易错：____（先比长度；减完必须全为 0，别只看中途）
 * ─────────────────────────────────────────────────
 */

/** 作答区：判断 t 是否是 s 的字母异位词 */
function isAnagram(s, t) {
  throw new Error('242 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: ['anagram', 'nagaram'], expected: true },
  { name: '示例 2', args: ['rat', 'car'], expected: false },
  { name: '单字符相同', args: ['a', 'a'], expected: true },
  { name: '长度不同', args: ['ab', 'a'], expected: false },
  { name: '同多集但长度相同', args: ['aacc', 'ccac'], expected: false },
  { name: '顺序完全反了', args: ['abcd', 'dcba'], expected: true },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(isAnagram) : isAnagram(...one.args))
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
  describe('242. 有效的字母异位词', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { isAnagram, CASES }
