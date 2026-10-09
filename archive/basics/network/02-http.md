# 计算机网络 · HTTP / HTTPS

---

**Q1：GET 和 POST 的区别？**

**A：**

| 维度 | GET | POST |
| --- | --- | --- |
| 语义 | 获取资源（安全、幂等） | 提交/创建资源（非幂等） |
| 参数位置 | URL query | 请求体 body |
| 长度限制 | 受 URL 长度限制（浏览器/服务器限制，非协议规定） | 无协议限制（服务端可配） |
| 缓存 | 默认可缓存、可收藏、留在历史记录 | 默认不缓存 |
| 编码 | 只能 ASCII，需 URL 编码 | 任意（`Content-Type` 决定，如 `multipart/form-data`） |

> 正确认知：**两者都不安全**（明文，抓包可见），安全靠 HTTPS；"GET 只能 ASCII、POST 更大"是实现差异而非协议本质。核心是**语义与幂等性**，它决定了缓存、重试、预加载的行为。

---

**Q2：常见 HTTP 状态码？**

**A：**

- **1xx 信息**：`100 Continue`（大请求先探服务端意愿）、`101 Switching Protocols`（WebSocket 升级）
- **2xx 成功**：`200 OK`、`201 Created`、`202 Accepted`（已受理未处理）、`204 No Content`（无 body，常用于 DELETE）
- **3xx 重定向**：`301 永久`（换域名，浏览器会缓存）、`302 临时`、`303 See Other`（POST 后转 GET）、`304 Not Modified`（协商缓存命中）、`307/308`（严格保持原方法）
- **4xx 客户端错**：`400 参数错`、`401 未认证`、`403 无权限`、`404 不存在`、`405 方法不允许`、`409 冲突`、`413 body 过大`、`429 限流`
- **5xx 服务端错**：`500 内部错误`、`501 未实现`、`502 Bad Gateway`（网关收到上游无效响应）、`503 不可用`（常配 `Retry-After`）、`504 网关超时`

> 线上排查口诀：502=上游没起来/被重启；504=上游慢；499（Nginx 私有）=客户端等不及主动断开。

---

**Q3：HTTP/1.0、1.1、2.0、3.0 的演进？**

**A：**

- **HTTP/1.0**：短连接（每请求一次握手）、无 Host 头；
- **HTTP/1.1**：**长连接 keep-alive**（默认复用）、管道化 pipeline、`Host` 头（虚拟主机）、`Chunked` 传输、`Cache-Control`、断点续传 `Range`；
- **HTTP/2**：**二进制分帧 + 多路复用**（一个连接并发多个流，解决应用层队头阻塞）、**HPACK 头部压缩**、流优先级、服务端推送；
- **HTTP/3**：传输层换成基于 UDP 的 **QUIC**，自带 TLS 1.3（1-RTT/0-RTT 建连）、连接迁移（按 connection ID 而非四元组，换网不断线）、**每流独立重传** → 彻底解决 TCP 队头阻塞。

> 追问"HTTP/2 还有问题吗"：有。多路复用只解决**应用层**队头阻塞，TCP 丢一个包仍会阻塞所有流（等重传），这正是 HTTP/3 的动机。

---

**Q4：HTTPS 是怎么建立连接的（TLS 握手）？**

**A：** HTTPS = HTTP over TLS（默认 443）。以 TLS 1.2（ECDHE）为例：

1. **ClientHello**：支持的 TLS 版本、密码套件列表、随机数 `Client Random`、SNI（域名）；
2. **ServerHello**：选定版本与套件、随机数 `Server Random`、证书链（含公钥）、`ServerKeyExchange`（ECDHE 参数 + 签名）；
3. **客户端校验证书**（CA 链、域名、有效期、吊销），然后用证书公钥验证服务端签名，取出 ECDHE 参数；
4. 双方用 ECDHE 算出**相同的预主密钥**，再结合两个随机数派生出**会话密钥**（对称密钥）；
5. **ChangeCipherSpec + Finished**：双方互发加密Finished 报文验证握手未被篡改；
6. 之后全部用对称加密通信。

关键点：**非对称加密只用来交换密钥，真正的数据传输用对称加密**（性能）。TLS 1.3 精简为 1-RTT（ClientHello 就带密钥共享），支持 0-RTT 恢复会话。

---

**Q5：HTTPS 一定安全吗？中间人攻击怎么防？**

**A：** HTTPS 防的是**窃听、篡改、冒充**，但前提是证书校验正确。

- 中间人攻击原理：攻击者伪造证书冒充服务端。防护靠 **CA 证书链校验** —— 客户端用内置根证书逐级验证签名（数字签名用 CA 私钥签、浏览器用公钥验，无法伪造）。
- 仍然不安全的场景：用户主动信任了恶意根证书（公司代理/抓包工具 Fiddler/Charles）、**证书校验被跳过**（App 里 `setDefaultSSLSocketFactory` 放行、`verify=False`）、SSL Stripping（把 https 降级成 http，靠 HSTS 防护）。
- 增强手段：**证书固定（Certificate Pinning）**、HSTS（`Strict-Transport-Security`）、`CAA` DNS 记录。

> HTTPS 仍会暴露：目标 IP、SNI 域名（除非用 ECH）、流量大小与时序。
>
> 以上是简答版，TLS 握手细节、证书校验、中间人攻击的完整展开见 [03-https.md](03-https.md)。

---

**Q6：HTTP 缓存机制（强缓存 + 协商缓存）？**

**A：**

1. 先查**强缓存**（不发请求）：
   - `Cache-Control: max-age=3600`（HTTP/1.1，优先级高）、`Expires`（HTTP/1.0，绝对时间，依赖客户端时钟）；
   - 命中 → 直接用本地副本（200 from memory/disk cache）。
2. 强缓存失效 → 发起**协商缓存**请求：
   - `If-None-Match: <etag>` ／ 响应 `ETag`；
   - `If-Modified-Since: <时间>` ／ 响应 `Last-Modified`；
   - 服务端判断未变更 → **304 Not Modified**，body 不回传；变更 → 200 + 新内容。

其他常用指令：`no-cache`（可以缓存但每次要协商）、`no-store`（禁止任何缓存）、`private/public`、`s-maxage`（CDN 用）、`immutable`、`stale-while-revalidate`。

> ETag 比 Last-Modified 精确（秒级精度、内容未变但时间戳变了的问题），但生成 ETag 要算哈希，有成本。

---

**Q7：Cookie、Session、Token（JWT）的区别？**

**A：**

| | Cookie | Session | JWT |
| --- | --- | --- | --- |
| 存储位置 | 浏览器（≤4KB，随请求自动带） | 服务端（内存/Redis），客户端只存 sessionId | 客户端（localStorage/Cookie） |
| 状态 | 客户端 | **服务端有状态** | **服务端无状态** |
| 扩展性 | — | 需共享存储（Redis）或 sticky 会话 | 天然适合分布式 |
| 安全 | `HttpOnly` 防 XSS 读取、`Secure` 仅 HTTPS、`SameSite` 防 CSRF | sessionId 泄露即被盗用 | 签名防篡改，**不能存敏感数据**（Base64 明文） |

- JWT 结构：`Header.Payload.Signature`，缺点是**无法主动失效**（要配短过期 + 黑名单/refresh token）。
- 常见方案：access token（短期，内存） + refresh token（长期，HttpOnly Cookie） + Redis 存状态做登出/踢人。

> 防护：CSRF 用 `SameSite=Lax/Strict` + CSRF Token；XSS 用 `HttpOnly` + 转义。

---

**Q8：从浏览器输入 URL 到页面显示，发生了什么？**

**A：** 经典综合题，答主线 + 能深挖：

1. **URL 解析**：协议/域名/端口/路径；若非法则用默认搜索引擎搜索；
2. **缓存判断**：浏览器强缓存命中直接返回；
3. **DNS 解析**：浏览器缓存 → 系统 hosts → 本地 DNS 服务器（递归）→ 根 → 顶级域 → 权威 DNS（迭代），拿到 IP；
4. **TCP 三次握手**（HTTPS 还要 TLS 握手），可能复用已有连接（keep-alive/连接池）；
5. **发送 HTTP 请求**：请求行 + 头 + body；
6. **服务端处理**：负载均衡（LVS/Nginx）→ 网关 → 应用 → 数据库/缓存 → 返回响应；
7. **浏览器解析渲染**：
   - 解析 HTML → DOM 树；解析 CSS → CSSOM；合成 Render 树；
   - 遇 `<script>`（非 async/defer）阻塞解析，下载执行 JS；
   - **布局（Layout/Reflow）→ 绘制（Paint）→ 合成（Composite）**，GPU 上屏；
8. **连接关闭/复用**：keep-alive 保持连接，或四次挥手。

---

**Q9：DNS 解析过程？用的是 TCP 还是 UDP？**

**A：**

- 查询顺序：浏览器缓存 → 操作系统缓存 → `hosts` 文件 → **本地 DNS 服务器（递归查询）** → 根域名服务器（.）→ 顶级域服务器（.com）→ 权威域名服务器（example.com）→ 返回 IP，逐级缓存（TTL）。
- **绝大多数用 UDP 53**（包小、快）；两种情况用 TCP：**响应超过 512 字节**被截断（TC 标志）时改用 TCP 重查，**区域传送（AXFR）**主从同步也用 TCP。现在还有 DoH（HTTPS 443）/DoT（853）加密 DNS。
- 记录类型：`A`(IPv4)、`AAAA`(IPv6)、`CNAME`（别名）、`MX`（邮件）、`NS`、`TXT`（验证/SPF）、`PTR`（反查）。

> 实践坑：DNS 缓存导致切流不生效（本地 `TTL` 未过期）；CDN 靠 CNAME + 智能调度返回就近 IP。

---

**Q10：跨域（CORS）是什么？预检请求什么时候发？**

**A：** **同源策略**要求协议、域名、端口三者一致才能互相读取响应；CORS 是服务端用响应头声明"允许谁访问"的机制。

简单请求需满足：方法为 `GET/HEAD/POST` 之一，且头只有 `Accept/Accept-Language/Content-Language/Content-Type(限 text-plain、multipart/form-data、application/x-www-form-urlencoded)`。

非简单请求（如 `PUT`、`DELETE`、`application/json`、自定义头）会先发 **OPTIONS 预检**，服务端返回：

```
Access-Control-Allow-Origin: https://a.com
Access-Control-Allow-Methods: GET,POST,PUT
Access-Control-Allow-Headers: Content-Type,X-Token
Access-Control-Max-Age: 86400     // 预检结果缓存，减少 OPTIONS
```

带 Cookie 时需 `Access-Control-Allow-Credentials: true` + 前端 `withCredentials`，且 `Allow-Origin` **不能为 `*`**。

解决跨域的其他手段：开发期用 devServer/nginx **反向代理**（最常用，同源即可）、JSONP（只支持 GET，基本淘汰）、`postMessage`、WebSocket（不受同源限制）。

---

**Q11：WebSocket 是什么？和 HTTP 长轮询比？**

**A：** WebSocket 是**全双工**长连接协议：先通过 HTTP `Upgrade: websocket` + `101 Switching Protocols` 握手，之后复用同一条 TCP 连接双向收发帧（帧头极小，2~14 字节），服务端可主动推送。

| 方案 | 特点 |
| --- | --- |
| 轮询 | 定时发请求，实时性差、浪费资源 |
| 长轮询 | 请求挂起直到有数据/超时，实现简单，仍有握手开销 |
| SSE | 服务端单向推（EventSource），HTTP 协议、自动重连，适合推送通知 |
| **WebSocket** | 双向、低延迟、低开销，适合聊天/协作/实时行情 |

> 工程注意：心跳（ping/pong）保活与死连接检测、网关/Nginx 要配 `Upgrade` 头与超时、断线重连与消息补偿、鉴权在握手阶段做。

---

**Q12：HTTP Keep-Alive 和 TCP Keepalive 是一回事吗？**

**A：** 不是，两者层级与目的都不同：

| | HTTP Keep-Alive | TCP Keepalive |
| --- | --- | --- |
| 层级 | 应用层 | 传输层（内核） |
| 目的 | **复用 TCP 连接**处理多个请求，省握手开销 | **探测对端是否还活着**，回收死连接 |
| 机制 | 请求头 `Connection: keep-alive`（HTTP/1.1 默认开启），服务端保持连接一段时间 | 空闲超过 `tcp_keepalive_time`（默认 7200s）后发探测包，连发 9 次无响应则断开 |
| 关闭 | `Connection: close` | `SO_KEEPALIVE` 选项 |

> 补充：应用层自己的**心跳**（如 WebSocket ping、IM 心跳包）周期更短（30s~1min），比 TCP keepalive 2 小时实用得多；移动端还会配合"智能心跳"省电。

---

**Q13：常见的 HTTP 请求头/响应头有哪些？**

**A：**

- **请求**：`Host`（虚拟主机必填）、`User-Agent`、`Accept`/`Accept-Encoding`（gzip/br）、`Content-Type`、`Content-Length`/`Transfer-Encoding: chunked`、`Authorization`、`Cookie`、`Referer`、`Origin`、`If-None-Match`/`If-Modified-Since`、`X-Forwarded-For`、`Connection`
- **响应**：`Content-Type`（带 `charset=utf-8`）、`Content-Length`、`Content-Encoding`、`Cache-Control`/`ETag`/`Last-Modified`、`Set-Cookie`（`HttpOnly; Secure; SameSite`）、`Location`（配合 3xx）、`Access-Control-Allow-*`、安全头 `Strict-Transport-Security`/`X-Content-Type-Options: nosniff`/`Content-Security-Policy`/`X-Frame-Options`
- **压缩**：`gzip`、`br`（Brotli，压缩率更高）；注意**不要对已压缩内容（图片/视频）再压**，且压缩+HTTPS 需防 BREACH 攻击。

---

**Q14：什么是队头阻塞（HOL blocking）？怎么缓解？**

**A：** 排在队头的请求/报文阻塞了后续所有内容：

- **HTTP/1.1 应用层**：一个连接同时只能处理一个请求响应（pipeline 也要求按序返回），前一个慢就全堵 → 浏览器开 **6 个并发连接**、域名分片（sharding）、雪碧图/资源合并；
- **HTTP/2**：多流复用后应用层队头阻塞消失，但**TCP 层**丢包时所有流都要等重传（TCP 必须按序交付）→ **HTTP/3 的 QUIC** 每流独立编号、独立重传，只影响丢包的那个流；
- **其他 HOL**：交换机输入队列 HOL、Kafka 分区内消息阻塞（消费失败卡住整个分区）。

---

**Q15：什么是幂等？哪些方法是安全和幂等的？**

**A：**

- **安全方法**（不修改资源）：`GET`、`HEAD`、`OPTIONS`；
- **幂等方法**（多次执行效果与一次相同）：`GET`、`HEAD`、`OPTIONS`、`PUT`、`DELETE`；`POST` **非幂等**（每次创建新资源）；`PATCH` 视实现而定。

工程上的幂等设计（防重复下单/重复扣款）：

1. **唯一请求号/幂等 token**：客户端生成，服务端去重（Redis `SETNX` + 过期）；
2. **数据库唯一索引/唯一约束**：靠 DB 兜底；
3. **状态机 + 乐观锁**：`UPDATE ... WHERE status='待支付' AND version=?`，用影响行数判断；
4. **分布式锁**：同一业务单号串行处理；
5. 重试要配合**指数退避 + 抖动**，否则会打爆下游。