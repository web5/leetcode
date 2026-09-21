const { log } = require("console")

/**
 *
 * @param
 *
 # 239. 滑动窗口最大值（困难）

> https://leetcode.cn/problems/sliding-window-maximum/
> 标签：队列、数组、滑动窗口、单调队列、堆（优先队列）
> 答案：[solutions/239-sliding-window-maximum.js](../../solutions/239-sliding-window-maximum.js)

## 题目描述

给你一个整数数组 `nums`，有一个大小为 `k` 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 `k` 个数字。滑动窗口每次只向右移动一位。

返回 *滑动窗口中的最大值* 。

## 示例

**示例 1：**
- 输入：`nums = [1,3,-1,-3,5,3,6,7], k = 3`
- 输出：`[3,3,5,5,6,7]`
- 解释：

```
滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

**示例 2：**
- 输入：`nums = [1], k = 1`
- 输出：`[1]`

## 提示

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `1 <= k <= nums.length`

## 官方提示

1. 不妨考虑使用双端队列（deque）？
2. 队列大小不必与窗口大小相同。
3. 去除冗余元素，队列中只保留需要考虑的元素。

## 备注

官方页面无「进阶（Follow up）」段落。本题的核心是把「每个窗口线性找最大值」的 O(n·k) 优化到 O(n)——`n = 10^5` 时暴力解会超时。

 */
function maxSlidingWindow(nums, k) {
  const res = []
  let head = 0 // 队首指针：q[head] 是当前窗口最大值的下标
  const deque = [] // 每往前看一个数，deque 队尾就是当前窗口的最大值
  for(let i = 0; i < nums.length; i++) {
    const num = nums[i]
    while(deque.length && nums[deque[deque.length - 1]] < num) {
      // 如果发现队尾比当前值小，则把队尾弹出
      deque.pop()
    }
    // 把当前值加入队尾(当前队尾最大)
    deque.push(i)
    // 当窗口满了，左侧的值已经不再是窗口内的值，则把左侧的值弹出，左侧窗口滑出
    if(deque[head] <= i - k) { // 注意 head 是下标，不是长度，deque还会一直变大
      head++
    }
    // 如果当前窗口已经满了，则把队头（即最大值）加入结果， 找到了当前窗口最大的值
    if(i >= k - 1) {
      res.push(nums[deque[0]])
    }
    // 队首废弃元素过多时压缩一次，让容器规模与窗口同阶
    if (head > 0 && head * 2 >= q.length) {
      q.splice(0, head) // 删除队首废弃元素
      head = 0
    }
  }
  return res
}

const nums = [1,3,-1,-3,5,3,6,7], k = 3
const res = maxSlidingWindow(nums, k)
console.log('res>>>', res)
