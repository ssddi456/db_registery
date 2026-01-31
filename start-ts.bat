@echo off
setlocal enabledelayedexpansion

:: 检查 config.json 是否存在
if not exist "config.json" (
    echo 错误: 未找到 config.json 配置文件
    pause
    exit /b 1
)

:: 检查 node_modules 是否存在
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if !errorlevel! neq 0 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
)

:: 启动 TypeScript 服务
echo 正在启动数据库注册服务...
npx tsx src/main.ts config.json
if !errorlevel! neq 0 (
    pause
)
