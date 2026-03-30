# Background Remover - Next.js

使用 Next.js + TypeScript + Tailwind CSS 构建的图片背景移除工具。

## 技术栈

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Remove.bg API

## 本地开发

1. **安装依赖**
```bash
npm install
```

2. **设置环境变量**
创建 `.env.local` 文件：
```
REMOVEBG_API_KEY=your_api_key_here
```

3. **运行开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 设置环境变量 `REMOVEBG_API_KEY`
4. 部署

## 功能

- 上传图片
- AI 移除背景
- 原图/处理后对比
- 下载处理后的图片
