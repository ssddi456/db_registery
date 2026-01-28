@echo off
setlocal enabledelayedexpansion

:: 检查 config.json 是否存在
if not exist "config.json" (
    echo 错误: 未找到 config.json 配置文件
    pause
    exit /b 1
)

:: 编译二进制文件（如果不存在）
if not exist "db_registery.exe" (
    echo 正在编译项目...
    go build -o db_registery.exe main.go
    if !errorlevel! neq 0 (
        echo 错误: 编译失败
        pause
        exit /b 1
    )
)

:: 启动二进制文件
echo 正在启动数据库注册服务...
db_registery.exe config.json
if !errorlevel! neq 0 (
    pause
)
