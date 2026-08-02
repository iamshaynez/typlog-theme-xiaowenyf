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

## 可选主题配置（PRO）

在站点 Assets 中创建 JSON 文件，路径：`_config/xiaowenyf`：

```json
{
  "brand_mark": "墨",
  "tagline": "中文杂志感 · 冷灰与玄墨",
  "hero_eyebrow": "本期开篇",
  "hero_title": "以留白<br>丈量文字",
  "hero_lead": "阅读本该有纸页翻动时的呼吸感。",
  "footer_desc": "以杂志的版式重新想象博客。",
  "quote_text": "好的版式不抢戏，却让每一行字都站得更稳。",
  "quote_cite": "玄墨 · 设计手记"
}
```

非 PRO 站点会使用站点名称 / 简介等默认值。

## 导航与链接

- 主导航读取站点 **Primary links**（及 Secondary links）
- 归档入口优先 `site.posts_url`，否则 `site.list_url`
- 页脚社交使用平台内置 `render_social_icons`，并附 RSS

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
