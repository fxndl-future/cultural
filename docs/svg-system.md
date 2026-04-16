## SVG 集成方案（Vite + React + TS）

### 现状与问题识别
- 现有图标主要来自 lucide-react（内联 SVG 组件），自定义季节图形为内联 SVG（React 组件）。
- 在部分场景中仍存在 “动态 class 拼接” 与 “缺少统一的 a11y/尺寸/颜色入口” 的可维护性风险。
- 对外部 SVG 资源（.svg 文件）缺少统一的压缩、雪碧图、命名与引入规范。

### 目标
- 小图标走 SVG 雪碧图（减少重复 DOM、提升缓存复用、便于统一控制颜色与尺寸）。
- 大型/可动画的 SVG 走内联组件（便于 GSAP 控制元素、支持分层动效）。
- 全部 SVG 都具备一致的可访问性策略（可读/装饰两类）。
- 配套自动化压缩（SVGO），并提供新增流程与回滚方案。

---

## 目录结构
- `src/assets/icons/**.svg`：可进入雪碧图的小图标（建议单色、使用 currentColor）。
  - 例：`src/assets/icons/season/spring-mark.svg`
- `src/components/ui/SvgIcon.tsx`：雪碧图渲染组件（统一 aria、title/desc、尺寸）。
- `src/components/SeasonalDecor.tsx`：可动画的大型季节 SVG 场景（内联 React 组件）。

---

## 引入方式与最佳实践

### 1) 雪碧图（推荐用于 UI 图标）
- 通过 `vite-plugin-svg-icons` 在构建阶段将 `src/assets/icons` 生成符号（symbol）。
- 在入口文件引入注册模块：
  - `src/main.tsx`：`import 'virtual:svg-icons-register'`
- 渲染使用：
  - `<SvgIcon name="season-spring-mark" size={16} decorative />`

### 2) 内联 SVG（推荐用于可交互/可动画场景）
- 使用 React 组件输出 `<svg>`，将关键元素标注 `data-*`，便于 GSAP 选择并做细分动画。
- 大型场景建议：
  - `viewBox` 固定
  - `preserveAspectRatio` 明确
  - 仅使用 `transform/opacity` 相关动画（性能稳定）

---

## 动态样式（主题色 / 悬停态 / 暗色模式）
- 小图标一律使用 `currentColor`，颜色由外层 `color` 或 `text-*` 控制。
- 组件层建议以 CSS 变量统一主题：
  - `--season-primary/--season-accent` 等
- 悬停/active：由按钮容器控制 `text-*` 与透明度即可，不直接修改 SVG path 颜色。

---

## 可访问性（WCAG 2.1 AA）

### 规范
- 装饰性 SVG：`aria-hidden="true"`（不进入读屏）。
- 可读 SVG：`role="img" + aria-label`；如有标题/描述则注入 `<title>/<desc>` 并用 `aria-labelledby` 关联。

### 项目实现
- `SvgIcon` 已统一处理：
  - `decorative=true` -> `aria-hidden`
  - 否则 -> `role="img"` + `aria-label` + 可选 `<title>/<desc>`

---

## 自动化压缩（SVGO）
- 配置文件：`svgo.config.mjs`
- 执行脚本：
  - `npm run optimize:svg`
- 约束建议：
  - 小图标 ≤ 1KB（移动端 ≤ 48px 使用）
  - 单个 SVG ≤ 15KB
  - 雪碧图总量 ≤ 100KB（按需拆目录/按页面分组）

---

## 新增图标流程
1. 将新 SVG 放到 `src/assets/icons/<group>/<name>.svg`
2. 确保 fill/stroke 使用 `currentColor`
3. 运行 `npm run optimize:svg`
4. 使用 `<SvgIcon name="<group>-<name>" />` 引用

---

## CI 建议（可选）
- 在 CI 中执行：
  - `npm run lint`
  - `npm run optimize:svg`
  - `npm test`
  - `npm run build`

---

## 回滚方案
- 若雪碧图插件导致构建/兼容问题：
  1. 回滚 `vite.config.ts` 中 `createSvgIconsPlugin` 配置
  2. 移除 `src/main.tsx` 的 `virtual:svg-icons-register` 引入
  3. 将 `SvgIcon` 的使用点替换为原有 lucide-react 或内联 SVG

