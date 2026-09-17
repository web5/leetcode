/**
 * 104. 二叉树的最大深度（简单）
 * 题目：problems/binary-tree/104-maximum-depth-of-binary-tree.md
 * 思路：DFS 递归——当前深度 = max(左子树深度, 右子树深度) + 1。
 * 复杂度：时间 O(n)，空间 O(h)（递归栈，h 为树高）
 */

// LeetCode 平台会注入该结构，本地为了能跑用例自带一份
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val
  this.left = left === undefined ? null : left
  this.right = right === undefined ? null : right
}

function maxDepth(root) {
  if (!root) return 0
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}

module.exports = { TreeNode, maxDepth }
