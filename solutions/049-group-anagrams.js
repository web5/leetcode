/**
 * 49. 字母异位词分组（中等）
 * 题目：problems/hash-table/049-group-anagrams.md
 * 思路：排序后的字符串作为 key，异位词排序后 key 一定相同，用 Map 分组。
 * 复杂度：时间 O(n * m log m)（m 为字符串平均长度），空间 O(n * m)
 */
function groupAnagrams(strs) {
  const map = new Map()
  for (const s of strs) {
    const key = s.split('').sort().join('')
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(s)
  }
  return Array.from(map.values())
}

module.exports = { groupAnagrams }
