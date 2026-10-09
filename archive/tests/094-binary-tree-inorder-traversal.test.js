const { inorderTraversal, inorderTraversalRecursive } = require('../solutions/094-binary-tree-inorder-traversal')
const { arrayToTree } = require('./helpers/binary-tree')

describe('94. 二叉树的中序遍历', () => {
  test('示例 1：root = [1,null,2,3] → [1,3,2]', () => {
    expect(inorderTraversal(arrayToTree([1, null, 2, 3]))).toEqual([1, 3, 2])
  })

  test('示例 2：空树 → []', () => {
    expect(inorderTraversal(arrayToTree([]))).toEqual([])
    expect(inorderTraversal(null)).toEqual([])
  })

  test('示例 3：单节点 → [1]', () => {
    expect(inorderTraversal(arrayToTree([1]))).toEqual([1])
  })

  test('满二叉树：[1,2,3,4,5,6,7] → [4,2,5,1,6,3,7]', () => {
    expect(inorderTraversal(arrayToTree([1, 2, 3, 4, 5, 6, 7]))).toEqual([4, 2, 5, 1, 6, 3, 7])
  })

  test('只有左子树的链状树（会爆递归栈的形态，迭代版必须能过）', () => {
    const n = 5000
    const chain = Array.from({ length: n }, (_, i) => i + 1)
    // 链：root.val = 1，一路向左到 val = n；中序 = 从最深的 n 一路读回 1
    const root = chain.reduceRight((child, val) => ({ val, left: child, right: null }), null)
    const res = inorderTraversal(root)
    expect(res).toHaveLength(n)
    expect(res[0]).toBe(n)
    expect(res[n - 1]).toBe(1)
    expect(res).toEqual(chain.slice().reverse())
  })

  test('迭代版与递归版结果一致', () => {
    const cases = [
      [1, null, 2, 3],
      [1],
      [1, 2, 3, 4, 5, 6, 7],
      [3, 1, 4, null, 2],
      [5, 3, 8, 1, 4, 7, 9],
    ]
    for (const arr of cases) {
      expect([arr, inorderTraversal(arrayToTree(arr))]).toEqual([arr, inorderTraversalRecursive(arrayToTree(arr))])
    }
  })

  test('BST 性质：中序遍历结果是升序（为 98 / 230 做铺垫）', () => {
    expect(inorderTraversal(arrayToTree([5, 3, 8, 1, 4, 7, 9]))).toEqual([1, 3, 4, 5, 7, 8, 9])
  })
})
