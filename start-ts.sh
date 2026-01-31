#!/bin/bash

# 检查 config.json 是否存在
if [ ! -f "config.json" ]; then
    echo "错误: 未找到 config.json 配置文件"
    exit 1
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖安装失败"
        exit 1
    fi
fi

# 启动 TypeScript 服务
echo "正在启动数据库注册服务..."
npx tsx src/main.ts config.json
