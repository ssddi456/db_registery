# AGENTS.md - db_registery 开发指南

## 项目概述

db_registery 是一个使用 Zeroconf (mDNS/DNS-SD) 在本地网络广播数据库服务信息的 Go 应用程序。

## 构建和运行命令

### 基本构建
```bash
# Windows 构建
go build -o db_registery.exe -ldflags "-H windowsgui"  # 无控制台窗口
go build -o db_registery.exe                          # 有控制台窗口

# Linux/macOS 构建
go build -o db_registery

# 下载依赖
go mod download
go mod tidy

# 运行应用
go run main.go [config-file]
```

### 启动脚本
```bash
# Linux/macOS
./start.sh

# Windows
start.bat          # 双击运行
cmd /c start.bat   # 命令行运行
```

### Windows 特定命令
```cmd
# 检查 Go 环境
go version
go env

# 编译为 Windows 服务
go build -o db_registery.exe -tags service

# 创建 Windows 安装包（如果有相关脚本）
makensis windows-installer.nsi
```

### 测试
```bash
# 运行所有测试
go test ./...

# 运行特定测试
go test -run TestName

# 运行特定包的测试
go test ./pkg/name

# 测试覆盖率
go test -cover ./...

# 生成覆盖率报告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html

# 性能测试
go test -bench=. ./...

# 竞争检测
go test -race ./...
```

### 代码检查工具
```bash
# 代码格式化
go fmt ./...

# 静态分析
go vet ./...

# 代码检查（需要安装 golangci-lint）
golangci-lint run

# 安全扫描
gosec ./...
```

## 代码风格指南

### 1. 包和导入
- 包名使用小写字母，简短且有意义
- 导入分组：标准库、第三方库、本地包，组之间用空行分隔
- 避免使用不必要的别名
- 导入顺序按字母排列

```go
import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"
    
    "github.com/grandcat/zeroconf"
)
```

### 2. 命名规范
- 变量名和函数名使用 camelCase
- 常量使用大写字母和下划线
- 结构体和接口名使用 PascalCase
- 私有变量/函数以小写字母开头
- 公开变量/函数以大写字母开头

### 3. 结构体定义
- 结构体字段使用 PascalCase
- 为字段添加 JSON 标签（如果是 API 结构体）
- 有意义的字段注释

```go
// Service 服务配置结构
type Service struct {
    Name   string   `json:"name"`
    Type   string   `json:"type"`
    Port   int      `json:"port"`
    Domain string   `json:"domain"`
    Text   []string `json:"text"`
}
```

### 4. 错误处理
- 使用 fmt.Errorf 包装错误
- 错误信息使用中文，描述清晰
- 函数返回错误时，应提供足够的上下文
- 严重错误使用 log.Fatalf 终止程序
- 非致命错误使用 log.Printf 打印日志

```go
if err != nil {
    return nil, fmt.Errorf("读取配置文件失败: %w", err)
}
```

### 5. 函数设计
- 函数应保持单一职责
- 函数名应清晰表达其功能
- 参数列表不宜过长
- 合理使用 context.Context
- 优雅处理关闭和清理

### 6. 日志记录
- 使用 log 包进行日志记录
- 日志信息使用中文
- 成功操作使用带符号的日志：✓
- 警告和错误要有明确的标识

```go
log.Printf("✓ 已注册服务: %s (%s) 端口: %d", svc.Name, svc.Type, svc.Port)
log.Printf("警告: %v", err)
```

### 7. 配置管理
- 使用 JSON 格式的配置文件
- 配置文件名默认为 config.json
- 支持命令行参数指定配置文件路径
- 配置结构体应有清晰的字段定义和 JSON 标签

### 8. 信号处理
- 优雅处理系统中断信号
- 实现资源清理逻辑
- 使用 signal.Notify 捕获信号

```go
sig := make(chan os.Signal, 1)
signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
<-sig
```

## 技术栈

- Go 1.24.0
- github.com/grandcat/zeroconf v1.0.0 (Zeroconf/mDNS-SD 实现)

## 项目结构

```
db_registery/
├── main.go          # 主程序入口
├── config.json      # 默认配置文件
├── go.mod           # Go 模块定义
├── go.sum           # 依赖校验
├── start.sh         # Linux/macOS 启动脚本
├── start.bat        # Windows 启动脚本
├── AGENTS.md        # 开发指南（本文件）
└── README.md        # 项目文档
```

## 开发注意事项

1. **网络编程**：本项目涉及网络编程，使用 Zeroconf 进行服务发现
2. **并发安全**：注意并发操作的安全性
3. **资源管理**：确保服务注册器正确关闭和清理
4. **跨平台支持**：代码应支持 Windows、Linux 和 macOS
5. **配置驱动**：所有服务配置通过配置文件管理
6. **优雅关闭**：实现优雅的服务关闭机制
7. **Windows 特性**：支持编译为 Windows 服务，支持控制台窗口隐藏
8. **防火墙兼容**：确保 mDNS 流量（UDP 5353）通过防火墙

## 调试建议

1. 使用 `go run main.go` 进行快速测试
2. 检查配置文件的 JSON 格式是否正确
3. 验证网络端口是否可用
4. 使用系统工具验证 mDNS 服务是否正常工作
5. 在不同平台上测试启动脚本
6. **Windows 调试**：使用 Wireshark 监控 UDP 5353 端口的 mDNS 流量
7. **服务调试**：使用 Windows 事件查看器查看服务日志（如果安装为服务）
8. **网络诊断**：使用 `netstat -an | findstr 5353` 检查端口占用

## Windows 运行指南

### Windows 服务部署
```powershell
# 使用 NSSM (Non-Sucking Service Manager) 安装为 Windows 服务
nssm install db_registery "C:\path\to\db_registery.exe"
nssm set db_registery AppDirectory "C:\path\to"
nssm set db_registery DisplayName "Database Service Registry"
nssm set db_registery Description "广播数据库服务信息的 mDNS 服务"

# 启动服务
net start db_registery

# 停止服务
net stop db_registery
```

### Windows 防火墙配置
```cmd
# 允许 mDNS 流量（UDP 5353）
netsh advfirewall firewall add rule name="mDNS" dir=in action=allow protocol=UDP localport=5353

# 允许应用出站连接（如果需要）
netsh advfirewall firewall add rule name="db_registery" dir=out action=allow program="C:\path\to\db_registery.exe"
```

### Windows 调试工具
```cmd
# 查看网络连接
netstat -an | findstr 5353

# 查看进程
tasklist | findstr db_registery

# 使用 Wireshark 监控 mDNS 流量
# 过滤器: udp.port == 5353
```

### Windows 事件日志集成
```go
// 如需集成 Windows 事件日志，可使用 golang.org/x/sys/windows/svc/eventlog
```

## 部署建议

1. **Windows 部署**：
   - 编译为静态二进制文件以简化部署
   - 配置文件应与可执行文件在同一目录
   - 考虑安装为 Windows 服务以实现自动启动
   - 配置防火墙规则允许 mDNS 流量（UDP 5353）

2. **Linux/macOS 部署**：
   - 使用 systemd 或其他服务管理器管理长期运行的进程
   - 确保 avahi-daemon 服务正在运行（Linux）
   - 配置文件应与可执行文件在同一目录

3. **通用要求**：
   - 确保目标系统支持 mDNS (大多数现代系统默认支持)
   - 检查网络接口是否支持多播
   - 验证 DNS-SD 服务未被防火墙阻止