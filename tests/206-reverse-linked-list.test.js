const {
  reverseList,
  reverseListRecursive,
} = require('../solutions/206-reverse-linked-list')
const { arrayToList, listToArray } = require('./helpers/linked-list')

describe('206. 反转链表', () => {
  test.each([
    [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]],
    [[1, 2], [2, 1]],
    [[], []],
  ])('迭代：%p → %p', (input, expected) => {
    expect(listToArray(reverseList(arrayToList(input)))).toEqual(expected)
  })

  test('递归写法：[1,2,3,4,5] → [5,4,3,2,1]', () => {
    expect(listToArray(reverseListRecursive(arrayToList([1, 2, 3, 4, 5])))).toEqual([
      5, 4, 3, 2, 1,
    ])
  })
})
