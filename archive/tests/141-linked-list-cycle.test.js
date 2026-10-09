const { hasCycle } = require('../solutions/141-linked-list-cycle')
const { arrayToList, arrayToListWithCycle } = require('./helpers/linked-list')

describe('141. 环形链表', () => {
  test('示例 1：[3,2,0,-4], pos = 1 → 有环', () => {
    expect(hasCycle(arrayToListWithCycle([3, 2, 0, -4], 1))).toBe(true)
  })

  test('示例 2：[1,2], pos = 0 → 有环（尾接回头节点）', () => {
    expect(hasCycle(arrayToListWithCycle([1, 2], 0))).toBe(true)
  })

  test('示例 3：[1], pos = -1 → 无环', () => {
    expect(hasCycle(arrayToListWithCycle([1], -1))).toBe(false)
  })

  test('边界：空链表、普通链表都无环', () => {
    expect(hasCycle(null)).toBe(false)
    expect(hasCycle(arrayToList([1, 2, 3]))).toBe(false)
  })
})
