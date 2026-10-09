const { deepClone } = require('../../handwritten/deep-clone')

describe('手撕 04 · deepClone', () => {
  test('嵌套对象/数组完全独立（改拷贝不影响原对象）', () => {
    const src = { a: 1, b: { c: [1, 2, { d: 3 }] } }
    const copy = deepClone(src)

    expect(copy).toEqual(src)
    expect(copy).not.toBe(src)
    expect(copy.b).not.toBe(src.b)
    expect(copy.b.c[2]).not.toBe(src.b.c[2])

    copy.b.c[2].d = 99
    expect(src.b.c[2].d).toBe(3)
  })

  test('原始值原样返回，函数按引用共享', () => {
    const fn = () => 1
    const src = { n: null, u: undefined, s: 'x', num: 0, f: fn }
    const copy = deepClone(src)
    expect(copy.n).toBeNull()
    expect(copy.u).toBeUndefined()
    expect(copy.s).toBe('x')
    expect(copy.f).toBe(fn)
  })

  test('Date / RegExp 保持类型与内容', () => {
    const d = new Date('2026-09-28T00:00:00Z')
    const r = /ab+c/gi
    const copy = deepClone({ d, r })

    expect(copy.d).toBeInstanceOf(Date)
    expect(copy.d).not.toBe(d)
    expect(copy.d.getTime()).toBe(d.getTime())

    expect(copy.r).toBeInstanceOf(RegExp)
    expect(copy.r.source).toBe('ab+c')
    expect(copy.r.flags).toBe('gi')
  })

  test('Map / Set 深拷贝（内部对象也是新对象）', () => {
    const src = { m: new Map([['k', { v: 1 }]]), s: new Set([{ v: 2 }]) }
    const copy = deepClone(src)

    expect(copy.m).toBeInstanceOf(Map)
    expect(copy.m.get('k')).toEqual({ v: 1 })
    expect(copy.m.get('k')).not.toBe(src.m.get('k'))

    expect(copy.s).toBeInstanceOf(Set)
    expect([...copy.s][0]).toEqual({ v: 2 })
    expect([...copy.s][0]).not.toBe([...src.s][0])
  })

  test('循环引用不栈溢出，且引用关系被保留', () => {
    const src = { name: 'root' }
    src.self = src
    src.child = { parent: src }

    const copy = deepClone(src)
    expect(copy).not.toBe(src)
    expect(copy.self).toBe(copy)
    expect(copy.child.parent).toBe(copy)
  })

  test('Symbol 键也会被拷贝', () => {
    const key = Symbol('k')
    const src = { [key]: { v: 1 } }
    const copy = deepClone(src)
    expect(copy[key]).toEqual({ v: 1 })
    expect(copy[key]).not.toBe(src[key])
  })

  test('class 实例拷贝后仍是同类实例', () => {
    class User {
      constructor(name) {
        this.name = name
      }
      greet() {
        return `hi ${this.name}`
      }
    }
    const copy = deepClone(new User('tom'))
    expect(copy).toBeInstanceOf(User)
    expect(copy.greet()).toBe('hi tom')
  })

  test('反例对照：JSON 方案会毁掉 Date，本实现不会', () => {
    const src = { d: new Date('2026-01-01T00:00:00Z'), f: () => 1 }
    expect(typeof JSON.parse(JSON.stringify(src)).d).toBe('string')
    expect(JSON.parse(JSON.stringify(src)).f).toBeUndefined()
    expect(deepClone(src).d).toBeInstanceOf(Date)
    expect(typeof deepClone(src).f).toBe('function')
  })
})
