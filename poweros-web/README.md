# PowerOS Web Demo

`PowerOS — 电厂智能体原生操作系统` 的前端演示工程。

这是一个面向火电厂/综合能源电厂场景的产品化 Demo，重点演示：

- 事件即入口
- 智能体即能力中心
- 角色工作台而不是传统模块堆叠
- 数字现场作为统一上下文
- 建议行动与处置闭环而不是只展示数据

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Recharts
- lucide-react

## 本地运行

```bash
cd poweros-web
npm install
npm run dev
```

默认访问地址：

- [http://localhost:5173](http://localhost:5173)

生产构建：

```bash
npm run build
```

## 演示部署

仓库已经补好两套部署配置：

- GitHub Pages: [https://medai2026.github.io/PowerOS/](https://medai2026.github.io/PowerOS/)
- Vercel: 仓库根目录已提供 `vercel.json`，导入仓库后可直接识别构建输出

说明：

- GitHub Pages 构建来自仓库根目录下的 `.github/workflows/deploy-pages.yml`
- Pages 发布时会自动注入 `/PowerOS/` 作为静态资源基路径
- 为兼容 Pages 静态托管，前端会在 `github.io` 域名下自动切换为 hash 路由
- Vercel 已配置 SPA rewrite，页面刷新不会丢路由
- 后续任意推送到 `poweros-web/` 目录都会自动触发 GitHub Pages 发布流程

## 已实现页面

- `/` PowerOS 总控台
- `/events` 智能事件中心
- `/agents` 智能体协同中心
- `/assets` 设备健康工作台
- `/safety` 安全作业协同中心
- `/site` 数字现场
- `/operations` 运行指挥工作台
- `/inspection` 巡检与处置闭环中心
- `/executive` 管理驾驶舱

## 关键演示能力

### 1. 角色视角切换

支持以下 4 类角色视角：

- 值长
- 设备专工
- 安监人员
- 厂领导

当前主要影响总控台首页的关注重点、建议摘要和关键指标。

### 2. 智能事件联动

任意事件可以点击打开全局详情抽屉，展示：

- 事件描述
- 来源智能体
- 关联设备
- 关联区域
- 影响分析
- 建议动作
- 关联智能体

### 3. 智能体协同剧本

已内置 3 个可触发剧本：

- 场景一：设备异常
- 场景二：交叉作业风险
- 场景三：高风险预警闭环

点击后会演示：

- 智能体状态变化
- 协同时间线推进
- 协同日志输出
- 最终建议形成

### 4. 数字现场图层

数字现场页面支持切换：

- 设备层
- 安全层
- 作业层
- 人员层
- 风险层

## mock 数据说明

所有页面均由 mock 数据驱动，不依赖真实后台。

当前内置数据类型包括：

- 设备清单与健康趋势
- 事件列表
- 智能体状态
- 工作票/作业票
- 厂区区域与风险热区
- 巡检任务
- 管理摘要与趋势数据
- 协同剧本

核心数据文件：

- `src/mock/poweros-data.ts`

全局状态和交互：

- `src/store/usePowerStore.ts`

## 项目结构

```text
src/
  app/                应用入口
  components/         通用 UI 与共享组件
  layouts/            全局布局与导航
  mock/               mock 数据
  pages/              各核心页面
  routes/             路由定义
  store/              Zustand 状态管理
  types/              领域类型定义
  utils/              工具函数
```

## 设计原则

- 深色工业科技风，避免传统后台模板感
- 卡片化工作台，强调信息层级与控制中心气质
- 用事件和建议驱动导航，而不是菜单和表格驱动
- 用智能体协同和现场上下文拉开与传统系统的差异

## 当前说明

- 本工程已经通过 `npm run build` 验证
- 当前为纯前端演示工程，后续可接入真实 API 或 mock service
- 根目录下保留了早期 Python PoC，本工程为新的正式前端 Demo 实现
