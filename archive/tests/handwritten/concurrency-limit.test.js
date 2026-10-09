const { asyncPool, createLimiter } = require('../../handwritten/concurrency-limit')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('手撕 07 · asyncPool 批量限流', () => {
  test('结果顺序与入参一致（即使完成顺序相反）', async () => {
    const results = await asyncPool(3, [30, 10, 20], async (ms, i) => {
      await sleep(ms)
      return i
    })
    expect(results).toEqual([0, 1, 2])
  })

  test('并发数不超过上限', async () => {
    let active = 0
    let maxActive = 0
    await asyncPool(2, [1, 2, 3, 4, 5], async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await sleep(5)
      active--
    })
    expect(maxActive).toBe(2)
  })

  test('limit 大于任务数时不报错', async () => {
    expect(await asyncPool(10, [1, 2], async (x) => x * 2)).toEqual([2, 4])
  })

  test('空任务列表返回空数组', async () => {
    expect(await asyncPool(3, [], async () => 1)).toEqual([])
  })

  test('任务抛错时整体 reject', async () => {
    let caught = null
    await asyncPool(2, [1, 2, 3], async (x) => {
      if (x === 2) throw new Error('task 2 failed')
      return x
    }).catch((e) => {
      caught = e.message
    })
    expect(caught).toBe('task 2 failed')
  })

  test('iteratorFn 收到元素与下标', async () => {
    const seen = []
    await asyncPool(2, ['a', 'b'], async (item, index) => {
      seen.push([item, index])
    })
    expect(seen).toEqual([
      ['a', 0],
      ['b', 1],
    ])
  })

  test('limit = 1 时完全串行', async () => {
    const order = []
    await asyncPool(1, [1, 2, 3], async (x) => {
      await sleep(5)
      order.push(x)
    })
    expect(order).toEqual([1, 2, 3])
  })
})

describe('手撕 07 · createLimiter 动态限流（并发调度器）', () => {
  test('最多同时运行 limit 个任务', async () => {
    const run = createLimiter(2)
    let active = 0
    let maxActive = 0

    const tasks = Array.from({ length: 6 }, () =>
      run(async () => {
        active++
        maxActive = Math.max(maxActive, active)
        await sleep(5)
        active--
      })
    )

    await Promise.all(tasks)
    expect(maxActive).toBe(2)
  })

  test('结果各自回到自己的 Promise，不串台', async () => {
    const run = createLimiter(2)
    const results = await Promise.all([
      run(async () => {
        await sleep(10)
        return 'slow'
      }),
      run(async () => 'fast'),
      run(async () => 'third'),
    ])
    expect(results).toEqual(['slow', 'fast', 'third'])
  })

  test('任务失败只影响自己那一个 Promise，不阻塞后续', async () => {
    const run = createLimiter(1)
    const p1 = run(async () => {
      throw new Error('fail')
    })
    const p2 = run(async () => 'ok')

    let caught = null
    await p1.catch((e) => {
      caught = e.message
    })
    expect(caught).toBe('fail')
    expect(await p2).toBe('ok')
  })

  test('限流器能处理「边跑边追加」的任务', async () => {
    const run = createLimiter(2)
    const finished = []
    const promises = []

    const makeTask = (id) =>
      run(async () => {
        await sleep(5)
        finished.push(id)
        return id
      })

    promises.push(makeTask(1), makeTask(2), makeTask(3))
    promises.push(makeTask(4))
    const results = await Promise.all(promises)

    expect(results).toEqual([1, 2, 3, 4])
    expect(finished.sort((a, b) => a - b)).toEqual([1, 2, 3, 4])
  })

  test('对比：不限制并发时全部立刻开跑', async () => {
    let active = 0
    let maxActive = 0
    const tasks = Array.from({ length: 5 }, async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await sleep(5)
      active--
    })
    await Promise.all(tasks)
    expect(maxActive).toBe(5)
  })
})
