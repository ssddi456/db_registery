package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/grandcat/zeroconf"
)

// Service 服务配置结构
type Service struct {
	Name   string   `json:"name"`
	Type   string   `json:"type"`
	Port   int      `json:"port"`
	Domain string   `json:"domain"`
	Text   []string `json:"text"`
}

// Config 配置文件结构
type Config struct {
	Services []Service `json:"services"`
}

// 读取配置文件
func loadConfig(filename string) (*Config, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, fmt.Errorf("读取配置文件失败: %w", err)
	}

	var config Config
	if err := json.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("解析配置文件失败: %w", err)
	}

	return &config, nil
}

// 注册服务
func registerService(ctx context.Context, svc Service) (*zeroconf.Server, error) {
	server, err := zeroconf.Register(
		svc.Name,   // 服务实例名称
		svc.Type,   // 服务类型
		svc.Domain, // 域名
		svc.Port,   // 端口
		svc.Text,   // TXT记录
		nil,        // 网络接口 (nil = 所有接口)
	)
	if err != nil {
		return nil, fmt.Errorf("注册服务 %s 失败: %w", svc.Name, err)
	}

	log.Printf("✓ 已注册服务: %s (%s) 端口: %d", svc.Name, svc.Type, svc.Port)
	return server, nil
}

func main() {
	// 获取可执行文件所在目录
	exePath, err := os.Executable()
	if err != nil {
		log.Fatalf("获取可执行文件路径失败: %v", err)
	}
	exeDir := filepath.Dir(exePath)

	// 读取配置
	configFile := filepath.Join(exeDir, "config.json")
	if len(os.Args) > 1 {
		configFile = os.Args[1]
	}

	config, err := loadConfig(configFile)
	if err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	log.Printf("从 %s 加载了 %d 个服务配置\n", configFile, len(config.Services))

	// 创建上下文
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 注册所有服务
	var servers []*zeroconf.Server
	for _, svc := range config.Services {
		server, err := registerService(ctx, svc)
		if err != nil {
			log.Printf("警告: %v", err)
			continue
		}
		servers = append(servers, server)
	}

	if len(servers) == 0 {
		log.Fatal("没有成功注册任何服务")
	}

	log.Printf("\n成功注册 %d 个服务，服务正在运行...", len(servers))
	log.Println("按 Ctrl+C 停止服务")

	// 等待中断信号
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig

	log.Println("\n正在关闭服务...")
	
	// 关闭所有服务
	for _, server := range servers {
		server.Shutdown()
	}

	// 等待一小段时间确保注销消息发送出去
	time.Sleep(time.Millisecond * 100)
	log.Println("所有服务已关闭")
}
