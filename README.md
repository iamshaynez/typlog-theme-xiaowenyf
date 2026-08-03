# 玄墨 · xiaowenyf（Typlog）

中文杂志感 [Typlog](https://typlog.com/) 主题。自 Hugo 版 [hugo-theme-xiaowenyf](https://github.com/xiaowenz/hugo-theme-xiaowenyf) 移植，保留同一套设计宪章与视觉语言。

冷灰为纸，玄黑为墨，冷漆红点睛。

## 设计宪章

| 角色 | HEX | 用法 |
| --- | --- | --- |
| 玄黑 ink | `#141210` | 卡身 / 收边 / 主文字。**禁整页铺黑** |
| 冷灰底 paper | `#F1F1EF` | 主底色（冷灰，非暖象牙白） |
| 冷漆红 red | `#CE1432` | 唯一强调，面积 ≤5%，永不铺底 |
| 奶白 cream | `#EDEAE3` | 玄黑底上的文字与金句（不用纯白） |

**辅助灰阶**

- 冷灰底上：次级 `#5A544C` · 三级 `#9A948C` · 发丝线 `#D8D6D1`
- 玄黑底上：亮字 `#DCD7CE` · 注释 `#A39D93` · 暗线 `#3A3530`

## 特性

- **中文阅读**：Noto Serif SC + Noto Sans SC、舒适行高、首字下沉
- **杂志版式**：封面大卡、强反差字号、刊头、金句板、印章式编号
- **全站点击动效**：涟漪、缩放、下划线扫过、卡片抬起（尊重 `prefers-reduced-motion`）
- 阅读进度条、返回顶部、响应式导航
- 文章 / 标签 / 作者 / 多语言列表 / 播客详情

## 目录结构

```
.
├── home.j2          # 首页
├── list.j2          # 归档 / 通用列表
├── item.j2          # 文章 · 页面 · 播客
├── lang.j2          # 语言首页
│                    # 标签 / 作者页走 list.j2
├── theme.json
├── css/app.css      # 设计 tokens + 布局 + 组件 + 动效
├── js/main.js       # 涟漪 / 导航 / 进度 / 入场
└── _partials/       # header · footer · cards · config
```

## 本地开发

1. 在 Typlog 账户创建 Token，勾选 **theme** scope  
2. 下载 [`serve-theme`](https://github.com/typlog/serve-theme/releases) 并加入 `PATH`  
3. 在主题目录启动：

```bash
export TOKEN=pt_xxxx
export SITE=915          # 官方 demo；也可换成你的 site id
serve-theme
```

浏览器打开 `http://localhost:7000/`。

## 主题文案配置（首页大标题等）

首页上的「以留白丈量文字」、刊头副标题、金句板等 **不是** 从文章内容读的；主题里有一套默认文案，也可以用站点配置覆盖。

### 取值优先级

```
站点 Assets：_config/xiaowenyf（JSON）
    ↓ 未配置时
站点字段（如 site.summary / site.name）
    ↓ 仍没有时
主题内写死的默认值（_partials/config.j2）
```

`query.config('xiaowenyf')` 为 **PRO** 能力；非 PRO 会得到 `null`，于是走站点字段或默认文案。

### 如何配置（推荐）

1. 确认站点为 **PRO**
2. 在 Typlog 后台 **Assets** 新建 JSON 资源  
   - 路径 / 名称：`_config/xiaowenyf`  
   - 内容可参考仓库根目录的 `config.example.json`
3. 保存后刷新站点（本地 `serve-theme` 下刷新预览即可）

完整示例：

```json
{
  "brand_mark": "墨",
  "tagline": "中文杂志感 · 冷灰与玄墨",
  "hero_eyebrow": "本期开篇",
  "hero_title": "以留白<br>丈量文字",
  "hero_lead": "阅读本该有纸页翻动时的呼吸感。玄墨用冷灰底托住玄黑字，让红只出现在最该停留的地方。",
  "footer_desc": "以杂志的版式重新想象博客：强反差字号、克制的红色点睛、每一次点击都有回应。",
  "quote_text": "好的版式不抢戏，却让每一行字都站得更稳。",
  "quote_cite": "玄墨 · 设计手记"
}
```

说明：

- `hero_title` 支持 HTML，例如用 `<br>` 换行
- 字段均可选：只写你想覆盖的键即可
- 改默认文案也可直接改主题里的 `_partials/config.j2`（适合 fork 后固化自己的默认）

### 字段一览

| 配置键 | 出现位置 | 未配置时的回退 | 主题默认文案 |
| --- | --- | --- | --- |
| `hero_title` | 首页大标题 | — | `以留白<br>丈量文字` |
| `hero_eyebrow` | 首页眉题（大标题上方） | — | `本期开篇` |
| `hero_lead` | 首页导语 | `site.summary` | 冷灰为纸，玄黑为墨… |
| `tagline` | 刊头中间副行、部分页面标题 | `site.summary` | `中文杂志感 · 冷灰与玄墨` |
| `brand_mark` | 顶栏印章字、刊头 | 站点名首字 | `墨` |
| `quote_text` | 首页金句板正文 | — | `好的版式不抢戏…` |
| `quote_cite` | 首页金句板出处 | — | `玄墨 · 设计手记` |
| `footer_desc` | 页脚站点说明 | `site.summary` | 以杂志的版式重新想象博客… |

### 哪些不是配置写死的

- 文章列表、标题、摘要、标签、上下篇：来自站点内容
- 导航链接：Typlog 后台的 **Primary / Secondary links**
- 站点名称：`site.name`

## 导航与链接

- **Primary links**：顶栏默认露出前 **4** 项；其余进「更多」下拉
- **Secondary links**：一律进「更多」（适合播客外链等）
- 窄屏：汉堡菜单，主链与「更多」内链接平铺展示
- 归档入口优先 `site.posts_url`，否则 `site.list_url`
- 页脚附 RSS（`/feed.xml`）
- 顶栏露出数量可在 `_partials/shell_start.j2` 的 `nav_visible_max` 修改

## 提交主题仓库

参见 [Submit theme](https://docs.typlog.com/en/article/submit-theme/)。本仓库 `theme.json` 中的 `repo` 请改成你的 GitHub 路径，并补上预览图 `images`。

## 与 Hugo 版的对应关系

| Hugo | Typlog |
| --- | --- |
| `layouts/index.html` | `home.j2` |
| `layouts/_default/list.html` / taxonomy | `list.j2`（含 tag / author） |
| `layouts/_default/single.html` | `item.j2` |
| `assets/css/*` | `css/app.css` |
| `assets/js/main.js` | `js/main.js` |
| `params.*` | 站点 Assets：`_config/xiaowenyf`（见 `config.example.json`） |

## License

MIT
