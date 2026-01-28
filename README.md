# DB Registry - 数据库服务注册器

使用 Zeroconf (mDNS/DNS-SD) 在本地网络广播数据库服务信息。

## 功能特点

- 通过配置文件定义服务列表
- 支持多种服务类型（MySQL, PostgreSQL, Redis等）
- 自动在本地网络广播服务
- 支持自定义 TXT 记录

## 安装

1. 确保已安装 Go 1.21 或更高版本
2. 安装依赖：

```bash
go mod download
```

## 配置

编辑 `config.json` 文件添加你的服务：

```json
{
  "services": [
    {
      "name": "MySQL Database",
      "type": "_mysql._tcp",
      "port": 3306,
      "domain": "local.",
      "text": ["version=8.0", "charset=utf8mb4"]
    }
  ]
}
```

### 配置字段说明

- `name`: 服务实例名称
- `type`: 服务类型（遵循 DNS-SD 命名规范，如 `_http._tcp`）
- `port`: 服务端口号
- `domain`: 域名（通常为 `local.`）
- `text`: TXT 记录数组，用于额外的服务元数据

## 运行

```bash
# 使用默认配置文件 config.json
go run main.go

# 使用自定义配置文件
go run main.go custom-config.json
```

## 编译

```bash
# 编译为可执行文件
go build -o db_registery.exe

# 运行编译后的程序
.\db_registery.exe
```

## 常见服务类型

- MySQL: `_mysql._tcp`
- PostgreSQL: `_postgresql._tcp`
- Redis: `_redis._tcp`
- HTTP: `_http._tcp`
- HTTPS: `_https._tcp`
- MongoDB: `_mongodb._tcp`

## 发现服务

你可以使用以下工具发现已注册的服务：

- macOS: `dns-sd -B _mysql._tcp`
- Linux: `avahi-browse -r _mysql._tcp`
- Windows: 使用第三方工具如 Bonjour Browser

## 停止服务

按 `Ctrl+C` 优雅停止所有服务。

## 许可

MIT License
