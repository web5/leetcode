const { EventEmitter } = require('../../handwritten/event-emitter')

describe('手撕 06 · EventEmitter', () => {
  test('on / emit 基本收发，支持多参数', () => {
    const ee = new EventEmitter()
    const fn = jest.fn()
    ee.on('data', fn)
    ee.emit('data', 1, 'a')
    expect(fn).toHaveBeenCalledWith(1, 'a')
  })

  test('emit 返回「是否有监听器」', () => {
    const ee = new EventEmitter()
    expect(ee.emit('nope')).toBe(false)
    ee.on('nope', () => {})
    expect(ee.emit('nope')).toBe(true)
  })

  test('多个监听器按注册顺序执行', () => {
    const ee = new EventEmitter()
    const order = []
    ee.on('e', () => order.push(1))
    ee.on('e', () => order.push(2))
    ee.emit('e')
    expect(order).toEqual([1, 2])
  })

  test('不同事件互不干扰', () => {
    const ee = new EventEmitter()
    const a = jest.fn()
    const b = jest.fn()
    ee.on('a', a)
    ee.on('b', b)
    ee.emit('a')
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).not.toHaveBeenCalled()
  })

  test('once 只触发一次，触发后自动注销', () => {
    const ee = new EventEmitter()
    const fn = jest.fn()
    ee.once('e', fn)
    ee.emit('e')
    ee.emit('e')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(ee.listenerCount('e')).toBe(0)
  })

  test('once 与 on 混用同一个函数：只移除 once 那一条', () => {
    const ee = new EventEmitter()
    const fn = jest.fn()
    ee.on('e', fn)
    ee.once('e', fn)
    ee.emit('e') // on 一次 + once 一次
    ee.emit('e') // 只剩 on
    expect(fn).toHaveBeenCalledTimes(3)
    expect(ee.listenerCount('e')).toBe(1)
  })

  test('on 返回的取消订阅函数可用', () => {
    const ee = new EventEmitter()
    const fn = jest.fn()
    const off = ee.on('e', fn)
    off()
    ee.emit('e')
    expect(fn).not.toHaveBeenCalled()
    expect(ee.listenerCount('e')).toBe(0)
  })

  test('off 只移除第一个匹配的监听器', () => {
    const ee = new EventEmitter()
    const fn = jest.fn()
    ee.on('e', fn)
    ee.on('e', fn)
    ee.off('e', fn)
    ee.emit('e')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('emit 期间新增的监听器不会在本轮被触发', () => {
    const ee = new EventEmitter()
    const late = jest.fn()
    ee.on('e', () => {
      ee.on('e', late)
    })
    ee.emit('e')
    expect(late).not.toHaveBeenCalled()
    ee.emit('e')
    expect(late).toHaveBeenCalledTimes(1)
  })

  test('listenerCount / removeAllListeners', () => {
    const ee = new EventEmitter()
    ee.on('a', jest.fn())
    ee.on('b', jest.fn())
    expect(ee.listenerCount('a')).toBe(1)

    ee.removeAllListeners('a')
    expect(ee.listenerCount('a')).toBe(0)
    expect(ee.listenerCount('b')).toBe(1)

    ee.removeAllListeners()
    expect(ee.listenerCount('b')).toBe(0)
  })

  test('监听器非函数时抛 TypeError', () => {
    const ee = new EventEmitter()
    expect(() => ee.on('e', 'not a function')).toThrow(TypeError)
    expect(() => ee.once('e', 123)).toThrow(TypeError)
  })

  test('this 指向 emitter 实例', () => {
    const ee = new EventEmitter()
    let self = null
    ee.on('e', function () {
      self = this
    })
    ee.emit('e')
    expect(self).toBe(ee)
  })

  test('实战形态：订阅 → 触发 3 次 → 取消订阅', () => {
    const ee = new EventEmitter()
    const logs = []
    const off = ee.on('tick', (n) => logs.push(`tick-${n}`))
    for (let i = 1; i <= 3; i++) ee.emit('tick', i)
    off()
    ee.emit('tick', 4)
    expect(logs).toEqual(['tick-1', 'tick-2', 'tick-3'])
  })
})
