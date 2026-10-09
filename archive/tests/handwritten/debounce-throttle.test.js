const { debounce, throttle } = require('../../handwritten/debounce-throttle')

describe('手撕 01 · debounce 防抖', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('停止触发 wait 毫秒后只执行一次，参数取最后一次', () => {
    const fn = jest.fn()
    const d = debounce(fn, 100)
    d(1)
    d(2)
    d(3)
    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(3)
  })

  test('持续触发会不断延后执行', () => {
    const fn = jest.fn()
    const d = debounce(fn, 100)
    d()
    jest.advanceTimersByTime(80)
    d()
    jest.advanceTimersByTime(80)
    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(20)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('leading 模式：首次立即执行；trailing:false 时不再补一次', () => {
    const fn = jest.fn()
    const d = debounce(fn, 100, { leading: true, trailing: false })
    d(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1)
    d(2)
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('leading + trailing：首尾各执行一次', () => {
    const fn = jest.fn()
    const d = debounce(fn, 100, { leading: true, trailing: true })
    d(1)
    expect(fn).toHaveBeenCalledWith(1)
    d(2)
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(2)
  })

  test('cancel 之后不再执行', () => {
    const fn = jest.fn()
    const d = debounce(fn, 100)
    d()
    d.cancel()
    jest.advanceTimersByTime(500)
    expect(fn).not.toHaveBeenCalled()
  })

  test('flush 立刻执行挂起的那次调用', () => {
    const fn = jest.fn()
    const d = debounce(fn, 1000)
    d('a')
    d.flush()
    expect(fn).toHaveBeenCalledWith('a')
    jest.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(1) // 不会重复执行
  })

  test('this 与参数正确透传', () => {
    const ctx = { count: 0 }
    ctx.d = debounce(function (x) {
      this.count += x
    }, 50)
    ctx.d(2)
    ctx.d(3)
    jest.advanceTimersByTime(50)
    expect(ctx.count).toBe(3)
  })
})

describe('手撕 01 · throttle 节流', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('首次立即执行，冷却期内的重复调用不再执行', () => {
    const fn = jest.fn()
    const t = throttle(fn, 100)
    t(1)
    expect(fn).toHaveBeenCalledTimes(1)
    t(2)
    t(3)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('冷却结束后补一次 trailing 调用（参数为最后一次）', () => {
    const fn = jest.fn()
    const t = throttle(fn, 100)
    t(1)
    t(2)
    t(3)
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(3)
  })

  test('冷却结束后的新调用立刻执行', () => {
    const fn = jest.fn()
    const t = throttle(fn, 100)
    t(1)
    jest.advanceTimersByTime(100)
    t(2)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(2)
  })

  test('leading:false 时首次不执行，但在尾部补一次', () => {
    const fn = jest.fn()
    const t = throttle(fn, 100, { leading: false, trailing: true })
    t(1)
    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1)
  })

  test('trailing:false 时冷却期内的调用被丢弃', () => {
    const fn = jest.fn()
    const t = throttle(fn, 100, { leading: true, trailing: false })
    t(1)
    t(2)
    jest.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('长时间高频调用：调用次数约为 总时长 / wait 量级，不会每次都执行', () => {
    const fn = jest.fn()
    const t = throttle(fn, 100)
    for (let i = 0; i < 50; i++) {
      t(i)
      jest.advanceTimersByTime(20) // 1 秒内每 20ms 触发一次
    }
    expect(fn.mock.calls.length).toBeLessThanOrEqual(12) // 远小于 50
    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(8)
  })
})
