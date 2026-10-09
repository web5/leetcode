const { flatten, uniqueBy, bigAdd, thousandSeparator, shuffle } = require('../../handwritten/array-utils')

describe('手撕 09 · flatten 数组扁平化', () => {
  test('默认只拍平一层', () => {
    expect(flatten([1, [2, [3, [4]]]])).toEqual([1, 2, [3, [4]]])
  })

  test('指定深度', () => {
    expect(flatten([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]])
    expect(flatten([1, [2, [3, [4]]]], 0)).toEqual([1, [2, [3, [4]]]])
  })

  test('Infinity 完全拍平', () => {
    expect(flatten([1, [2, [3, [4, [5]]]]], Infinity)).toEqual([1, 2, 3, 4, 5])
  })

  test('不改动入参', () => {
    const src = [1, [2]]
    flatten(src)
    expect(src).toEqual([1, [2]])
  })

  test('空数组与无嵌套数组', () => {
    expect(flatten([])).toEqual([])
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
  })
})

describe('手撕 09 · uniqueBy 去重', () => {
  test('原始值去重', () => {
    expect(uniqueBy([1, 1, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  test('对象数组按 key 去重，保留首次出现', () => {
    const users = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ]
    expect(uniqueBy(users, (u) => u.id)).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ])
  })

  test('NaN 也能正确去重（Set 语义）', () => {
    expect(uniqueBy([NaN, NaN, 1])).toHaveLength(2)
  })

  test('不传 keyFn 时对对象按引用去重', () => {
    const obj = { a: 1 }
    expect(uniqueBy([obj, obj, { a: 1 }])).toHaveLength(2)
  })
})

describe('手撕 09 · bigAdd 大数相加', () => {
  test('普通相加返回字符串', () => {
    expect(bigAdd('1', '2')).toBe('3')
    expect(bigAdd(123, 456)).toBe('579')
  })

  test('进位连续传播', () => {
    expect(bigAdd('999', '1')).toBe('1000')
    expect(bigAdd('1', '999')).toBe('1000')
    expect(bigAdd('99999999999999999999', '1')).toBe('100000000000000000000')
  })

  test('超过 Number 安全整数范围仍精确', () => {
    expect(bigAdd('9007199254740991', '1')).toBe('9007199254740992')
    expect(bigAdd('9007199254740991', '2')).toBe('9007199254740993')
    expect(String(9007199254740991 + 2)).not.toBe('9007199254740993') // 原生 float 已经不准
  })

  test('0 + 0 与前导组合', () => {
    expect(bigAdd('0', '0')).toBe('0')
    expect(bigAdd('0', '100')).toBe('100')
  })

  test('超长数字串（31 位）相加：10^30 + (10^30 - 1) = 1999...9', () => {
    const a = '1' + '0'.repeat(30) // 10^30
    const b = '9'.repeat(30) // 10^30 - 1
    expect(bigAdd(a, b)).toBe('1' + '9'.repeat(30)) // 2 * 10^30 - 1
  })
})

describe('手撕 09 · thousandSeparator 千分位', () => {
  test('三位以内不加分隔符', () => {
    expect(thousandSeparator(0)).toBe('0')
    expect(thousandSeparator(99)).toBe('99')
    expect(thousandSeparator(999)).toBe('999')
  })

  test('按三位分组', () => {
    expect(thousandSeparator(1000)).toBe('1,000')
    expect(thousandSeparator(1234567)).toBe('1,234,567')
    expect(thousandSeparator('123456789')).toBe('123,456,789')
  })

  test('负数与小数', () => {
    expect(thousandSeparator(-1234567.891)).toBe('-1,234,567.891')
    expect(thousandSeparator('0.5')).toBe('0.5')
    expect(thousandSeparator(1234.5)).toBe('1,234.5')
  })
})

describe('手撕 09 · shuffle 洗牌', () => {
  test('元素多重集不变，且不改动入参', () => {
    const src = [1, 2, 3, 4, 5]
    const out = shuffle(src)
    expect(src).toEqual([1, 2, 3, 4, 5])
    expect(out.slice().sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5])
    expect(out).toHaveLength(5)
  })

  test('边界：空数组与单元素', () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle([1])).toEqual([1])
  })

  test('多次洗牌能产生不同排列（随机性弱验证）', () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8]
    const seen = new Set()
    for (let i = 0; i < 50; i++) seen.add(shuffle(src).join(','))
    expect(seen.size).toBeGreaterThan(1)
  })
})
