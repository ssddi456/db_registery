/** @type {import('pm2').Module} */
module.exports = {
  apps: [{
    name: 'db-registry',
    interpreter: "C:/Program Files/nodejs/node.exe",
    interpreter_args: "--import tsx",
    script: './src/main.ts',
    watch: false,
    autorestart: true,
    mode: 'fork',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
