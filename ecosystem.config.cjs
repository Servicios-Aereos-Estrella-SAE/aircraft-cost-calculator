module.exports = {
  apps: [
    {
      name: 'aircraft-calculator.bo-sae.com.mx',
      port: 3003,
      exec_mode: 'cluster',
      instances: 1,
      script: './.output/server/index.mjs',
    }
  ]
}
