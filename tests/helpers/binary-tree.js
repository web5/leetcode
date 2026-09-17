const { TreeNode } = require('../../solutions/104-maximum-depth-of-binary-tree')

// 层序数组 -> 二叉树（LeetCode 的 [3,9,20,null,null,15,7] 表示法，null 表示空位）
function arrayToTree(arr) {
  if (!arr || arr.length === 0) return null
  const root = new TreeNode(arr[0])
  const queue = [root]
  let i = 1
  while (i < arr.length) {
    const node = queue.shift()
    if (arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i])
      queue.push(node.left)
    }
    i++
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i])
      queue.push(node.right)
    }
    i++
  }
  return root
}

module.exports = { arrayToTree }
