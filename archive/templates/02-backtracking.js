/**
 * 模板 02：回溯（子集 / 组合 / 排列 三种原型）
 *
 * 什么时候用：要求「列举所有方案」（所有子集、所有排列、所有合法的切割/棋盘摆放）。
 * 关键词：返回所有可能、方案总数（数小）。若只求最优值，优先考虑 DP/贪心。
 *
 * 统一骨架（背这一段就够）：
 *   function dfs(路径, 选择列表) {
 *     if (满足结束条件) { 结果.push(路径.slice()); return }
 *     for (const 选择 of 选择列表) {
 *       做选择（修改路径 / 标记 used）
 *       dfs(路径, 新的选择列表)
 *       撤销选择（回溯）
 *     }
 *   }
 *
 * 三种原型的差别只在两处：
 *  ① 结果收集的位置：子集在**每个节点**收，组合/排列在**叶子**收
 *  ② 用 start 还是 used 控制选择列表：
 *     组合/子集 → start（保证元素顺序，天然去重，元素不回头）
 *     排列     → used 数组（元素可回头，但要防重复使用）
 *
 * 去重（含重复元素）三步：排序 → 同层跳过相同值 → 用 `i > start` 区分「同层」与「同分支」
 * 剪枝：先排序，再比较剩余元素能否凑够（如组合总和里 if (sum > target) break）
 *
 * 复杂度：子集 O(2^n · n)、排列 O(n! · n)、组合 O(C(n,k) · k)
 */

// 原型 1：子集（每个节点都是答案）
function subsets(nums) {
  const res = []
  const path = []

  const dfs = (start) => {
    res.push(path.slice()) // 进来先收，因此包含空集
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i])
      dfs(i + 1) // 下一层从 i+1 开始，元素不重复用、不回退
      path.pop()
    }
  }

  dfs(0)
  return res
}

// 原型 2：组合总和（叶子是答案 + 剪枝；含重复元素时先去重）
// 这里演示「元素可重复选取」（内层传 i 而非 i+1）
function combinationSum(candidates, target) {
  const res = []
  const path = []
  const nums = candidates.slice().sort((a, b) => a - b)

  const dfs = (start, rest) => {
    if (rest === 0) {
      res.push(path.slice())
      return
    }
    for (let i = start; i < nums.length; i++) {
      if (nums[i] > rest) break // 已排序 → 后面更大，直接剪枝
      path.push(nums[i])
      dfs(i, rest - nums[i]) // 传 i：允许重复选取当前元素
      path.pop()
    }
  }

  dfs(0, target)
  return res
}

// 原型 3：全排列（used 标记 + 同层去重）
function permute(nums) {
  const res = []
  const path = []
  const used = new Array(nums.length).fill(false)
  const arr = nums.slice().sort((a, b) => a - b) // 去重需要有序

  const dfs = () => {
    if (path.length === arr.length) {
      res.push(path.slice())
      return
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue
      // 同层去重：与前一个未使用元素相同 → 跳过（保证重复值只按固定顺序用一次）
      if (i > 0 && arr[i] === arr[i - 1] && !used[i - 1]) continue
      used[i] = true
      path.push(arr[i])
      dfs()
      path.pop()
      used[i] = false
    }
  }

  dfs()
  return res
}

module.exports = { subsets, combinationSum, permute }
