/**
 * 46. 全排列（中等）
 * 题目：problems/backtracking/046-permutations.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 思路：回溯三原型里的「排列」分支。
 *  - 子集/组合用 start 控制选择列表（元素不回头、天然去重）
 *  - 排列用 used 标记（元素可回头，靠标记防重复使用）
 * 收集答案在**叶子**（path 长度等于数组长度），而不是每个节点。
 *
 * 关键细节：res.push(path.slice()) 必须 slice，否则存进去的是同一个数组引用，
 * 回溯结束后 res 里会是一堆空数组——这是回溯第一号 bug。
 *
 * 附：47 全排列 II（含重复数字）——排序 + 同层去重：
 *   if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue
 * 含义：同一层里若前一个相同值「还没被使用」，说明本层已经以它为分支走过了，跳过。
 *
 * 复杂度：时间 O(n! · n)（n! 个叶子，每个叶子拷贝长度 n），空间 O(n)
 */

function permute(nums) {
  const res = []
  const path = []
  const used = new Array(nums.length).fill(false)

  const dfs = () => {
    if (path.length === nums.length) {
      res.push(path.slice())
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(nums[i])

      dfs()

      path.pop() // 撤销选择
      used[i] = false
    }
  }

  dfs()
  return res
}

// 47. 全排列 II：输入可含重复数字，结果不能有重复排列
function permuteUnique(nums) {
  const arr = nums.slice().sort((a, b) => a - b) // 去重的前提是有序
  const res = []
  const path = []
  const used = new Array(arr.length).fill(false)

  const dfs = () => {
    if (path.length === arr.length) {
      res.push(path.slice())
      return
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue
      // 同层去重：前一个相同值未使用 → 本层已经走过这个分支
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

module.exports = { permute, permuteUnique }

if (require.main === module) {
  console.log('res>>>', permute([1, 2, 3]))
  console.log('res>>>', permuteUnique([1, 1, 2]))
}
