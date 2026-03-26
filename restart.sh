#!/bin/bash

echo "=== 重启 Musk Chat 服务 ==="

# 重启后端
echo "[1/2] 重启后端 (端口 3001)..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1
cd /root/worksapce/claude/chatting/musk-chat/backend
node server.js > /tmp/server.log 2>&1 &
sleep 2

# 重启前端
echo "[2/2] 重启前端 (端口 5173)..."
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 1
cd /root/worksapce/claude/chatting/musk-chat/frontend
node_modules/.bin/vite --host 0.0.0.0 --port 5173 > /tmp/vite.log 2>&1 &
sleep 3

echo ""
echo "=== 服务状态 ==="
echo "后端 (3001): $(lsof -ti:3001 > /dev/null && echo '运行中' || echo '未运行')"
echo "前端 (5173): $(lsof -ti:5173 > /dev/null && echo '运行中' || echo '未运行')"
echo ""
echo "日志:"
echo "--- 后端日志 ---"
cat /tmp/server.log
echo ""
echo "--- 前端日志 ---"
tail -5 /tmp/vite.log
