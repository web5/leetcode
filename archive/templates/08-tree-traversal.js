/**
 * 模板 08：二叉树四序迭代遍历（前 / 中 / 后 / 层序）
 *
 * 为什么必须会迭代版：面试官常追加「不许用递归」，且递归深度受栈限制（链状树会爆栈）。
 *
 * 四种写法各记一句话：
 *  ① 前序（根左右）：栈，**先压右再压左**，弹出的顺序天然是根左右
 *  ② 中序（左根右）：一路向左压栈，弹一个 → 处理 → 转向右子树（BST 中序 = 升序，务必背牢）
 *  ③ 后序（左右根）：把前序改成「根右左」（先压左再压右），最后整体 reverse
 *  ④ 层序（BFS）：队列 + 「本层 size」分组，得到每层一个数组
 *
 * 易错点：
 *  ① 中序里 cur 与栈的配合：外层条件是 while (cur || st.length)，两个都要写
 *  ② 后序不能直接「左右根」压栈，reverse 法最省事
 *  ③ 层序用数组 + head 指针，不要 shift（O(n) 搬移）
 *
 * 复杂度：时间 O(n)，空间 O(h)（层序 O(w)，w 为最大宽度）
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

// ① 前序：根左右
function preorderTraversal(root) {
  const res = []
  const st = root ? [root] : []
  while (st.length > 0) {
    const node = st.pop()
    res.push(node.val)
    if (node.right) st.push(node.right) // 右先入栈 → 后弹出
    if (node.left) st.push(node.left)
  }
  return res
}

// ② 中序：左根右（BST 里得到升序序列）
function inorderTraversal(root) {
  const res = []
  const st = []
  let cur = root
  while (cur || st.length > 0) {
    while (cur) {
      st.push(cur)
      cur = cur.left // 一路向左
    }
    cur = st.pop()
    res.push(cur.val)
    cur = cur.right // 转向右子树
  }
  return res
}

// ③ 后序：左右根 = 「根右左」的逆序
function postorderTraversal(root) {
  const res = []
  const st = root ? [root] : []
  while (st.length > 0) {
    const node = st.pop()
    res.push(node.val)
    if (node.left) st.push(node.left) // 左先入栈 → 后弹出（得到根右左）
    if (node.right) st.push(node.right)
  }
  return res.reverse()
}

// ④ 层序：每层一个数组
function levelOrder(root) {
  if (!root) return []
  const res = []
  const q = [root]
  let head = 0
  while (head < q.length) {
    const size = q.length - head // 先记住本层节点数
    const level = []
    for (let i = 0; i < size; i++) {
      const node = q[head++]
      level.push(node.val)
      if (node.left) q.push(node.left)
      if (node.right) q.push(node.right)
    }
    res.push(level)
  }
  return res
}

module.exports = { TreeNode, preorderTraversal, inorderTraversal, postorderTraversal, levelOrder }

// 验证题：problems/binary-tree/094-binary-tree-inorder-traversal.md
// 变体题：144 / 145 前序后序、102 层序、199 右视图、98 验证 BST、230 BST 第 K 小
