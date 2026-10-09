/**
 * 49. 字母异位词分组（中等）· 二刷 · https://leetcode.cn/problems/group-anagrams/
 * 题干（旧题，在归档区）：archive/problems/hash-table/049-group-anagrams.md
 * 已有答案（盲写完再看）：archive/solutions/049-group-anagrams.js · archive/tests/049-group-anagrams.test.js
 * 复现：一刷 ____（旧题） · 二刷 ____ · 三刷 ____
 *
 * ── 二刷规矩：限时 15 分钟盲写 ────────────
 * 核心一句话：____（异位词的「同一个 key」是什么）
 * 两种 key：____（① 单词内部排序后的字符串；② 26 位计数拼成 '1#0#2'；后者 O(n·k)，前者 O(n·k log k)）
 * 否掉：____（为什么不能两两比较？——O(n²·k)，且分组顺序无关这件事还得额外处理）
 * 易错：____（分组顺序与本组内元素顺序都无关，所以自测用 norm 归一；计数法拼 key 要带分隔符，别用 '102'）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回分组（组间顺序、组内顺序都不限） */
function groupAnagrams(strs) {
  throw new Error('049 groupAnagrams 未作答')
}

/** 测试素材：分组顺序无关 → norm 先排组内、再按组内首元素排组间 */
const CASES = [
  { name: '示例 1', args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']], norm: normGroups },
  { name: '示例 2：空字符串', args: [['']], expected: [['']], norm: normGroups },
  { name: '示例 3：单字符', args: [['a']], expected: [['a']], norm: normGroups },
  { name: '全都互为异位词', args: [['abc', 'cba', 'bca']], expected: [['abc', 'cba', 'bca']], norm: normGroups },
  { name: '全都不同', args: [['ab', 'cd', 'ef']], expected: [['ab'], ['cd'], ['ef']], norm: normGroups },
  { name: '长度不同但字母表相同', args: [['aab', 'aba', 'baa', 'ab']], expected: [['aab', 'aba', 'baa'], ['ab']], norm: normGroups },
  { name: '空串与单字符混排', args: [['', 'a', '']], expected: [['', ''], ['a']], norm: normGroups },
]

// ── 以下不用改 ──────────────────────────────────────
function normGroups(groups) {
  return groups
    .map((g) => [...g].sort())
    .sort((x, y) => x[0].localeCompare(y[0]))
}

function actualOf(one) {
  return normGroups(groupAnagrams(...one.args))
}
function expectedOf(one) {
  return normGroups(one.expected)
}

function runAll() {
  let pass = 0
  for (const one of CASES) {
    try {
      const actual = actualOf(one)
      if (JSON.stringify(actual) === JSON.stringify(expectedOf(one))) {
        pass++
        console.log(`✅ ${one.name}`)
      } else {
        console.log(`❌ ${one.name}\n   期望 ${JSON.stringify(expectedOf(one))}\n   实际 ${JSON.stringify(actual)}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

// 直接跑：node plan/week-01/d6/049-group-anagrams.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('49. 字母异位词分组（二刷）', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { groupAnagrams, CASES }
