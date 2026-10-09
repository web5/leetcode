/**
 * 模板 01：二分查找（精确值 / 找边界 / 二分答案）
 *
 * 什么时候用：
 *  - 数组有序（或可通过某种变换视为有序）→ 变体 A、B
 *  - 题目出现「最小化最大值」「最大化最小值」「至少/最多满足……的最小……」
 *    → 答案空间单调，用变体 C（二分答案）
 *
 * 统一骨架：left/right 界定「答案所在区间」，每轮判断后**丢弃不可能的一半**。
 * 只有两件事要定：
 *  ① 区间开闭（决定 while 用 < 还是 <=）
 *  ② mid 的判定把哪一半丢掉（决定能不能把 mid 排除）
 *
 * 易错点：
 *  ① 左闭右闭 [l, r] → while (l <= r)；左闭右开 [l, r) → while (l < r)
 *  ② mid 取 l + ((r - l) >> 1)，避免 (l + r) 溢出
 *  ③ 返回的是「下标」还是「待插入位置」要明确（lowerBound 找不到返回 length）
 *  ④ 二分答案的 check 必须是单调的：check(x) 为真 ⇒ check(x+1) 也为真
 *
 * 复杂度：时间 O(log n)（二分答案 O(n log(range))），空间 O(1)
 */

// 变体 A：左闭右闭 [l, r]，找精确值，找不到返回 -1
function binarySearch(nums, target) {
  let l = 0
  let r = nums.length - 1
  while (l <= r) {
    const mid = l + ((r - l) >> 1)
    if (nums[mid] === target) return mid
    if (nums[mid] < target) l = mid + 1
    else r = mid - 1
  }
  return -1
}

// 变体 B1：lower_bound —— 第一个 >= target 的下标（全小于则返回 nums.length）
// 等价语义：target 的插入位置（左）
function lowerBound(nums, target) {
  let l = 0
  let r = nums.length // [l, r)
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (nums[mid] < target) l = mid + 1 // mid 不可能是答案，排除
    else r = mid // mid 可能是答案，保留
  }
  return l
}

// 变体 B2：upper_bound —— 第一个 > target 的下标
// 用法：区间 [target 的左边界, 右边界] = [lowerBound, upperBound - 1]
function upperBound(nums, target) {
  let l = 0
  let r = nums.length
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (nums[mid] <= target) l = mid + 1
    else r = mid
  }
  return l
}

// 变体 C：二分答案（最小化可行值）
// feasible(x) 为真 => 更大的 x 也一定为真（单调）。答案空间是整数区间 [lo, hi]。
// 求「最大化可行值」时：改成 if (feasible(mid)) lo = mid; else hi = mid - 1（注意 mid 取上中位防死循环）
function binarySearchAnswer(lo, hi, feasible) {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    if (feasible(mid)) hi = mid // mid 可行，答案 <= mid
    else lo = mid + 1 // mid 不可行，答案 > mid
  }
  return lo
}

module.exports = { binarySearch, lowerBound, upperBound, binarySearchAnswer }

// 验证题：problems/binary-search/034-find-first-and-last-position-of-element-in-sorted-array.md
// 变体题：33 搜索旋转排序数组、153 找最小值、162 找峰值、875 爱吃香蕉（二分答案）
