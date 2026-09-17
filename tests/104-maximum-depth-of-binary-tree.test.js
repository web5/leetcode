const { maxDepth } = require('../solutions/104-maximum-depth-of-binary-tree')
const { arrayToTree } = require('./helpers/binary-tree')

describe('104. 二叉树的最大深度', () => {
  test('示例 1：[3,9,20,null,null,15,7] → 3', () => {
    expect(maxDepth(arrayToTree([3, 9, 20, null, null, 15, 7]))).toBe(3)
  })

  test('示例 2：[1,null,2] → 2', () => {
    expect(maxDepth(arrayToTree([1, null, 2]))).toBe(2)
  })

  test('边界：空树 → 0，只有一个节点 → 1', () => {
    expect(maxDepth(arrayToTree([]))).toBe(0)
    expect(maxDepth(arrayToTree([1]))).toBe(1)
  })
})
