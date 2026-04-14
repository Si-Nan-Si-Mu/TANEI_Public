# TANEI 前端项目说明

本文档说明本仓库中 **Vue 3 + Vite** 主站前端的目录结构、关键文件职责与运行方式，便于维护与协作。

---

## 1. 技术栈与职责划分

| 技术 | 用途 |
|------|------|
| **Vue 3**（组合式 API / `<script setup>`） | 页面与组件 UI |
| **Vue Router** | 单页路由与登录守卫 |
| **Pinia** | 全局状态（登录态、UI 等） |
| **Vite** | 开发与打包；开发时将 `/api` 代理到本机后端 |
| **JSEncrypt** | 使用 `assets/public.pem` 对登录/注册敏感字段做 RSA 加密后提交 |

**与后端的关系**：开发环境下，浏览器请求 `/api/*` 由 `vite.config.js` 转发到 `http://127.0.0.1:8000`（FastAPI）。生产环境需由网关或同域反向代理将 `/api` 指到真实 API。

---

## 2. 仓库根目录（前端子项目）

| 文件 / 目录 | 说明 |
|-------------|------|
| `index.html` | Vite 入口 HTML：挂载 `#app`、全站字体与首屏 `page-loader` |
| `vite.config.js` | Vite 配置：`@` → `src/`，以及 `/api` 开发代理 |
| `package.json` / `package-lock.json` / `pnpm-lock.yaml` | 依赖与脚本（`dev` / `build` / `preview` / `start`） |
| `server.cjs` | **可选**：不经过 Vite 时，用 Node（CommonJS）提供静态文件与简易 RSA 演示接口；私钥路径可通过环境变量 `TANEI_PRIVATE_KEY_PATH` 指定，**切勿将私钥提交到本仓库** |
| `.gitignore` | 忽略 `node_modules`、`dist`、`.env*`、`TN私钥` 等 |
| `assets/` | 构建时参与打包或引用的静态资源（见下文） |
| `public/` | 原样拷贝到构建产物的静态目录（见下文） |
| `src/` | 主应用源码（见第 3 节） |

---

## 3. `src/` 应用源码结构

### 3.1 入口与根组件

| 文件 | 说明 |
|------|------|
| `main.js` | 创建应用：注册 Pinia → `authStore.hydrateSession()` 恢复会话 → 注册路由 → 挂载；并全局引入 `loader` / `sakura` / `cursor` 与各样式表 |
| `App.vue` | 根组件：仅 `<RouterView />`；根据路由 `meta.title`、`meta.bodyClass` 同步 `document.title` 与 `body` 的页面类名 |

### 3.2 路由 `router/index.js`

- 使用 `createWebHistory`（History 模式）。
- **路由与页面**（`meta.title` / `meta.bodyClass` 用于整页主题）：

| 路径 | 名称 | 组件 | 备注 |
|------|------|------|------|
| `/` | `home` | `HomePage.vue` | 首页 |
| `/login` | `login` | `LoginPage.vue` | 登录 |
| `/register` | `register` | `RegisterPage.vue` | 注册 |
| `/agreement` | `agreement` | `AgreementPage.vue` | 用户协议 |
| `/settings` | `settings` | `SettingsPage.vue` | `requiresAuth: true` |
| `/logout` | `logout` | `LogoutPage.vue` | 退出流程 |
| `/departments/tech` | `department-tech` | `TechDepartmentPage.vue` | 技术部 |
| `/departments/network` | `department-network` | `NetworkDepartmentPage.vue` | 网络部 |
| `/departments/planning` | `department-planning` | `PlanningDepartmentPage.vue` | 策联部 |
| `/departments/design` | `department-design` | `DesignDepartmentPage.vue` | 概设部 |

- **`beforeEach` 守卫**：对 `meta.requiresAuth` 为真的路由，等待会话水合完成后若未登录则跳转登录页并带上 `redirect` 查询参数。

### 3.3 页面 `pages/`

| 文件 | 说明 |
|------|------|
| `HomePage.vue` | 社团首页主内容（与 `useHomeScrollSpy`、`useScrollReveal` 等配合） |
| `LoginPage.vue` / `RegisterPage.vue` | 表单与调用 `api/auth` |
| `AgreementPage.vue` | 协议正文与样式 |
| `SettingsPage.vue` | 个人资料、头像上传及**加入部门申请**等 |
| `LogoutPage.vue` | 调用登出 API 并清理状态 |
| `departments/DepartmentPageShell.vue` | 部门页通用壳（侧栏、布局） |
| `departments/*DepartmentPage.vue` | 各部落地页：嵌入 `DepartmentMembers`、`DepartmentAdminPanel`（部长/管理员审批）等 |

### 3.4 组件 `components/`

| 文件 / 目录 | 说明 |
|-------------|------|
| `layout/SiteHeader.vue` | 顶栏导航（结合 `useAppNavItems`） |
| `layout/SiteFooter.vue` | 页脚 |
| `layout/PageLoader.vue` | 与 `index.html` 中首屏 loader 衔接（若使用） |
| `layout/DepartmentSidebar.vue` | 部门子站侧栏 |
| `TrainingDocs.vue` | 培训资料列表；管理员可重命名、删除（调用 `api/documents`） |
| `DepartmentMembers.vue` | 展示部门成员（头像、昵称、博客链接等） |
| `DepartmentAdminPanel.vue` | 部门加入申请的审批（通过 `api/departments`） |

### 3.5 接口层 `api/`

| 文件 | 说明 |
|------|------|
| `auth.js` | 读取 `assets/public.pem`，RSA 加密后请求登录/注册；`requestJson` 拉取会话、登出等 |
| `profile.js` | 用户资料、头像上传 |
| `documents.js` | 培训资料列表、上传、下载链接、**重命名（PUT）**、**删除（DELETE）** |
| `departments.js` | 我的部门、成员列表、加入申请、部长审批通过/拒绝 |

所有接口在开发环境走相对路径 `/api/...`，由 Vite 代理到后端。

### 3.6 状态 `stores/`

| 文件 | 说明 |
|------|------|
| `auth.js` | 登录态、`hydrateSession`、用户信息、登出逻辑 |
| `ui.js` | 与 UI 相关的全局状态（侧栏、主题等，视实现而定） |

### 3.7 组合式函数 `composables/`

| 文件 | 说明 |
|------|------|
| `useAppNavItems.js` | 根据是否登录，在基础导航后追加「设置/退出」或「登录/注册」 |
| `useHomeScrollSpy.js` | 首页滚动与区块联动 |
| `useScrollReveal.js` | 滚动进入视口时的展示动画 |

### 3.8 脚本库 `libs/`

| 文件 | 说明 |
|------|------|
| `loader.js` | 首屏加载完成后隐藏 `#page-loader` |
| `sakura.js` | 首页樱花等装饰动效 |
| `cursor.js` | 自定义光标或指针相关效果 |

### 3.9 样式 `styles/`

| 文件 | 说明 |
|------|------|
| `styles.css` | 全站基础样式 |
| `login.css` | 登录/注册页 |
| `agreement.css` | 协议页 |
| `theme-overrides.css` | 主题覆盖、变量 |
| `cursor.css` | 与 `libs/cursor.js` 配套的样式 |

---

## 4. `assets/` 静态资源

| 文件 | 说明 |
|------|------|
| `favicon.svg` / `avatar-placeholder.svg` | 图标与默认头像占位 |
| `public.pem` | **RSA 公钥**（明文），供 `auth.js` 加密；与后端私钥配对；**不要**把私钥放进本目录或提交到仓库 |
| `*.jpg` 等 | 站点用到的图片资源（如成员展示图，按实际需求维护） |

---

## 5. `public/` 不经打包的静态内容

| 路径 | 说明 |
|------|------|
| `public/source/TN_des/` | 历史静态「概设」相关站点：HTML、CSS、大量教学用图片/视频/文档，由主站 iframe 或链接引用（见各页面实现） |
| `public/source/TN_web/teacher-training-agent/` | 嵌套的「教师培训代理」小项目：自有 `package.json`、`vite.config.js`、`src/`（Vue）、`front/`（传统 HTML/JS）、`vendor/` 等；**不要**在该目录内重新初始化 Git（避免子仓库指针问题）；依赖目录 `node_modules` 由 `.gitignore` 排除，克隆后需在子目录内自行 `npm install` 如需单独构建 |

---

## 6. 开发与构建命令

```bash
npm install
npm run dev      # 启动 Vite，默认配合本机 8000 端口后端
npm run build    # 输出到 dist/
npm run preview  # 本地预览构建结果
```

可选（不替代 Vite 联调后端）：

```bash
npm run start    # node server.cjs，仅静态 + 演示 API
```

---

## 7. 路径别名与安全提示

- **`@/`** 在源码中等同于 `src/`，由 `vite.config.js` 的 `resolve.alias` 配置。
- **勿提交**：`.env`、`.env.local`、任何私钥文件、`node_modules/`、`dist/`。
- 若仓库中曾出现合并冲突残留，提交前请全局搜索 `<<<<<<<` 并清理。

---

## 8. 文档更新

- **2026年04月14日**：新增本文件，梳理前端目录与职责；将可选静态服务入口改为 `server.cjs`（与 `package.json` 的 `"type": "module"` 兼容）；补充 `npm run start`、`.gitignore` 私钥相关规则。
