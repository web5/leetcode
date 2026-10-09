/**
 * 手撕 09：数组与字符串高频工具
 *
 * 五道题的共同套路：**双指针 / 逐位处理 / 正则**，都不难，但面试里写不干净最容易掉分。
 *  ① 扁平化 flatten：明确 depth 语义（默认 1 层；Infinity 表示完全拍平）
 *  ② 去重 uniqueBy：原始值用 Set，对象数组按 key 去重（面试常给「按 id 去重」的场景）
 *  ③ 大数相加 bigAdd：JS Number 精度上限 2^53-1，所以按字符串逐位加、处理进位
 *  ④ 千分位 thousandSeparator：正则 \B(?=(\d{3})+(?!\d)) 或 reverse 后每三位插逗号
 *  ⑤ 洗牌 shuffle：Fisher-Yates，从后往前与随机位置交换，保证每种排列等概率
 */

// ① 数组扁平化（depth = Infinity 时完全拍平）
function flatten(arr, depth = 1) {
  if (depth < 1) return arr.slice()
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) acc.push(...flatten(item, depth - 1))
    else acc.push(item)
    return acc
  }, [])
}

// ② 按 key 去重（不传 keyFn 时等价于 [...new Set(arr)]）
function uniqueBy(arr, keyFn = (x) => x) {
  const seen = new Set()
  const out = []
  for (const item of arr) {
    const key = keyFn(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

// ③ 大数相加：按字符串处理，返回十进制字符串（只处理非负整数；负数需先比大小再决定符号）
function bigAdd(a, b) {
  const x = String(a)
  const y = String(b)
  let i = x.length - 1
  let j = y.length - 1
  let carry = 0
  const digits = []

  while (i >= 0 || j >= 0 || carry > 0) {
    const dx = i >= 0 ? x.charCodeAt(i--) - 48 : 0
    const dy = j >= 0 ? y.charCodeAt(j--) - 48 : 0
    const sum = dx + dy + carry
    digits.push(sum % 10)
    carry = sum > 9 ? 1 : 0
  }

  return digits.reverse().join('')
}

// ④ 千分位（保留小数部分与符号）
function thousandSeparator(num) {
  const [intPart, decimalPart] = String(num).split('.')
  const sign = intPart.startsWith('-') ? '-' : ''
  const digits = sign ? intPart.slice(1) : intPart
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return sign + grouped + (decimalPart === undefined ? '' : `.${decimalPart}`)
}

// ⑤ Fisher-Yates 洗牌（不改入参）
function shuffle(arr) {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

module.exports = { flatten, uniqueBy, bigAdd, thousandSeparator, shuffle }
