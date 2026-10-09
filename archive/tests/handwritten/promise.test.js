const { MyPromise } = require('../../handwritten/promise')

describe('手撕 05 · 手写 Promise：状态机与 then 链', () => {
  test('resolve 后能 await 到值', async () => {
    const p = new MyPromise((resolve) => resolve(42))
    expect(await p).toBe(42)
  })

  test('异步 resolve（setTimeout）也能拿到', async () => {
    const p = new MyPromise((resolve) => setTimeout(() => resolve('ok'), 0))
    expect(await p).toBe('ok')
  })

  test('pending 期间注册的 then 会在 resolve 后全部执行', async () => {
    let resolveFn
    const p = new MyPromise((resolve) => {
      resolveFn = resolve
    })
    const seen = []
    p.then((v) => seen.push(['a', v]))
    p.then((v) => seen.push(['b', v]))
    resolveFn(1)
    await p
    await new Promise((r) => setTimeout(r, 0))
    expect(seen).toEqual([
      ['a', 1],
      ['b', 1],
    ])
  })

  test('then 返回新 Promise，支持链式调用', async () => {
    const result = await new MyPromise((resolve) => resolve(1))
      .then((v) => v + 1)
      .then((v) => v * 10)
    expect(result).toBe(20)
  })

  test('回调返回 Promise 会等待并透传', async () => {
    expect(await MyPromise.resolve(1).then((v) => MyPromise.resolve(v + 1))).toBe(2)
  })

  test('回调返回 thenable 会被递归展开', async () => {
    const thenable = { then: (resolve) => resolve('thenable-done') }
    expect(await MyPromise.resolve(1).then(() => thenable)).toBe('thenable-done')
  })

  test('executor 同步抛错 → 变成 rejected', async () => {
    let msg = null
    await new MyPromise(() => {
      throw new Error('boom')
    }).catch((e) => {
      msg = e.message
    })
    expect(msg).toBe('boom')
  })

  test('状态不可逆：先 resolve 后 reject 无效', async () => {
    const p = new MyPromise((resolve, reject) => {
      resolve('first')
      reject(new Error('late'))
    })
    expect(await p).toBe('first')
  })

  test('then 里抛错会被后续 catch 捕获', async () => {
    let caught = null
    await MyPromise.resolve(1)
      .then(() => {
        throw new Error('in then')
      })
      .catch((e) => {
        caught = e.message
      })
    expect(caught).toBe('in then')
  })

  test('catch 的返回值让链重新变成 fulfilled', async () => {
    expect(await MyPromise.reject(new Error('x')).catch(() => 'recovered')).toBe('recovered')
  })

  test('错误穿透：中间没有 onRejected 的 then 会被跳过', async () => {
    let caught = null
    await MyPromise.reject(new Error('pass-through'))
      .then((v) => v)
      .then((v) => v)
      .catch((e) => {
        caught = e.message
      })
    expect(caught).toBe('pass-through')
  })

  test('回调必须异步执行（A+ 要求，不能同步调用）', async () => {
    const order = []
    const p = new MyPromise((resolve) => resolve(1))
    p.then(() => order.push('then'))
    order.push('sync')
    await p
    await new Promise((r) => setTimeout(r, 0))
    expect(order).toEqual(['sync', 'then'])
  })

  test('then 返回自身构成循环 → TypeError', async () => {
    let caught = null
    const p = MyPromise.resolve(1)
    const p2 = p.then(() => p2)
    await p2.catch((e) => {
      caught = e
    })
    expect(caught).toBeInstanceOf(TypeError)
  })

  test('finally 不改变结果值，且在 rejected 时仍执行', async () => {
    let ran = 0
    expect(await MyPromise.resolve('v').finally(() => ran++)).toBe('v')
    expect(ran).toBe(1)

    let caught = null
    await MyPromise.reject(new Error('bad'))
      .finally(() => ran++)
      .catch((e) => {
        caught = e.message
      })
    expect(ran).toBe(2)
    expect(caught).toBe('bad')
  })
})

describe('手撕 05 · 手写 Promise：静态方法', () => {
  test('all：按入参顺序返回结果（不是完成顺序）', async () => {
    const slow = new MyPromise((resolve) => setTimeout(() => resolve('slow'), 5))
    const fast = MyPromise.resolve('fast')
    expect(await MyPromise.all([slow, fast, 3])).toEqual(['slow', 'fast', 3])
  })

  test('all：任一失败立刻失败', async () => {
    let caught = null
    await MyPromise.all([MyPromise.resolve(1), MyPromise.reject(new Error('fail'))]).catch((e) => {
      caught = e.message
    })
    expect(caught).toBe('fail')
  })

  test('all：空数组立刻成功', async () => {
    expect(await MyPromise.all([])).toEqual([])
  })

  test('allSettled：全部落定后返回状态列表', async () => {
    const res = await MyPromise.allSettled([MyPromise.resolve(1), MyPromise.reject(new Error('e'))])
    expect(res[0]).toEqual({ status: 'fulfilled', value: 1 })
    expect(res[1].status).toBe('rejected')
    expect(res[1].reason.message).toBe('e')
  })

  test('race：最快落定者决定结果（成功抢先）', async () => {
    const slow = new MyPromise((resolve) => setTimeout(() => resolve('slow'), 20))
    const fast = new MyPromise((resolve) => setTimeout(() => resolve('fast'), 1))
    expect(await MyPromise.race([slow, fast])).toBe('fast')
  })

  test('race：失败抢先也会 reject', async () => {
    let caught = null
    const slow = new MyPromise((resolve) => setTimeout(() => resolve('slow'), 50))
    const failing = new MyPromise((_, reject) => setTimeout(() => reject(new Error('first')), 5))
    await MyPromise.race([slow, failing]).catch((e) => {
      caught = e.message
    })
    expect(caught).toBe('first')
  })

  test('any：第一个成功者胜出（忽略失败）', async () => {
    expect(await MyPromise.any([MyPromise.reject(new Error('a')), MyPromise.resolve('ok')])).toBe('ok')
  })

  test('any：全部失败才失败', async () => {
    let caught = null
    await MyPromise.any([MyPromise.reject(new Error('a')), MyPromise.reject(new Error('b'))]).catch((e) => {
      caught = e
    })
    expect(caught).toBeInstanceOf(Error)
    expect(caught.message).toMatch(/All promises were rejected/)
  })

  test('resolve 直接返回已有实例，不包装两层', () => {
    const p = MyPromise.resolve(1)
    expect(MyPromise.resolve(p)).toBe(p)
  })

  test('与原生 Promise 互操作：await 同一条链', async () => {
    const value = await MyPromise.resolve(1)
      .then((v) => new Promise((r) => setTimeout(() => r(v + 1), 1)))
      .then((v) => MyPromise.resolve(v * 5))
    expect(value).toBe(10)
  })
})
