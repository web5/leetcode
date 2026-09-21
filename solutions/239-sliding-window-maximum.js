/**
 * 239. 滑动窗口最大值（困难）
 * 题目：problems/sliding-window/239-sliding-window-maximum.md
 * 思路：单调双端队列，队列存「下标」，对应的值单调递减。
 *      ① 入队前：从队尾弹出所有 nums[队尾] <= nums[i] 的下标——
 *         新元素更大、且更晚过期，被弹出的元素永无出头之日；
 *      ② 出队：队首下标已滑出窗口（窗口是 [i-k+1, i]，即下标 <= i-k）就移除；
 *      ③ 队首即当前窗口最大值，窗口成型（i >= k-1）后每轮取一次。
 *      队列用「数组 + head 指针」模拟，避免 shift 的 O(n) 搬移开销。
 * 复杂度：时间 O(n)（每个下标最多进队、出队各一次），空间 O(k)
 */
function maxSlidingWindow(nums, k) {
  const q = [] // 存下标，对应 nums 的值单调递减
  let head = 0 // 队首指针：q[head] 是当前窗口最大值的下标
  const ans = []

  for (let i = 0; i < nums.length; i++) {
    // ① 队尾所有「不如新元素」的下标出队（用 <= 顺手处理重复值）
    while (q.length > head && nums[q[q.length - 1]] <= nums[i]) q.pop()
    q.push(i)

    // ② 队首已滑出窗口
    if (q[head] <= i - k) head++

    // ③ 窗口长度达到 k，队首即答案
    if (i >= k - 1) ans.push(nums[q[head]])

    // 队首废弃元素过多时压缩一次，让容器规模与窗口同阶
    if (head > 0 && head * 2 >= q.length) {
      q.splice(0, head)
      head = 0
    }
  }

  return ans
}

module.exports = { maxSlidingWindow }
