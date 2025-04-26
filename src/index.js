#!/usr/bin/env node

const { program } = require('commander');
const { scan } = require('./core/scanner');

program
  .version('1.0.0')
  .description('Chromium 兼容性扫描工具')
  .option('-p, --path <path>', '要扫描的项目路径', process.cwd())
  .option('-c, --config <path>', '配置文件路径')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    await scan(options);
  } catch (error) {
    console.error('扫描过程中发生错误:', error);
    process.exit(1);
  }
}

main(); 