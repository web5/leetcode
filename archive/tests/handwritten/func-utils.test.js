const { curry, compose, pipe, once, memoize } = require('../../handwritten/func-utils')

describe('手撕 08 · curry 柯里化', () => {
  const add3 = (a, b, c) => a + b + c

  test('每次只传一个参数', () => {
    expect(curry(add3)(1)(2)(3)).toBe(6)
  })

  test('一次传多个参数', () => {
    expect(curry(add3)(1, 2)(3)).toBe(6)
    expect(curry(add3)(1)(2, 3)).toBe(6)
    expect(curry(add3)(1, 2, 3)).toBe(6)
  })

  test('多传参数也能执行（多余参数被 fn 忽略）', () => {
    expect(curry(add3)(1, 2, 3, 4)).toBe(6)
  })

  test('柯里化后的函数可以复用', () => {
    const addTo = curry((a, b, c) => `${a}-${b}-${c}`)('x')
    expect(addTo('y')('z')).toBe('x-y-z')
    expect(addTo('m', 'n')).toBe('x-m-n')
  })

  test('不改变原函数行为（直接全参调用）', () => {
    const fn = (a, b) => a * b
    expect(curry(fn)(3, 4)).toBe(12)
  })
})

describe('手撕 08 · compose / pipe', () => {
  const double = (x) => x * 2
  const plus1 = (x) => x + 1
  const toStr = (x) => `[${x}]`

  test('compose 从右向左执行', () => {
    expect(compose(double, plus1)(3)).toBe(8) // double(plus1(3))
    expect(compose(plus1, toStr)(3)).toBe('[3]1') // 字符串链：plus1 拿到的是 toStr 的结果
  })

  test('pipe 从左向右执行', () => {
    expect(pipe(double, plus1)(3)).toBe(7) // plus1(double(3))
  })

  test('空组合返回原值', () => {
    expect(compose()(5)).toBe(5)
    expect(pipe()(5)).toBe(5)
  })

  test('单函数组合等价于直接调用', () => {
    expect(compose(double)(4)).toBe(8)
    expect(pipe(double)(4)).toBe(8)
  })

  test('字符串处理链', () => {
    const trim = (s) => s.trim()
    const upper = (s) => s.toUpperCase()
    const exclaim = (s) => `${s}!`
    expect(pipe(trim, upper, exclaim)('  hi  ')).toBe('HI!')
    expect(compose(exclaim, upper, trim)('  hi  ')).toBe('HI!')
  })
})

describe('手撕 08 · once', () => {
  test('只执行一次，后续返回首次结果', () => {
    const fn = jest.fn(() => Math.random())
    const f = once(fn)
    const first = f()
    expect(f()).toBe(first)
    expect(f()).toBe(first)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('返回 undefined 也算已执行过（不能靠返回值判断）', () => {
    const fn = jest.fn()
    const f = once(fn)
    f()
    f()
    f()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('参数透传（只有首次的参数生效）', () => {
    const fn = jest.fn((x) => x * 2)
    const f = once(fn)
    expect(f(2)).toBe(4)
    expect(f(100)).toBe(4)
    expect(fn).toHaveBeenCalledWith(2)
  })
})

describe('手撕 08 · memoize', () => {
  test('相同参数只计算一次', () => {
    const fn = jest.fn((n) => n * 2)
    const memo = memoize(fn)
    expect(memo(2)).toBe(4)
    expect(memo(2)).toBe(4)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(memo(3)).toBe(6)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('支持自定义 key 解析函数', () => {
    const fn = jest.fn((a, b) => a + b)
    const memo = memoize(fn, (a, b) => `${a}|${b}`)
    memo(1, 2)
    memo(1, 2)
    memo(2, 1)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('缓存可清空（暴露 cache）', () => {
    const fn = jest.fn((n) => n)
    const memo = memoize(fn)
    memo(1)
    memo.cache.clear()
    memo(1)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('对象参数默认按引用做 key（说明为什么需要 resolver）', () => {
    const fn = jest.fn((obj) => obj.id)
    const memo = memoize(fn)
    memo({ id: 1 })
    memo({ id: 1 })
    expect(fn).toHaveBeenCalledTimes(2) // 引用不同 → 缓存未命中

    const byId = memoize(fn, (obj) => obj.id)
    byId({ id: 1 })
    byId({ id: 1 })
    expect(fn).toHaveBeenCalledTimes(3) // 只多算一次
  })
})
