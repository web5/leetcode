#!/usr/bin/env node
/**
 * 刷题看板（时间维度）
 *
 * 把「算法题 + 手撕题」按**天**汇总（plan/week-XX/dN/ 一天一个目录），输出：
 *   ① 今天该做   —— 当前进度所在那一天的全部任务（新题 / 二刷 / 手撕）
 *   ② 逾期未二刷 —— 一刷后超过 2 天还没二刷（按逾期天数排序）
 *   ③ 待二刷     —— 一刷在 48 小时内
 *   ④ 二刷未过   —— 二刷标了 ✗，要回炉
 *   ⑤ 手撕进度   —— 同一编号的多份练习合并成一行（第 1 次 / 第 2 次 …）
 *
 * 用法：
 *   npm run review              # 全量（时间维度）
 *   npm run review:today        # 只看今天该做
 *   npm run review:overdue      # 只看逾期未二刷
 *   npm run review:hw           # 只看手撕进度
 *   npm run review -- 未开始     # 状态子串过滤（未开始 / 待二刷 / 已二刷 …）
 *
 * 「复现」字段写法见 plan/PLAN.md §5：
 *   复现：一刷 10-09 提示 · 二刷 10-11 独立 · 三刷 ____     （二刷没过写 ✗）
 *
 * 状态判定优先级：
 *   缺字段 → 未开始 → 已三刷 → 待二刷 → 二刷未过 → 已二刷
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', '..')
const PLAN_DIR = path.join(ROOT, 'plan')
const PLAN_MD = path.join(PLAN_DIR, 'PLAN.md')
const ARCHIVE_SOLUTIONS = path.join(ROOT, 'archive', 'solutions')

const DAY_MS = 24 * 60 * 60 * 1000
const OVERDUE_DAYS = 2 // 一刷后超过 2 天仍未二刷，视为逾期（对应计划里的 48 小时）

const STATUS = {
  NO_FIELD: '缺字段',
  NOT_STARTED: '未开始',
  TODO_SECOND: '待二刷',
  SECOND_FAILED: '二刷未过',
  SECOND_DONE: '已二刷',
  THIRD_DONE: '已三刷',
}
const PENDING = new Set([STATUS.NO_FIELD, STATUS.NOT_STARTED])

// ---------- 终端样式（非 TTY 或 NO_COLOR 时降级为纯文本）----------
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR
const paint = (code) => (text) => (useColor ? `\u001b[${code}m${text}\u001b[0m` : String(text))
const bold = paint(1)
const dim = paint(2)
const red = paint(31)
const green = paint(32)
const yellow = paint(33)
const cyan = paint(36)

// 中文按 2 个字符宽度对齐
const dispWidth = (s) => [...String(s)].reduce((n, c) => n + (/[\u2e80-\u9fff\uff00-\uffef]/.test(c) ? 2 : 1), 0)
const padTo = (s, width) => String(s) + ' '.repeat(Math.max(0, width - dispWidth(s)))

// ---------- 目录扫描 ----------
function safeReaddir(dir) {
  try {
    return fs.readdirSync(dir)
  } catch {
    return []
  }
}

// plan/week-XX/dN/（一天一个目录，算法与手撕混放）
function listDayDirs() {
  const out = []
  for (const w of safeReaddir(PLAN_DIR)) {
    const wm = w.match(/^week-(\d+)$/)
    if (!wm) continue
    const wPath = path.join(PLAN_DIR, w)
    for (const d of safeReaddir(wPath)) {
      const dm = d.match(/^d(\d+)$/)
      if (!dm) continue
      out.push({ week: Number(wm[1]), day: Number(dm[1]), dir: path.join(wPath, d) })
    }
  }
  return out.sort((a, b) => a.week - b.week || a.day - b.day)
}

// ---------- 解析「复现」字段 ----------
const DATE_RE = /(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}-\d{1,2})/
const FAIL_RE = /✗|×|✘|未过|没过|失败|卡住/

function toDate(token) {
  if (!token) return null
  const m = token.match(/^(?:(\d{4})-)?(\d{1,2})-(\d{1,2})$/)
  if (!m) return null
  const year = m[1] ? Number(m[1]) : new Date().getFullYear()
  return new Date(year, Number(m[2]) - 1, Number(m[3]))
}

function parseStage(segment, prefix) {
  const rest = segment.startsWith(prefix) ? segment.slice(prefix.length).trim() : segment.trim()
  const dateToken = (rest.match(DATE_RE) || [])[0] || null
  return {
    raw: segment.trim() || `${prefix}（缺失）`,
    dateToken,
    date: toDate(dateToken),
    failed: FAIL_RE.test(rest),
  }
}

function parseRecordLine(line) {
  const body = line.replace(/^\s*\*?\s*复现：/, '').trim()
  const parts = body.split('·').map((s) => s.trim()).filter(Boolean)
  const find = (prefix) => parts.find((p) => p.startsWith(prefix)) || ''
  return {
    body,
    first: parseStage(find('一刷'), '一刷'),
    second: parseStage(find('二刷'), '二刷'),
    third: parseStage(find('三刷'), '三刷'),
  }
}

function pickRecord(content) {
  const line = content.split('\n').find((l) => l.includes('复现：'))
  return line ? parseRecordLine(line) : null
}

// 算法题头部：` * 75. 颜色分类（中等） · https://...`
function parseAlgoHeading(content) {
  const m = content.match(/^\s*\*?\s*(\d+)\s*[.、]\s*(.+?)\s*[（(](简单|中等|困难)[）)]/m)
  if (m) return { id: Number(m[1]), title: m[2].trim(), level: m[3] }
  const m2 = content.match(/^\s*\*?\s*(\d+)\s*[.、]\s*(.+?)(?:\s*·|$)/m)
  if (m2) return { id: Number(m2[1]), title: m2[2].trim(), level: '未知' }
  return { id: 9999, title: '(未识别标题)', level: '未知' }
}

// 手撕题头部：` * 手撕 01：防抖 debounce / 节流 throttle（面试出现率最高）`
function parseHwHeading(content) {
  const m = content.match(/手撕\s*(\d+)\s*[：:]\s*([^\n（(·]+)/)
  if (!m) return null
  return { id: Number(m[1]), title: m[2].trim() }
}

function readItem(full, extra) {
  const content = fs.readFileSync(full, 'utf8')
  const hw = parseHwHeading(content)
  const base = { full, rel: path.relative(ROOT, full), record: pickRecord(content), ...extra }
  return hw
    ? { ...base, kind: 'hw', id: hw.id, title: hw.title, level: '手撕' }
    : { ...base, kind: 'algo', ...parseAlgoHeading(content) }
}

function loadPlanItems() {
  const items = []
  for (const { week, day, dir } of listDayDirs()) {
    for (const f of safeReaddir(dir)) {
      if (f.endsWith('.js')) items.push(readItem(path.join(dir, f), { week, day }))
    }
  }
  return items
}

function loadArchiveItems() {
  return safeReaddir(ARCHIVE_SOLUTIONS)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readItem(path.join(ARCHIVE_SOLUTIONS, f), { week: null, day: null }))
}

// ---------- 解析 PLAN.md 的逐日题单 ----------
// 日表行格式：| D3 | 新题… | 二刷… | [手撕](week-XX/dN/xx.js) |   ← 4 列
// 索引表行是 5 列，靠列数区分，避免误读
function idsOf(cell) {
  if (!cell || cell === '—') return []
  return cell
    .split('·')
    .map((seg) => (seg.trim().match(/^(\d{1,4})\b/) || [])[1])
    .filter(Boolean)
    .map(Number)
}

function parsePlanMd() {
  const days = new Map()
  let week = null
  let text = ''
  try {
    text = fs.readFileSync(PLAN_MD, 'utf8')
  } catch {
    return days
  }
  for (const raw of text.split('\n')) {
    const wm = raw.match(/^###\s*第\s*(\d+)\s*周/)
    if (wm) {
      week = Number(wm[1])
      continue
    }
    if (!week || !raw.startsWith('|')) continue
    const cells = raw.split('|').slice(1, -1).map((s) => s.trim())
    if (cells.length !== 4) continue
    const dm = cells[0].match(/^D(\d)$/)
    if (!dm) continue
    const hwPath = (cells[3].match(/\]\(([^)]+)\)/) || [])[1] || null
    days.set(`${week}-${dm[1]}`, {
      week,
      day: Number(dm[1]),
      newIds: idsOf(cells[1]),
      reviewIds: idsOf(cells[2]),
      hwPath: hwPath && !/^https?:/.test(hwPath) ? hwPath : null,
    })
  }
  return days
}

// ---------- 状态 ----------
function statusOf(item) {
  const { record } = item
  if (!record) return STATUS.NO_FIELD
  if (!record.first.date) return STATUS.NOT_STARTED
  if (record.third.date) return STATUS.THIRD_DONE
  if (!record.second.date) return STATUS.TODO_SECOND
  if (record.second.failed) return STATUS.SECOND_FAILED
  return STATUS.SECOND_DONE
}

function daysSince(date) {
  if (!date) return null
  const t = new Date()
  const todayStart = new Date(t.getFullYear(), t.getMonth(), t.getDate())
  return Math.floor((todayStart - date) / DAY_MS)
}

const fmtDate = (d) =>
  d ? `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '____'

function statusTag(status) {
  if (status === STATUS.SECOND_FAILED) return red(status)
  if (status === STATUS.TODO_SECOND || status === STATUS.NO_FIELD) return yellow(status)
  if (status === STATUS.SECOND_DONE || status === STATUS.THIRD_DONE) return green(status)
  return dim(status)
}

const levelTag = (level) =>
  level === '困难' ? red('困难') : level === '中等' ? yellow('中等') : level === '手撕' ? cyan('手撕') : dim(level)

const wd = (item) => (item.week ? `w${item.week}d${item.day}` : '归档')

// ---------- 输出 ----------
function main() {
  const args = process.argv.slice(2)
  const flags = args.filter((a) => a.startsWith('--'))
  const filter = args.find((a) => !a.startsWith('--')) || null
  const onlyToday = flags.includes('--today')
  const onlyOverdue = flags.includes('--overdue')
  const onlyHw = flags.includes('--handwritten')

  const planItems = loadPlanItems()
  const archiveItems = loadArchiveItems()
  const allItems = [...planItems, ...archiveItems]
  const dayPlan = parsePlanMd()

  const byId = new Map()
  for (const it of [...archiveItems, ...planItems]) {
    if (it.kind === 'algo') byId.set(it.id, it)
  }
  const hwByPath = new Map(planItems.filter((i) => i.kind === 'hw').map((i) => [i.rel, i]))
  const resolve = (id) => byId.get(id) || null

  const t = new Date()
  const dateLabel = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`

  console.log('')
  console.log(bold(`刷题看板（时间维度）  ${dateLabel}`))
  console.log(dim('─'.repeat(72)))

  const algoCount = planItems.filter((i) => i.kind === 'algo').length
  const hwCount = planItems.filter((i) => i.kind === 'hw').length
  const byStatus = new Map(Object.values(STATUS).map((s) => [s, allItems.filter((i) => statusOf(i) === s)]))
  const brief = Object.values(STATUS)
    .filter((s) => byStatus.get(s).length > 0)
    .map((s) => `${statusTag(s)} ${bold(String(byStatus.get(s).length))}`)
    .join(dim(' · '))
  console.log(`  本次 ${bold(String(planItems.length))} 个文件（算法 ${algoCount} · 手撕 ${hwCount}）　归档旧题 ${archiveItems.length}`)
  if (brief) console.log(`  状态　${brief}`)

  // ---------- 按时间推进，找「今天该做」 ----------
  const dayKeys = [...dayPlan.keys()].sort((a, b) => {
    const [aw, ad] = a.split('-').map(Number)
    const [bw, bd] = b.split('-').map(Number)
    return aw - bw || ad - bd
  })

  const dayEntries = (key) => {
    const d = dayPlan.get(key)
    const entries = []
    for (const id of d.newIds) entries.push({ label: '新题', id, item: resolve(id) })
    for (const id of d.reviewIds) entries.push({ label: '二刷', id, item: resolve(id) })
    if (d.hwPath) {
      const rel = path.join('plan', d.hwPath)
      entries.push({ label: '手撕', item: hwByPath.get(rel) || null, hwRel: rel })
    }
    return entries
  }

  const pendingOf = (entries) =>
    entries.filter((e) => !e.item || PENDING.has(statusOf(e.item)))

  let currentKey = null
  for (const key of dayKeys) {
    if (pendingOf(dayEntries(key)).length > 0) {
      currentKey = key
      break
    }
  }
  const doneDays = currentKey ? dayKeys.indexOf(currentKey) : dayKeys.length

  console.log(`  进度　计划 ${dayKeys.length} 天 · 已走完 ${bold(String(doneDays))} 天` +
    (currentKey ? ` · 当前 ${bold(`第 ${dayPlan.get(currentKey).week} 周 D${dayPlan.get(currentKey).day}`)}` : ` · ${green('全部完成')}`))

  const entryLine = (e) => {
    const isHw = Boolean(e.item && e.item.kind === 'hw')
    const name = e.item
      ? isHw
        ? `手撕 ${String(e.item.id).padStart(2, '0')} ${e.item.title}`
        : `#${e.item.id} ${e.item.title}`
      : `#${e.id}（文件未生成）`
    const file = e.item ? e.item.rel : e.hwRel || ''
    const lv = e.item ? levelTag(isHw ? '手撕' : e.item.level) : dim('待出题')
    const st = e.item ? statusTag(statusOf(e.item)) : dim('—')
    return `  ${dim('[' + e.label + ']')} ${padTo(name, 38)} ${padTo(file, 46)}${padTo(lv, 6)}${st}`
  }

  if (!onlyOverdue && !onlyHw && !filter) {
    console.log('')
    if (currentKey) {
      const d = dayPlan.get(currentKey)
      const entries = dayEntries(currentKey)
      const pending = pendingOf(entries)
      console.log(`${bold('■ 今天该做')} · 第 ${d.week} 周 D${d.day}（待办 ${bold(String(pending.length))} / 共 ${entries.length} 项）`)
      for (const e of pending) console.log(entryLine(e))
      if (pending.length === 0) console.log(dim('  这一天已全部一刷完成。'))
      for (const e of pending) {
        if (e.item && e.item.rel.startsWith('plan/')) console.log(dim(`       → node ${e.item.rel}`))
      }
    } else {
      console.log(bold('■ 今天该做'))
      console.log(green('  计划内的每一天都已一刷完成 —— 进入二刷 / 三刷与限时模拟阶段。'))
    }
  }

  // ---------- 时间维度的复习队列 ----------
  const section = (title, items, decorate) => {
    console.log('')
    console.log(`${bold('■ ' + title)}（${items.length}）`)
    if (items.length === 0) {
      console.log(dim('  无'))
      return
    }
    for (const it of items) console.log(lineOf(it) + (decorate ? decorate(it) : ''))
  }

  function lineOf(item) {
    const stage = [
      `一刷 ${fmtDate(item.record.first.date)}`,
      `二刷 ${fmtDate(item.record.second.date)}${item.record.second.failed ? red(' ✗') : ''}`,
      `三刷 ${fmtDate(item.record.third.date)}`,
    ].join(' · ')
    return `  ${padTo(`#${item.id} ${item.title}`, 34)} ${padTo(levelTag(item.kind === 'hw' ? '手撕' : item.level), 6)}${dim(stage)}  ${dim(item.rel)}`
  }

  const todoSecond = byStatus.get(STATUS.TODO_SECOND)
  const overdue = todoSecond
    .map((it) => ({ it, days: daysSince(it.record.first.date) }))
    .filter((x) => x.days !== null && x.days > OVERDUE_DAYS)
    .sort((a, b) => b.days - a.days)
  const overdueSet = new Set(overdue.map((x) => x.it.rel))
  const waiting = todoSecond
    .filter((it) => !overdueSet.has(it.rel))
    .sort((a, b) => (daysSince(b.record.first.date) || 0) - (daysSince(a.record.first.date) || 0))

  if (!onlyHw && !filter) {
    if (!onlyToday) {
      section(`逾期未二刷 · 一刷超过 ${OVERDUE_DAYS} 天未二刷`, overdue.map((x) => x.it), (it) =>
        '  ' + red(`逾期 ${daysSince(it.record.first.date)} 天`)
      )
      section('待二刷 · 一刷在 48 小时内', waiting, (it) => '  ' + dim(`已过 ${daysSince(it.record.first.date)} 天`))
      section('二刷未过 · 需要回炉', byStatus.get(STATUS.SECOND_FAILED))
      section('已完成 · 已二刷 / 已三刷', [
        ...byStatus.get(STATUS.THIRD_DONE),
        ...byStatus.get(STATUS.SECOND_DONE),
      ])
    }
  }

  // ---------- 手撕进度（同编号多次练习合并） ----------
  if (!onlyToday && !onlyOverdue && !filter) {
    const hw = planItems.filter((i) => i.kind === 'hw')
    const groups = new Map()
    for (const it of hw) {
      if (!groups.has(it.id)) groups.set(it.id, [])
      groups.get(it.id).push(it)
    }
    console.log('')
    console.log(`${bold('■ 手撕进度')}（${groups.size} 题 / ${hw.length} 份）`)
    for (const id of [...groups.keys()].sort((a, b) => a - b)) {
      const list = groups.get(id).sort((a, b) => a.week - b.week || a.day - b.day)
      const first = list[0]
      const detail = list
        .map((it, i) => `第${i + 1}次 ${wd(it)} ${statusTag(statusOf(it))}`)
        .join(dim(' · '))
      console.log(`  ${padTo(`${String(id).padStart(2, '0')} ${first.title}`, 40)}${detail}`)
    }
  }

  // ---------- 状态过滤（兼容旧用法） ----------
  if (filter) {
    for (const s of Object.values(STATUS)) {
      if (!s.includes(filter)) continue
      section(s, byStatus.get(s))
    }
  } else if (flags.includes('--overdue')) {
    // 上面已单独输出
  } else if (onlyHw) {
    // 已输出
  }

  console.log('')
  console.log(dim('  填写：一刷 10-09 提示 · 二刷 10-11 独立 · 三刷 ____（未通过写 ✗）'))
  console.log(dim(`  规则：一刷后 ${OVERDUE_DAYS} 天内必须二刷；二刷限时独立写对才算通过。`))
  console.log('')
}

module.exports = {
  parseRecordLine,
  parseAlgoHeading,
  parseHwHeading,
  parsePlanMd,
  statusOf,
  daysSince,
  toDate,
  loadPlanItems,
  loadArchiveItems,
  STATUS,
}

if (require.main === module) main()
