/**
 * 78. 子集（中等）
 * 题目：problems/backtracking/078-subsets.md
 * 思路：回溯——每个位置「选 or 不选」。递归时先把当前路径收进结果，
 *      再从 start 开始逐个尝试追加后面的元素，回溯时弹出。
 * 复杂度：时间 O(n * 2^n)（共 2^n 个子集，每个最多拷贝 n 个元素），空间 O(n)
 */
function subsets(nums) {
  const res = []
  const path = []

  function dfs(start) {
    res.push([...path]) // 进入节点即是一个子集
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]) // 选
      dfs(i + 1)
      path.pop() // 撤销选择
    }
  }

  dfs(0)
  return res
}

module.exports = { subsets }
