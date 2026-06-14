module.exports = {
  apps: [{
    name: 'seoul-beauty-trip',
    script: '/home/user/webapp/node_modules/.bin/ts-node',
    args: '--project /home/user/webapp/tsconfig.json /home/user/webapp/standalone.ts',
    cwd: '/home/user/webapp',
    env: {
      NODE_ENV: 'development',
      TS_NODE_TRANSPILE_ONLY: 'true'
    },
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
