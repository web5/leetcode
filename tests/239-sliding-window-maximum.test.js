const { maxSlidingWindow } = require('../solutions/239-sliding-window-maximum')

describe('239. 滑动窗口最大值', () => {
  test('示例 1：[1,3,-1,-3,5,3,6,7], k = 3 → [3,3,5,5,6,7]', () => {
    expect(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)).toEqual([
      3, 3, 5, 5, 6, 7,
    ])
  })

  test('示例 2：[1], k = 1 → [1]', () => {
    expect(maxSlidingWindow([1], 1)).toEqual([1])
  })

  test('边界：k = nums.length，只有一个窗口', () => {
    expect(maxSlidingWindow([1, 3, -1, -3], 4)).toEqual([3])
  })

  test('单调递减：每个窗口最大值都是左端', () => {
    expect(maxSlidingWindow([5, 4, 3, 2, 1], 2)).toEqual([5, 4, 3, 2])
  })

  test('单调递增：每个窗口最大值都是右端', () => {
    expect(maxSlidingWindow([1, 2, 3, 4], 2)).toEqual([2, 3, 4])
  })

  test('含重复值：队尾弹出条件取 <= 不漏解', () => {
    expect(maxSlidingWindow([1, 2, 2, 1], 3)).toEqual([2, 2])
  })

  test('含负数：最值本身可以是负数', () => {
    expect(maxSlidingWindow([-7, -8, 7, 5, 7, 1], 3)).toEqual([7, 7, 7, 7])
  })

  test('性能：n = 10^5 递增序列（暴力 O(n·k) 会超时）', () => {
    const n = 100000
    const nums = Array.from({ length: n }, (_, i) => i)
    const res = maxSlidingWindow(nums, 1000)
    expect(res.length).toBe(n - 1000 + 1)
    expect(res[0]).toBe(999)
    expect(res[res.length - 1]).toBe(n - 1)
  })
})
