// require 即完成对 Function.prototype 的挂载
require('../../handwritten/call-apply-bind')

describe('手撕 02 · myCall / myApply', () => {
  test('myCall：改变 this 指向并逐个传参', () => {
    const obj = { base: 10 }
    function add(a, b) {
      return this.base + a + b
    }
    expect(add.myCall(obj, 1, 2)).toBe(13)
  })

  test('myApply：用数组传参', () => {
    const obj = { base: 10 }
    function add(a, b) {
      return this.base + a + b
    }
    expect(add.myApply(obj, [1, 2])).toBe(13)
    expect(add.myApply(obj)).toBe(NaN) // 不传参数数组也不报错
  })

  test('返回值正常透传', () => {
    function f() {
      return { ok: true }
    }
    expect(f.myCall({})).toEqual({ ok: true })
  })

  test('用完就清理临时属性，不污染目标对象', () => {
    const obj = { keep: 1 }
    function f() {
      return 1
    }
    f.myCall(obj)
    expect(Object.getOwnPropertySymbols(obj)).toHaveLength(0)
    expect(Object.keys(obj)).toEqual(['keep'])
  })

  test('context 为 null / undefined 时 this 指向全局对象', () => {
    function whoami() {
      return this
    }
    expect(whoami.myCall(null)).toBe(globalThis)
    expect(whoami.myApply(undefined)).toBe(globalThis)
  })

  test('context 为原始值时被包装成对象', () => {
    function typeOfThis() {
      return typeof this
    }
    expect(typeOfThis.myCall(123)).toBe('object')
  })

  test('非函数上调用抛 TypeError', () => {
    expect(() => Function.prototype.myCall.call({}, null)).toThrow(TypeError)
  })
})

describe('手撕 02 · myBind', () => {
  test('固化 this 并支持预设参数（偏函数）', () => {
    const obj = { base: 10 }
    function add(a, b) {
      return this.base + a + b
    }
    const add10 = add.myBind(obj, 0)
    expect(add10(5)).toBe(15)
  })

  test('bind 不立即执行', () => {
    const fn = jest.fn()
    const bound = fn.myBind({})
    expect(fn).not.toHaveBeenCalled()
    bound()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('硬绑定：返回的函数再用 myCall 也改不了 this', () => {
    function whoAmI(a) {
      return this.base + a
    }
    const bound = whoAmI.myBind({ base: 1 })
    expect(bound.myCall({ base: 100 }, 1)).toBe(2)
  })

  test('new 调用时忽略 context，实例 instanceof 原构造函数', () => {
    function Point(x, y) {
      this.x = x
      this.y = y
    }
    Point.prototype.sum = function () {
      return this.x + this.y
    }

    const BoundPoint = Point.myBind(null, 3)
    const p = new BoundPoint(4)
    expect(p.x).toBe(3)
    expect(p.y).toBe(4)
    expect(p.sum()).toBe(7)
    expect(p instanceof Point).toBe(true)
  })

  test('多次 bind 逐层叠加参数', () => {
    function join(...args) {
      return args.join('-')
    }
    const a = join.myBind(null, 'a')
    const b = a.myBind(null, 'b')
    expect(b('c')).toBe('a-b-c')
  })
})
