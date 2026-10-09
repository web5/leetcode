# 94. 二叉树的中序遍历（简单）

> https://leetcode.cn/problems/binary-tree-inorder-traversal/
> 标签：栈、树、深度优先搜索、二叉树
> 答案：[solutions/094-binary-tree-inorder-traversal.js](../../solutions/094-binary-tree-inorder-traversal.js)
> 关联模板：[templates/08-tree-traversal.js](../../templates/08-tree-traversal.js)

## 题目描述

给定一个二叉树的根节点 `root`，返回 **它的中序遍历**。

## 示例

**示例 1：**
- 输入：`root = [1,null,2,3]`
- 输出：`[1,3,2]`

**示例 2：**
- 输入：`root = []`
- 输出：`[]`

**示例 3：**
- 输入：`root = [1]`
- 输出：`[1]`

## 提示

- 树中节点数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

**进阶：** 递归算法很简单，你可以通过迭代算法完成吗？

## 为什么它是模板 08 的验证题

题目本身很简单，价值全在**进阶**那一行：面试官几乎一定会追问「不用递归怎么写」。中序迭代是四种遍历里最绕、也最值得背的：

```js
while (cur || st.length > 0) {
  while (cur) { st.push(cur); cur = cur.left }  // 一路向左压栈
  cur = st.pop(); res.push(cur.val)             // 弹出即访问
  cur = cur.right                               // 转向右子树
}
```

两个必须理解的点：

1. **为什么能替代递归**：递归调用栈里的「待返回的节点」就是这里的 `st`，`cur` 是当前正在下钻的指针；
2. **为什么中序是 BST 的命门**：中序遍历 BST 得到升序序列，于是 [98 验证 BST](https://leetcode.cn/problems/validate-binary-search-tree/)、[230 BST 第 K 小](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/) 都能在它上面加一行判断解决。

**配套做**：用同一套思路写 144（前序）、145（后序，逆序技巧）、102（层序），四个一起背才形成肌肉记忆。
