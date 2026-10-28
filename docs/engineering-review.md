# 工程审查与修复记录

日期：2026-10-26至2026-10-28。范围：当前代码、配置、依赖、60个本地Git历史提交、针对性线上只读复现、本地浏览器和生产模式验证。本记录保存部署前的审查与验证证据；实际发布状态以对应GitHub提交和Netlify部署记录为准。附件的“暂不修改”已被本次明确的“直接改”授权覆盖。

## 产品边界

这是一个无账户、无数据库、无支付、无真实AI服务的浏览器工具站。工具输入不通过业务API上传。不能把工具标题当成真实运行能力；本轮修复了伪结果和数据损坏，并保留已有可用操作。没有为清单添加SSO、MFA登录、数据库、支付或队列。

“已修复”只表示对应代码与指定验证完成，不代表整站安全认证。P1表示可能损坏用户结果、给出错误安全结论或存在需要优先处理的已知依赖风险；P2表示可靠性、隐私或交付控制缺陷。未发现并证实的账户泄露或资金损失不会写成既成事实。

## 最值得修复的10项（按优先级）

| 优先级 | 实际问题与风险 | 证据／修复位置 | 处理 |
| --- | --- | --- | --- |
| P1 | Next 16.3.1及传递依赖存在已知高危/严重公告，可能影响可用性或安全；具体触发面依本站实际使用而异 | package.json、package-lock.json；npm audit与官方公告 | 升级Next/eslint-config-next至16.4.3及兼容依赖；没有宣称未使用的Server Actions/use cache漏洞在现网已可利用 |
| P1 | 部分哈希使用非对应算法，JWT签名和网络检测/运行器返回固定成功，用户可能据此做错误安全判断 | lib/tool-processors.ts、lib/online-tool-runner.ts、components/directory-tool-workspace.tsx | SHA使用真实Web Crypto；没有后端或可靠算法的操作明确不可执行，不再伪报成功；模板显示能力边界 |
| P1 | 全局正则格式化、压缩和删注释会修改字符串/URL，改变源代码语义 | lib/source-comments.ts、lib/tool-processors.ts | Babel解析注释区间；Prettier/Terser按需处理支持的语法；不支持的格式明确报错且保留输入 |
| P1 | CSV简单split丢失引号/多行；导出公式单元格可能在电子表格中被执行 | lib/tool-processors.ts | 引号/转义/多行解析、重复表头与行宽校验、公式保护及回归测试 |
| P1 | JSON大整数、进制转换和Unicode处理会静默丢失数字精度或损坏emoji | lib/tool-processors.ts、lib/online-tool-runner.ts | 格式化保留数字token；需要结构转换时拒绝不安全整数；BigInt进制和UTF-8/字素处理并有回归 |
| P1 | 正则替换、CSV展开、解压和重复操作可在小输入下产生巨大输出，冻结浏览器 | lib/safe-regex.ts、lib/tool-processors.ts、components/directory-tool-workspace.tsx | Worker超时/资源清理，输入/输出上限和分配前预算；防止先分配巨量字符串再检查 |
| P2 | URL键继承Object.prototype：线上 /constructor 与 /__proto__ 实测500，/tools/constructor还产生 /undefined 位置 | lib/own-entry.ts、lib/tool-route-inventory.ts、app下路由 | 仅允许自有路由项；非法/未知路径404；加入生产HTTP回归 |
| P2 | Clear、换输入/语言/页面后，旧异步运行或文件读取仍可能回写，显示与当前输入无关结果 | components的三个workspace及file-upload.tsx | 运行版本、上传版本和跨slug组件key；重复运行锁；浏览器验证Clear竞态与读取失败 |
| P2 | GA默认加载且没有选择或撤回入口，完整URL可能携带查询信息；隐私说明不够准确 | components/google-analytics.tsx、analytics-settings.tsx、lib/analytics-privacy.ts、privacy-policy.ts | 默认不加载、显式opt-in、尊重DNT/GPC、撤回；手动页面事件去掉query/hash和完整referrer。GA远端自动事件配置仍需确认 |
| P2 | 原Netlify仅执行next build，格式/类型以外逻辑回归和已知依赖风险可直接发布 | netlify.toml、package.json、.github/workflows/ci.yml、scripts/check-production.mjs | audit→lint→types→tests→内容→生产build→本地HTTP检查全部通过才允许构建发布；另有每周扫描和每月依赖PR |

其他已处理：浏览器存储不可用不再破坏主题/语言；复制权限失败有可操作错误；严格UTF-8/UTF-16文件读取；补控件标签和状态播报、搜索空状态、路由错误重试；静态资源安全头；忽略全部.env变体；补回滚和凭据事件流程。

## 明确的限制及尚未确认事项

- 原先没有真实能力的网络/安全/语言运行工具不再返回编造结果；未添加执行任意用户代码的远程服务。部分算法、语言和模板仍有明确限制。
- 2026-10-28复核：生产依赖和完整依赖审计均为0。2026-10-26曾出现Tailwind构建链的3项moderate范围差异，本次已不再出现；没有强行升级Tailwind4或隐藏审计。历史说明见[运维记录](operations.md)。
- 账户MFA、权限、预算告警、外部监控、分支保护、责任人和恢复演练均未由本轮建立或验证。不能把仓库文档当作这些控制已经启用。
- GA后台Enhanced Measurement可能产生独立自动事件；本轮无法确认其搜索/表单/历史变更开关。已验证的是默认无统计加载，以及本应用手动page_view的去敏参数。
- CSP为静态生成兼容保留unsafe-inline；未为严格nonce策略把全部页面改成动态渲染。
- 未做全站独立渗透测试、生产压力测试、旧硬件/所有浏览器/RTL/WCAG认证或法律合规审核。部分新能力说明仍是英语。

### 能力边界调整

以下原先没有可靠实现的入口保留页面，但明确显示不可用或运行错误；不会生成假结果：

- 实时检查：SSL、WHOIS、DNS、IP查询、URL扫描、HTTP/安全头、Ping、Traceroute、端口、子域、HTTP状态/跳转、MAC查询、CIDR。
- 密码操作：MD5、HMAC、JWT签名/验证、Hash Cracker。SHA哈希已实现；JWT解码仍可用，但明确未验证签名。
- 编解码与图片：JSON5、Base62/85/91、拼音、简繁、QR/条码、Base64图片双向转换、Curl→PHP、Quoted Printable、Wingdings。
- 缺专用解析器的转换：SQL格式化、CSS/HTML/XML压缩、YAML与JSON/XML/CSV互转、TOML/INI→JSON、JSON→TOML/INI、XML→CSV、CSS预处理器互转。
- 未接生成引擎的入口：APA引用、单元测试、代码总结/加注释、API代码、SQL查询、Shell脚本、Dockerfile、代码片段、README、代码重构/优化；HTML验证和自动正则生成也明确不可用。

核心代码生成保留并标明“起始模板”；代码转换提供迁移工作表；代码文档输出标明通用模板；Code to PDF当前仍导出文本。实现这些完整服务需要单独产品范围，本次没有把它们伪装成已经完成。

## 验证记录

- `npm run build:verified`完整通过：依赖审计、ESLint、路由类型生成与TypeScript、40项回归测试、内容检查、生产构建和生产HTTP检查均通过。40项测试无失败或跳过。
- 生产构建生成1489个静态页面；64份内容文件检查通过，58个允许索引的工具页面有独立内容文件。生产HTTP检查覆盖59个sitemap页面的状态、标题、canonical、robots、H1及结构化数据，并检查10个未知/退役/原型属性路径返回404。
- 本地生产模式浏览器实际操作通过：JavaScript格式化/压缩保留URL和注释样式字符串；SHA256的`abc`结果匹配标准向量；非全局正则只替换首个匹配；Base64→JSON保留9007199254740993、中文及emoji。未出现浏览器运行错误。发现的Base64解码示例和说明方向问题已修正。
- 最后的示例/说明修正后，针对性ESLint、生产重新构建和生产HTTP检查再次通过；生成页面包含正确的解码标题和可解码JSON示例，已无写反的编码标题。
- 隐私浏览器验证：没有保存同意时无GA脚本和请求；开启后用本地拦截的空脚本验证手动事件参数不含query/hash；撤回后刷新，无GA脚本和请求。没有向Google发送这些测试事件，未验证Google后台数据接收或自动事件设置。
- 此前开发模式浏览器检查通过：清空时的运行/读取竞态、错误文件编码、存储被禁用、剪贴板拒绝、无实现运行器禁用、搜索无结果反馈；这些是针对性场景，非所有工具和浏览器矩阵。
- 本地生产模式抽查旧路径永久跳转与安全头通过；Netlify新增静态资源头需在部署后验证，不能由本地结果代替。
- 当前工作区及60个本地Git历史提交的常见凭据特征扫描无匹配；`git diff --check`通过。该扫描不覆盖所有秘密格式或聊天历史。

## 原清单逐项适用性和结论

保留原顺序，共160项；组织职责也单独标明，避免用代码变更冒充人员和流程已经落实。

| # | 原检查项 | 适用性／结论 | 证据与范围 |
| --- | --- | --- | --- |
| 1 | a schema someone designed, instead of one the AI improvised table by table | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 2 | login that still works when someone puts a plus sign in their email | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 3 | password reset links that expire and work once | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 4 | MFA, plus a recovery path for the user who lost their phone | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 5 | sessions that time out, and a way to kill every session for one user | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 6 | SSO for the enterprise customer who won't sign without it | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 7 | SAML, because that customer's IT team doesn't do magic links | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 8 | SCIM, so a fired employee loses access the moment IT offboards them | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 9 | roles and permissions deeper than "admin" and "everyone else" | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 10 | checks that stop user A from reading user B's data by changing one number in the URL | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 11 | tenant isolation, so one customer's bug never shows another customer's records | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 12 | an admin "log in as this user" button for support, with an audit trail on every use | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 13 | rate limits on login, so nobody can guess passwords at scale | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 14 | lockouts that stop attackers without locking out your CFO the night before the board meeting | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 15 | database migrations that run forward and roll back | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 16 | migrations that don't lock the main table at 2pm on a Tuesday | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 17 | indexes, because the query that was instant on 50 test rows times out on 5 million real ones | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 18 | connection pooling, so a traffic spike doesn't exhaust the database | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 19 | backups every night | 部分适用／无法确认 | 源码与配置在Git，Netlify保留部署；用户输入只在浏览器。不把Git当作已演练的账户恢复/异地备份。见operations.md。 |
| 20 | a restore from those backups, tested, because a backup you've never restored is a hope | 部分适用／无法确认 | 源码与配置在Git，Netlify保留部署；用户输入只在浏览器。不把Git当作已演练的账户恢复/异地备份。见operations.md。 |
| 21 | point-in-time recovery for the day someone runs a delete without a where clause | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 22 | soft deletes, so "I deleted it by accident" is a support ticket and not an incident | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 23 | validation on the server, not just in the form | 已检查 | 不存在接收工具输入的服务端接口；浏览器输入/文件/输出有边界，路由名校验和构建内容校验已补齐。 |
| 24 | timezones stored right, so the 9am reminder doesn't fire at 4am | 部分检查 | 无提醒或时区数据存储；现有时间戳工具尚未做完整时区/DST矩阵验证，不能声称全部覆盖。 |
| 25 | the customer with an apostrophe in their last name | 已修复／部分验证 | CSV引号、转义、多行、Unicode/emoji与UTF-8往返有回归；不声明每种文字和RTL布局已全测。 |
| 26 | emoji, accents and right-to-left text in every field | 已修复／部分验证 | CSV引号、转义、多行、Unicode/emoji与UTF-8往返有回归；不声明每种文字和RTL布局已全测。 |
| 27 | money stored as integers, because 0.1 + 0.2 doesn't equal 0.3 in floating point | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 28 | currency, rounding and tax rules for every country you sell into | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 29 | a data model that survives your second customer asking for "one small change" | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 30 | idempotency keys, so a retried payment doesn't charge the card twice | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 31 | deduplication for the user who clicks submit four times | 已修复 | 工作区运行锁及请求版本保护，重复运行、输入改变、清空或离开页面后旧结果不再覆盖新状态。 |
| 32 | pagination that still works on page 400 | 不适用 | 没有远程大表分页；工具目录使用本地即时过滤。 |
| 33 | exports, because sooner or later every customer wants their data in a spreadsheet | 已修复 | 文本导出、CSV引号/多行/重复表头/公式保护；文件读取支持UTF-8和带BOM的UTF-16，其他编码明确拒绝而不静默损坏。 |
| 34 | imports that survive the CSV someone saved in 2009 | 已修复 | 文本导出、CSV引号/多行/重复表头/公式保护；文件读取支持UTF-8和带BOM的UTF-16，其他编码明确拒绝而不静默损坏。 |
| 35 | retention rules, and code that deletes what your contract says you'll delete | 部分检查／无法确认 | 应用不保存用户工具内容；本地偏好可清除。Netlify/Google后台日志、保留策略和合同删除义务未核实。 |
| 36 | secrets out of the code, out of the repo and out of the AI chat history | 已检查／有范围限制 | 当前工作区及60个Git历史提交的常见密钥/私钥特征无匹配；扩大.env忽略范围。未检查所有账户密钥和历史AI聊天，不能证明不存在其他秘密。 |
| 37 | rotating every key the AI pasted into a config file last month | 无法确认 | 本次未发现可确认的已泄露密钥，未盲目轮换生产凭据；历史聊天或第三方泄露情况未确认。 |
| 38 | confirming every package the AI installed exists and is the one you meant | 已修复 | 核对npm/官方来源，Next与eslint-config-next升级16.4.3；生产依赖审计0；持续扫描及Dependabot已配置。开发依赖中等风险范围差异有单独记录。 |
| 39 | dependency scanning, because the AI pulled in libraries nobody reviewed | 已修复 | 核对npm/官方来源，Next与eslint-config-next升级16.4.3；生产依赖审计0；持续扫描及Dependabot已配置。开发依赖中等风险范围差异有单独记录。 |
| 40 | input sanitization everywhere a user can type | 已检查并修复 | 不执行用户代码，输出用React文本渲染；JSON-LD转义<。修复特殊路由键、CSV公式、资源放大。无SQL数据库及鉴权写接口，SQL注入/CSRF不是当前攻击面；非完整渗透测试。 |
| 41 | protection against SQL injection, XSS, CSRF and the rest of the OWASP list | 已检查并修复 | 不执行用户代码，输出用React文本渲染；JSON-LD转义<。修复特殊路由键、CSV公式、资源放大。无SQL数据库及鉴权写接口，SQL注入/CSRF不是当前攻击面；非完整渗透测试。 |
| 42 | file uploads that get scanned, size-limited and stored where they can't execute | 已修复 | 文件仅本地读入、不上传或执行，设5MB上限、严格解码和过期读取保护；无服务端文件存储，因此未加无用病毒扫描服务。 |
| 43 | CORS rules that aren't "allow everything" | 已检查 | 无跨域业务API和Access-Control-Allow-Origin:*配置；未引入CORS代理。 |
| 44 | security headers on every response | 已修复／待部署验证 | Next响应头保留并区分开发环境，Netlify静态文件补安全头。为SSG保留script unsafe-inline；不是严格nonce CSP。 |
| 45 | encryption at rest and in transit | 部分验证 | 已验证线上HTTPS证书和主域/www跳转；应用不保存敏感内容。托管商静态存储加密及备份权限未审计。 |
| 46 | least-privilege access for everyone, including the AI agent holding production credentials | 无法确认 | 平台账户MFA、恢复码、组织归属、协作者权限和定期访问审查需要账户/组织证据；本轮未修改。 |
| 47 | logs that record who did what, without recording passwords, tokens or card numbers | 已检查／部分无法确认 | 业务代码未记录工具输入；测试不含真实凭据。托管商、浏览器插件及GA后台采集配置/访问日志不可由仓库确认。 |
| 48 | a penetration test before your enterprise customer's security team runs their own | 无法确认 | 做了针对性源代码和浏览器/路由验证；未实施独立第三方渗透测试或完成企业安全问卷审计。 |
| 49 | answers to the security questionnaire every enterprise buyer sends, with evidence behind each one | 无法确认 | 做了针对性源代码和浏览器/路由验证；未实施独立第三方渗透测试或完成企业安全问卷审计。 |
| 50 | a disclosure process for the day a stranger emails you a vulnerability | 部分完成／无法确认 | operations.md列出私密漏洞报告渠道的责任；没有虚构联系方式，具体负责人/接收渠道待核实。 |
| 51 | a plan for the day a laptop with production access gets stolen | 已补文档／未演练 | operations.md包含丢失生产访问设备后的撤销、检查和轮换步骤；未声称实际执行过演练。 |
| 52 | SOC 2, which means policies, evidence and an auditor, not a checkbox | 当前不适用 | 未提供受监管业务、医疗/支付数据处理或企业SLA/地域合同；未增加合规认证或多区域设施。 |
| 53 | HIPAA, the moment a single patient record touches your system | 当前不适用 | 未提供受监管业务、医疗/支付数据处理或企业SLA/地域合同；未增加合规认证或多区域设施。 |
| 54 | a BAA with every vendor that touches that data, including your AI model provider | 当前不适用 | 未提供受监管业务、医疗/支付数据处理或企业SLA/地域合同；未增加合规认证或多区域设施。 |
| 55 | audit trails that show who viewed a record, not just who changed it | 不适用 | 应用没有账户、登录、会话、租户或管理员代登录；平台账户安全另见第46项。 |
| 56 | PCI scope, and card numbers kept out of your database | 当前不适用 | 未提供受监管业务、医疗/支付数据处理或企业SLA/地域合同；未增加合规认证或多区域设施。 |
| 57 | GDPR deletion requests that reach every table, backup and log | 部分修复／无法确认 | 增加默认关闭的可选统计、撤回和本地偏好清理说明；不存在用户业务数据表。供应商删除/日志/法律合规需要独立确认。 |
| 58 | data residency for the customer whose contract says EU only | 当前不适用 | 未提供受监管业务、医疗/支付数据处理或企业SLA/地域合同；未增加合规认证或多区域设施。 |
| 59 | quarterly access reviews someone signs off on | 无法确认 | 平台账户MFA、恢复码、组织归属、协作者权限和定期访问审查需要账户/组织证据；本轮未修改。 |
| 60 | dev, staging and production environments that match each other | 部分完成 | 固定Node24和lockfile，生产模式构建/HTTP检查；未声称存在独立staging账户或其完全等同生产。 |
| 61 | infrastructure written as code, so the setup lives somewhere other than one person's memory | 部分完成 | netlify.toml、.nvmrc、lockfile和CI在仓库；域名注册、账户权限、账单设置尚不在IaC中。 |
| 62 | a deploy pipeline that runs the tests before anything reaches customers | 已修复 | Netlify构建命令本身运行audit/lint/types/tests/内容/build/生产HTTP检查；不只依赖可被绕过的独立CI状态。 |
| 63 | one-click rollbacks, because Friday deploys happen | 部分完成／无法确认 | 已写Netlify锁定自动发布、重发旧部署、验证和修复流程；未在生产做回滚或灾备演练。 |
| 64 | zero-downtime deploys, because your customers don't have maintenance windows | 部分验证 | 沿用Netlify原子发布与旧成功部署保留；未进行并发切换负载实验或承诺SLA。 |
| 65 | feature flags, so you can ship the code without shipping the feature | 当前不适用 | 没有需要按用户灰度上线的服务；没有为清单引入远程feature-flag服务。 |
| 66 | autoscaling for the Monday morning spike | 部分验证 | 线上响应来自Netlify CDN，页面以静态生成提供；未测容量上限、峰值伸缩或新加坡实测延迟。 |
| 67 | a CDN, so the app loads fast in Singapore too | 部分验证 | 线上响应来自Netlify CDN，页面以静态生成提供；未测容量上限、峰值伸缩或新加坡实测延迟。 |
| 68 | DNS, SSL certificates, and renewals that don't expire on a Sunday | 已验证／部分无法确认 | 2026-10-26已验证Netlify签发覆盖主域和www的证书、HTTPS200及www301；实际未来自动续期/告警演练未确认。 |
| 69 | background job queues, so slow work doesn't freeze the page | 已修复／限定范围 | 正则在可终止Worker运行，设时间、输入/匹配/输出限制；解压/重复/CSV等加入预算。没有服务端任务需要队列。 |
| 70 | retries with backoff, so one flaky API call doesn't become a lost order | 不适用 | 没有外部业务请求、服务端后台任务或应用cron；CI定时审计不处理用户订单。 |
| 71 | a dead-letter queue for the jobs that fail every retry | 不适用 | 没有外部业务请求、服务端后台任务或应用cron；CI定时审计不处理用户订单。 |
| 72 | cron jobs that don't run twice the day you add a second server | 不适用 | 没有外部业务请求、服务端后台任务或应用cron；CI定时审计不处理用户订单。 |
| 73 | caching, and clearing that cache when the data changes | 已检查 | Next预渲染及部署版本负责页面缓存；没有跨用户业务缓存。用户输入/输出只保存在当前页面。 |
| 74 | SPF, DKIM and DMARC, so your password resets don't land in spam | 不适用 | 没有交易邮件或密码重置邮件。 |
| 75 | bounce and complaint handling on every transactional email | 不适用 | 没有交易邮件或密码重置邮件。 |
| 76 | storage rules, so you stop paying to keep 2021's temp files | 不适用 | 没有服务器临时上传文件或业务对象存储；构建产物归托管商管理。 |
| 77 | cost alerts, so a runaway agent loop shows up the same day and not on the invoice (we learned this one for $1,382.59) | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 78 | a disaster recovery plan, written down and tested once a year | 部分完成／无法确认 | 已写Netlify锁定自动发布、重发旧部署、验证和修复流程；未在生产做回滚或灾备演练。 |
| 79 | a second region, if your contract promises uptime one region can't deliver | 当前不适用 | 未提供受监管业务、医疗/支付数据处理或企业SLA/地域合同；未增加合规认证或多区域设施。 |
| 80 | structured logs you can search at 3am | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 81 | error tracking that groups the same bug instead of sending you 4,000 emails | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 82 | uptime checks from outside your own network | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 83 | alerts that page a human, tuned until they stop paging for nothing | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 84 | dashboards for latency, error rate and throughput | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 85 | tracing for one slow request across every service it touches | 当前不适用 | 无跨业务服务请求链，不为单个前端工具站引入分布式追踪系统。 |
| 86 | an on-call rotation, and a person who picks up | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 87 | runbooks, so the engineer on call knows what "queue depth critical" means | 已补文档 | operations.md包含发布、回滚、DNS/TLS、依赖和凭据事件处置。 |
| 88 | postmortems that change something | 无法确认 | 本次留存问题和回归测试；组织是否执行事故复盘流程无法从仓库确认。 |
| 89 | a status page customers check before they email you | 无法确认／待账户配置 | 仓库未配置持续外部uptime监控、错误聚合、预算告警、值班或状态页；operations.md明确需要验证，不伪称已启用。 |
| 90 | unit tests written by someone who knows what the logic should do | 已修复 | 新增真实输入/预期输出回归、Worker执行、恶意边界与数据保持测试；最终数量和命令见验证记录。 |
| 91 | integration tests for every third-party API you depend on | 部分验证 | 无第三方业务API；Node生产HTTP测试覆盖Next路由，浏览器验证Worker/Clipboard/File API；GA远端配置未做全套集成测试。 |
| 92 | end-to-end tests for signup, checkout and the other flows that make you money | 已按产品适配 | 无注册/结账流程；验证格式化、清空竞态、文件错误、复制失败、禁用伪运行器、隐私默认和搜索。 |
| 93 | load testing before the launch email goes out | 无法确认 | 没有对生产发压力测试，也没有五年前实体设备/多浏览器矩阵；不把本地构建和输入限额当作性能认证。 |
| 94 | test data that looks like production without being production data | 已检查 | 回归只使用合成代码、测试Unicode、数字及假网络数据，没有复制客户或生产秘密。 |
| 95 | regression tests, so fixing bug 41 doesn't bring back bug 12 | 已修复 | 新增真实输入/预期输出回归、Worker执行、恶意边界与数据保持测试；最终数量和命令见验证记录。 |
| 96 | testing on the five-year-old laptop your biggest customer's ops team still uses | 无法确认 | 没有对生产发压力测试，也没有五年前实体设备/多浏览器矩阵；不把本地构建和输入限额当作性能认证。 |
| 97 | accessibility compliance, because the enterprise contract requires it | 部分修复／非认证 | 补输入/输出/文件控件标签、键盘入口、状态/错误live region、搜索空状态；不是完整WCAG审计。 |
| 98 | subscriptions, upgrades, downgrades and proration | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 99 | failed-payment retries and dunning emails | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 100 | invoices with the customer's PO number on them, because procurement won't pay without it | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 101 | sales tax and VAT | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 102 | refunds, credits and partial refunds | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 103 | usage metering that matches what you bill, to the cent | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 104 | annual contracts with custom terms your billing logic never planned for | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 105 | revenue reports your finance team can reconcile | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 106 | webhooks that verify signatures | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 107 | webhooks that retry, with a log of every failed delivery | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 108 | a versioned API, so you can change it without breaking your customers' integrations | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 109 | API keys customers can create and revoke | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 110 | API rate limits that protect you without blocking real integrations | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 111 | a plan for the day a third-party API changes its response format without telling you | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 112 | OAuth token refresh, because tokens expire at the worst possible moment | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 113 | a sandbox where customers can test their integration | 不适用 | 没有对外业务API、webhook、OAuth或客户集成；sitemap是只读公开路由。 |
| 114 | protection against prompt injection in every field that reaches the model | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 115 | customer and patient data kept out of prompts that leave your network | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 116 | a model spend cap per customer, so one heavy user can't run up your bill | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 117 | evals, so you find out when a model update makes your answers worse | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 118 | a fallback for the afternoon your model provider goes down | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 119 | a migration plan for the day your model gets deprecated | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 120 | prompt and output logs for debugging, minus whatever you're not allowed to keep | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 121 | a human approval step for anything the AI does that can't be undone | 不适用 | 没有模型/API调用或自主执行代理；本地模板已明确能力边界。 |
| 122 | pages that load on hotel wifi | 部分修复／无法确认 | 解析器和压缩器按需加载；移除未同意即加载的统计。未完成受限带宽或移动硬件全站性能基准。 |
| 123 | empty states, loading states and error states on every screen | 已修复 | 工作区给出具体输入/编码/权限/不支持错误并保留输入；输入变更使旧输出失效；首页无结果状态和路由重试页已补。 |
| 124 | error messages a customer can act on, instead of "something went wrong" | 已修复 | 工作区给出具体输入/编码/权限/不支持错误并保留输入；输入变更使旧输出失效；首页无结果状态和路由重试页已补。 |
| 125 | forms that keep what people typed when one field fails validation | 已修复 | 工作区给出具体输入/编码/权限/不支持错误并保留输入；输入变更使旧输出失效；首页无结果状态和路由重试页已补。 |
| 126 | emails that render in every mail client your customers use | 不适用 | 没有交易邮件或密码重置邮件。 |
| 127 | notifications people can turn off | 不适用 | 没有应用推送或邮件通知；可选统计已有独立开关。 |
| 128 | undo | 部分检查 | 编辑器可使用浏览器原生编辑撤销；没有数据库删除等持久化操作。Clear会清空当前输入，未新增全局撤销历史。 |
| 129 | keyboard navigation and screen reader support | 部分修复／非认证 | 补输入/输出/文件控件标签、键盘入口、状态/错误live region、搜索空状态；不是完整WCAG审计。 |
| 130 | translations, with dates and numbers formatted for each locale | 部分修复／未完全覆盖 | 隐私说明和统计控件覆盖现有10种语言；部分工具能力/错误说明仍为英语，完整日期/数字本地化矩阵未完成。 |
| 131 | a back button that does what people expect | 已检查／部分修复 | 页面仍使用正常URL导航，跨工具workspace以slug重建避免旧结果串页；未做所有浏览器历史组合测试。 |
| 132 | code a human can read | 已改进 | 从巨大组件提取可测试处理器、文件读取、注释解析、运行器和隐私逻辑，清除伪结果死分支；剩余目录分派仍可继续拆分。 |
| 133 | code review on every change | 部分完成／组织项无法确认 | 本次有并行交叉审查与测试，README/operations写明短分支/PR流程；未声称人类已审阅或已设置远端分支保护。 |
| 134 | a branching strategy, so two people can work without overwriting each other | 部分完成／组织项无法确认 | 本次有并行交叉审查与测试，README/operations写明短分支/PR流程；未声称人类已审阅或已设置远端分支保护。 |
| 135 | monthly dependency upgrades, so you're never two major versions behind | 已修复 | 核对npm/官方来源，Next与eslint-config-next升级16.4.3；生产依赖审计0；持续扫描及Dependabot已配置。开发依赖中等风险范围差异有单独记录。 |
| 136 | framework upgrades before the old version stops getting security patches | 已修复 | 核对npm/官方来源，Next与eslint-config-next升级16.4.3；生产依赖审计0；持续扫描及Dependabot已配置。开发依赖中等风险范围差异有单独记录。 |
| 137 | deleting the dead code the AI left behind from its first three attempts | 已改进 | 从巨大组件提取可测试处理器、文件读取、注释解析、运行器和隐私逻辑，清除伪结果死分支；剩余目录分派仍可继续拆分。 |
| 138 | splitting up the 2,000-line file the AI kept appending to | 已改进 | 从巨大组件提取可测试处理器、文件读取、注释解析、运行器和隐私逻辑，清除伪结果死分支；剩余目录分派仍可继续拆分。 |
| 139 | architecture decisions written down, with the reasons | 已补文档 | README及operations说明依赖/命令/能力边界/架构选择/部署与恢复；本报告保留证据和未知项。 |
| 140 | a README that gets a new engineer running locally in under an hour | 已补文档 | README及operations说明依赖/命令/能力边界/架构选择/部署与恢复；本报告保留证据和未知项。 |
| 141 | documentation for whoever inherits this | 已补文档 | README及operations说明依赖/命令/能力边界/架构选择/部署与恢复；本报告保留证据和未知项。 |
| 142 | an admin panel for your ops team | 当前不适用 | 没有账户、订单或后台业务记录可供管理；未增加无用admin面板或代登录工具。 |
| 143 | support tooling, so customer success can answer questions without pinging engineering | 当前不适用 | 没有账户、订单或后台业务记录可供管理；未增加无用admin面板或代登录工具。 |
| 144 | a changelog customers can read | 部分完成 | 本次工程审查记录改动及功能限制；未另建面向客户的公告/发布订阅系统。 |
| 145 | terms and a privacy policy that match what the code does | 已修复／有限范围 | 隐私说明改为真实本地处理、Netlify托管、默认关闭的可选GA、偏好清除；移除不存在的联系渠道承诺。未宣称条款获法律审核。 |
| 146 | every account, domain and repo in the company's name, not the name of whoever built the prototype | 无法确认 | 平台账户MFA、恢复码、组织归属、协作者权限和定期访问审查需要账户/组织证据；本轮未修改。 |
| 147 | a bus factor higher than one | 无法确认 | 平台账户MFA、恢复码、组织归属、协作者权限和定期访问审查需要账户/组织证据；本轮未修改。 |
| 148 | reading every line the AI wrote before it ships (a senior engineer) | 部分完成／组织项无法确认 | 本次有并行交叉审查与测试，README/operations写明短分支/PR流程；未声称人类已审阅或已设置远端分支保护。 |
| 149 | designing the data model before your second customer breaks it (a backend engineer) | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 150 | explaining why the AI's fix for one bug created two new ones (a senior engineer, again) | 部分完成／组织项无法确认 | 本次有并行交叉审查与测试，README/operations写明短分支/PR流程；未声称人类已审阅或已设置远端分支保护。 |
| 151 | deploys, rollbacks, servers and the cloud bill (a DevOps engineer) | 组织项／无法确认 | 已补运维步骤，实际账单、责任人和账户访问需组织落实。 |
| 152 | answering the page at 3am when payments stop (whoever's on call) | 不适用 | 没有收费、订阅、支付、发票或金额存储。 |
| 153 | patching the framework the week a vulnerability goes public (security) | 已修复 | 核对npm/官方来源，Next与eslint-config-next升级16.4.3；生产依赖审计0；持续扫描及Dependabot已配置。开发依赖中等风险范围差异有单独记录。 |
| 154 | walking an auditor through how patient data moves (security and compliance) | 当前不适用 | 未提供受监管业务、医疗/支付数据处理或企业SLA/地域合同；未增加合规认证或多区域设施。 |
| 155 | testing what the AI says it tested (QA) | 已执行／有边界 | 执行了回归、浏览器和生产模式验证；具体结果见上方验证记录，未测试项明确列出。 |
| 156 | running a migration on a live database without losing a row (a backend engineer) | 不适用 | 没有数据库、持久化用户记录或数据迁移；仅 Git 内的工具目录/JSON 内容。 |
| 157 | saying no to the feature that breaks three others (a tech lead) | 部分完成／组织项无法确认 | 本次有并行交叉审查与测试，README/operations写明短分支/PR流程；未声称人类已审阅或已设置远端分支保护。 |
| 158 | turning "works on my laptop" into "works for every customer at once" (an architect) | 部分完成／组织项无法确认 | 本次有并行交叉审查与测试，README/operations写明短分支/PR流程；未声称人类已审阅或已设置远端分支保护。 |
| 159 | debugging the code when the AI that wrote it can't (a senior engineer) | 部分完成／组织项无法确认 | 本次有并行交叉审查与测试，README/operations写明短分支/PR流程；未声称人类已审阅或已设置远端分支保护。 |
| 160 | remembering why it's built this way, a year from now (someone who was there) | 已补文档 | README及operations说明依赖/命令/能力边界/架构选择/部署与恢复；本报告保留证据和未知项。 |
