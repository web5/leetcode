const { groupAnagrams } = require('../solutions/049-group-anagrams')

// 分组顺序无关，比较前先按组内元素排序
function normalize(groups) {
  return groups.map((g) => g.sort()).sort((a, b) => a[0].localeCompare(b[0]))
}

describe('49. 字母异位词分组', () => {
  test('示例 1：eat / tea / tan / ate / nat / bat', () => {
    const res = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
    expect(normalize(res)).toEqual(
      normalize([['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']])
    )
  })

  test('示例 2：空字符串', () => {
    expect(groupAnagrams([''])).toEqual([['']])
  })

  test('示例 3：单字符', () => {
    expect(groupAnagrams(['a'])).toEqual([['a']])
  })
})
