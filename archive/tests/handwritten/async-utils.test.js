const { sleep, retry, withTimeout, asyncSeries, asyncParallel } = require('../../handwritten/async-utils')

describe('手撕 11 · sleep', () => {
  test('至少等待指定时间', async () => {
    const start = Date.now()
    await sleep(20)
    expect(Date.now() - start).toBeGreaterThanOrEqual(15)
  })

  test('返回一个 Promise', () => {
    expect(sleep(0)).toBeInstanceOf(Promise)
  })
})

describe('手撕 11 · retry 重试', () => {
  test('失败后重试直到成功', async () => {
    let attempts = 0
    const value = await retry(
      async () => {
        attempts++
        if (attempts < 3) throw new Error('not yet')
        return 'ok'
      },
      { retries: 5 }
    )
    expect(value).toBe('ok')
    expect(attempts).toBe(3)
  })

  test('首次成功不触发重试', async () => {
    const fn = jest.fn(async () => 'first')
    expect(await retry(fn, { retries: 3 })).toBe('first')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('用尽次数后抛出最后一次错误（总尝试 = retries + 1）', async () => {
    let attempts = 0
    let caught = null
    await retry(
      async () => {
        attempts++
        throw new Error(`err${attempts}`)
      },
      { retries: 2 }
    ).catch((e) => {
      caught = e.message
    })
    expect(attempts).toBe(3)
    expect(caught).toBe('err3')
  })

  test('onError 能拿到错误与尝试序号', async () => {
    const seen = []
    await retry(
      async (attempt) => {
        if (attempt < 2) throw new Error(`e${attempt}`)
        return 'done'
      },
      { retries: 3, onError: (err, attempt) => seen.push([err.message, attempt]) }
    )
    expect(seen).toEqual([
      ['e0', 0],
      ['e1', 1],
    ])
  })

  test('指数退避按 delay * factor^attempt 等待', async () => {
    const stamps = []
    const start = Date.now()
    await retry(
      async (attempt) => {
        stamps.push(Date.now() - start)
        if (attempt < 2) throw new Error('retry')
        return 'ok'
      },
      { retries: 3, delay: 10, factor: 2 }
    )
    expect(stamps[0]).toBeLessThan(8) // 首次立即执行
    expect(stamps[1]).toBeGreaterThanOrEqual(8) // 约等 10ms
    expect(stamps[2]).toBeGreaterThanOrEqual(25) // 再等约 20ms（累计 ~30ms）
  })
})

describe('手撕 11 · withTimeout 超时控制', () => {
  test('按时完成则返回原值', async () => {
    expect(await withTimeout(sleep(5).then(() => 'done'), 50)).toBe('done')
  })

  test('超时则 reject 并带超时信息', async () => {
    let caught = null
    await withTimeout(sleep(50).then(() => 'late'), 10).catch((e) => {
      caught = e.message
    })
    expect(caught).toMatch(/Timeout/)
  })

  test('上游失败直接透传，不必等超时', async () => {
    let caught = null
    await withTimeout(Promise.reject(new Error('inner')), 1000).catch((e) => {
      caught = e.message
    })
    expect(caught).toBe('inner')
  })

  test('自定义超时消息', async () => {
    let caught = null
    await withTimeout(sleep(30), 5, '请求超时').catch((e) => {
      caught = e.message
    })
    expect(caught).toBe('请求超时')
  })
})

describe('手撕 11 · 串行与并行', () => {
  test('串行：按顺序执行，前一个完成才开下一个', async () => {
    const order = []
    const results = await asyncSeries([
      async () => {
        await sleep(20)
        order.push('a')
        return 1
      },
      async () => {
        order.push('b')
        return 2
      },
    ])
    expect(order).toEqual(['a', 'b'])
    expect(results).toEqual([1, 2])
  })

  test('并行：总耗时接近最慢的那个', async () => {
    const start = Date.now()
    await asyncParallel([() => sleep(30), () => sleep(30), () => sleep(30)])
    expect(Date.now() - start).toBeLessThan(80) // 串行会是 ~90ms 以上
  })

  test('两者都按入参顺序返回结果', async () => {
    const tasks = [
      async () => {
        await sleep(20)
        return 'slow'
      },
      async () => 'fast',
    ]
    expect(await asyncSeries(tasks)).toEqual(['slow', 'fast'])
    expect(await asyncParallel(tasks)).toEqual(['slow', 'fast'])
  })

  test('串行遇到失败立刻中断，后续任务不执行', async () => {
    const ran = []
    let caught = null
    await asyncSeries([
      async () => {
        ran.push(1)
        throw new Error('stop')
      },
      async () => {
        ran.push(2)
      },
    ]).catch((e) => {
      caught = e.message
    })
    expect(ran).toEqual([1])
    expect(caught).toBe('stop')
  })

  test('并行时任一失败整体 reject', async () => {
    let caught = null
    await asyncParallel([async () => 'ok', async () => {
      throw new Error('one failed')
    }]).catch((e) => {
      caught = e.message
    })
    expect(caught).toBe('one failed')
  })
})
