const { canJump } = require('../solutions/055-jump-game')

describe('55. 跳跃游戏', () => {
  test('示例 1：[2,3,1,1,4] → 能到终点', () => {
    expect(canJump([2, 3, 1, 1, 4])).toBe(true)
  })

  test('示例 2：[3,2,1,0,4] → 被 0 卡住', () => {
    expect(canJump([3, 2, 1, 0, 4])).toBe(false)
  })

  test('边界：单个元素，本身就在最后一个下标', () => {
    expect(canJump([0])).toBe(true)
  })

  test('边界：一步到位', () => {
    expect(canJump([5, 0, 0, 0, 0])).toBe(true)
  })
})
