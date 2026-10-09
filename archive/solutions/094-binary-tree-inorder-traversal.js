/**
 * 94. 二叉树的中序遍历（简单）
 * 题目：problems/binary-tree/094-binary-tree-inorder-traversal.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 思路：题目进阶要求迭代版，递归版一并保留做对照。
 *
 * 迭代核心（四种遍历里最绕、也最该背的）：
 *   一路向左压栈 → 弹一个访问 → 转向右子树 → 右子树为空就继续弹栈
 *   递归调用栈里的「待返回节点」就是这里的 stack，cur 是正在下钻的指针。
 *
 * 为什么中序重要：BST 的中序遍历是升序序列，
 * 于是 98 验证 BST、230 BST 第 K 小、538 把 BST 转为累加树 都能在这一行上面加判断解决。
 *
 * 复杂度：时间 O(n)，空间 O(h)（h 为树高，链状树退化为 O(n)）
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

// 迭代版（题目要的答案）
function inorderTraversal(root) {
  const res = []
  const stack = []
  let cur = root

  while (cur || stack.length > 0) {
    while (cur) {
      stack.push(cur)
      cur = cur.left // 一路向左
    }
    cur = stack.pop()
    res.push(cur.val) // 弹出即访问
    cur = cur.right // 转向右子树
  }

  return res
}

// 递归版（对照用；面试若被要求「不许递归」直接给上面的迭代版）
function inorderTraversalRecursive(root) {
  const res = []
  const dfs = (node) => {
    if (!node) return
    dfs(node.left)
    res.push(node.val)
    dfs(node.right)
  }
  dfs(root)
  return res
}

module.exports = { TreeNode, inorderTraversal, inorderTraversalRecursive }
