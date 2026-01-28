#!/bin/bash

# 检查 config.json 是否存在
if [ ! -f "config.json" ]; then
    echo "错误: 未找到 config.json 配置文件"
    exit 1
fi

# 编译二进制文件（如果不存在）
if [ ! -f "db_registery" ]; then
    echo "正在编译项目..."
    go build -o db_registery main.go
    if [ $? -ne 0 ]; then
        echo "错误: 编译失败"
        exit 1
    fi
fi

# 启动二进制文件
echo "正在启动数据库注册服务..."
./db_registery config.json
