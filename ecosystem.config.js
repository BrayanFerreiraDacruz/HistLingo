module.exports = {
  apps: [{
    name: 'histlingo',
    script: '/home/u694432103/histlingo/dist/main.js',
    cwd: '/home/u694432103/histlingo',
    instances: 1,
    autorestart: true,
    watch: false,
    max_restarts: 999,
    restart_delay: 2000,
  }]
};
