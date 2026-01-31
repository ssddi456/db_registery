import { Bonjour } from 'bonjour-service';

console.log('1. 创建 Bonjour 实例');
const bonjour = new Bonjour();

console.log('2. 发布服务');
const service = bonjour.publish({
  name: 'Test Service',
  type: 'http',
  port: 3000
});

console.log('3. 设置事件监听器');
service.on('up', () => {
  console.log('✓ 服务已发布');
});

service.on('error', (error) => {
  console.error('✗ 服务发布失败:', error);
});

console.log('4. 等待 2 秒...');
setTimeout(() => {
  console.log('5. 关闭服务');
  bonjour.destroy();
  console.log('6. 退出');
  process.exit(0);
}, 2000);
