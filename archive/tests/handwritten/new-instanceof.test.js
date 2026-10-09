const { myNew, myInstanceof } = require('../../handwritten/new-instanceof')

describe('手撕 03 · myNew', () => {
  test('创建实例、绑定属性、原型方法可用', () => {
    function Person(name) {
      this.name = name
    }
    Person.prototype.say = function () {
      return `hi ${this.name}`
    }

    const p = myNew(Person, 'tom')
    expect(p.name).toBe('tom')
    expect(p.say()).toBe('hi tom')
    expect(p instanceof Person).toBe(true)
  })

  test('多个参数正确传入', () => {
    function Point(x, y) {
      this.x = x
      this.y = y
    }
    const p = myNew(Point, 1, 2)
    expect([p.x, p.y]).toEqual([1, 2])
  })

  test('构造函数返回引用类型 → 以返回值为准', () => {
    function Factory() {
      this.ignored = true
      return { custom: true }
    }
    expect(myNew(Factory)).toEqual({ custom: true })
  })

  test('构造函数返回原始值 → 忽略返回值', () => {
    function Factory() {
      this.a = 1
      return 42
    }
    expect(myNew(Factory).a).toBe(1)
  })

  test('非函数抛 TypeError', () => {
    expect(() => myNew({})).toThrow(TypeError)
    expect(() => myNew()).toThrow(TypeError)
  })

  test('实例之间互不共享属性', () => {
    function Counter() {
      this.count = 0
    }
    const a = myNew(Counter)
    const b = myNew(Counter)
    a.count++
    expect(b.count).toBe(0)
  })
})

describe('手撕 03 · myInstanceof', () => {
  test('基础继承链（自身 / 父类 / 非父类）', () => {
    class A {}
    class B extends A {}
    expect(myInstanceof(new B(), B)).toBe(true)
    expect(myInstanceof(new B(), A)).toBe(true)
    expect(myInstanceof(new A(), B)).toBe(false)
  })

  test('内置类型：数组 / 函数 / Object / Date', () => {
    expect(myInstanceof([], Array)).toBe(true)
    expect(myInstanceof([], Object)).toBe(true)
    expect(myInstanceof(() => {}, Function)).toBe(true)
    expect(myInstanceof(new Date(), Date)).toBe(true)
  })

  test('原始值一律 false，null / undefined 不抛错', () => {
    expect(myInstanceof(1, Number)).toBe(false)
    expect(myInstanceof('a', String)).toBe(false)
    expect(myInstanceof(true, Boolean)).toBe(false)
    expect(myInstanceof(null, Object)).toBe(false)
    expect(myInstanceof(undefined, Object)).toBe(false)
  })

  test('与原生 instanceof 结果一致', () => {
    const samples = [[], {}, () => {}, new Date(), /a/, 1, 'x', null, undefined, true]
    for (const s of samples) {
      expect(myInstanceof(s, Object)).toBe(s instanceof Object)
    }
  })

  test('Object.create(null) 没有原型链，任何构造函数都不是它的父类', () => {
    const bare = Object.create(null)
    expect(myInstanceof(bare, Object)).toBe(false)
  })

  test('右操作数不是函数时抛 TypeError', () => {
    expect(() => myInstanceof({}, {})).toThrow(TypeError)
  })
})
