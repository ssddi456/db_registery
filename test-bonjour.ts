import { Bonjour } from 'bonjour-service';

const bonjour = new Bonjour();

const service = bonjour.publish({
  name: 'Test Service',
  type: 'http',
  port: 3000,
  txt: {
    version: '1.0'
  }
});

console.log('正在发布服务...');

service.on('up', () => {
  console.log('✓ 服务已发布');
});

service.on('error', (error) => {
  console.error('✗ 服务发布失败:', error);
});

setTimeout(() => {
  bonjour.destroy();
  console.log('服务已关闭');
  process.exit(0);
}, 3000);
