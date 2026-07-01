module.exports = {
  apps: [{
    name: 'histlingo',
    script: '/home/u694432103/histlingo/dist/main.js',
    cwd: '/home/u694432103/histlingo',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '15s',
    restart_delay: 3000,
    max_memory_restart: '400M',
    error_file: '/home/u694432103/histlingo/logs/error.log',
    out_file: '/home/u694432103/histlingo/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    env: {
      NODE_ENV: 'production',
      PATH: '/opt/alt/alt-nodejs20/root/usr/bin:/home/u694432103/local/bin:/usr/local/bin:/usr/bin:/bin',
      HOME: '/home/u694432103',
    },
  }]
};
