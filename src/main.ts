import * as fs from 'fs';
import * as path from 'path';
import { Bonjour } from 'bonjour-service';
import type { Config } from './types';

function loadConfig(filename: string): Config {
  try {
    const data = fs.readFileSync(filename, 'utf-8');
    const config = JSON.parse(data) as Config;
    return config;
  } catch (error) {
    throw new Error(`读取配置文件失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function convertTextToObj(text?: string[]): Record<string, string> | undefined {
  if (!text || text.length === 0) return undefined;
  
  const result: Record<string, string> = {};
  for (const item of text) {
    const [key, ...valueParts] = item.split('=');
    const value = valueParts.join('=');
    if (key) {
      result[key] = value;
    }
  }
  
  return Object.keys(result).length > 0 ? result : undefined;
}

async function main(): Promise<void> {
  const configFile = path.join(__dirname, '../config.json');
  const configFilePath = process.argv.length > 2 ? process.argv[2] : configFile;

  const config = loadConfig(configFilePath);

  console.log(`从 ${configFilePath} 加载了 ${config.services.length} 个服务配置\n\n`);

  const bonjour = new Bonjour();
  let registeredCount = 0;
  const totalServices = config.services.length;

  for (const svc of config.services) {
    const txt = convertTextToObj(svc.text);

    const service = bonjour.publish({
      name: svc.name,
      type: svc.type,
      port: svc.port,
      host: svc.host,
      txt: txt
    });

    service.on('up', () => {
      registeredCount++;
      console.log(`✓ 已注册服务: ${svc.name} (${svc.type}) 端口: ${svc.port}`);
    });

    service.on('error', (error) => {
      console.log(`⚠ 警告: 注册服务 ${svc.name} 失败: ${error instanceof Error ? error.message : String(error)}`);
      registeredCount++;
    });

  }

  await new Promise<void>((resolve) => {
    const checkInterval = setInterval(() => {
      if (registeredCount >= totalServices) {
        clearInterval(checkInterval);
        console.log(`\n成功注册 ${registeredCount}/${totalServices} 个服务，服务正在运行...`);
        console.log('按 Ctrl+C 停止服务');
        resolve();
      }
    }, 100);
  });

  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      console.log('\n正在关闭服务...');
      bonjour.destroy();
      console.log('所有服务已关闭');
      resolve();
    });

    process.on('SIGTERM', () => {
      console.log('\n正在关闭服务...');
      bonjour.destroy();
      console.log('所有服务已关闭');
      resolve();
    });
  });
}

main().catch((error) => {
  console.error('错误:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
