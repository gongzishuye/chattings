# Musk Chat

与埃隆·马斯克对话的 AI 聊天应用。

## 项目结构

```
musk-chat/
├── backend/          # Express 后端服务器
│   ├── server.js
│   ├── package.json
│   └── .env          # API 密钥配置
└── frontend/         # React 前端
    ├── src/
    │   ├── App.jsx
    │   ├── Chat.jsx
    │   └── ...
    └── package.json
```

## 快速开始

### 1. 配置 API 密钥

编辑 `backend/.env` 文件，添加你的 Anthropic API 密钥：

```
ANTHROPIC_API_KEY=your-api-key-here
```

### 2. 启动后端服务器

```bash
cd backend
npm install
npm start
```

服务器将在 http://localhost:3001 运行

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:5173 运行

### 4. 开始聊天

在浏览器中打开 http://localhost:5173，开始与"马斯克"对话吧！

## 功能

- 🚀 ChatGPT 风格的深色主题界面
- 💬 流式响应，实时显示 AI 回复
- 👤 简洁的侧边栏设计
- 📱 响应式布局，支持移动端
