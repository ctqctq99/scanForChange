const { glob } = require('glob');
const path = require('path');
const fs = require('fs');
const { analyzeFile } = require('./analyzer');

/**
 * 扫描指定目录下的文件
 * @param {Object} options - 扫描选项
 * @param {string} options.path - 要扫描的目录路径
 * @param {string} [options.config] - 配置文件路径
 * @returns {Promise<void>}
 */
async function scan(options) {
  const { path: scanPath, config } = options;
  
  // 获取配置文件
  const configData = await loadConfig(config);
  
  // 获取要扫描的文件
  const files = await getFiles(scanPath, configData.filePatterns);
  
  // 分析每个文件
  const results = await Promise.all(
    files.map(file => analyzeFile(file, configData.rules))
  );
  
  // 输出结果
  printResults(results);
}

/**
 * 加载配置文件
 * @param {string} configPath - 配置文件路径
 * @returns {Promise<Object>}
 */
async function loadConfig(configPath) {
  if (!configPath) {
    return {
      filePatterns: ['**/*.js', '**/*.ts'],
      rules: require('../config/rules')
    };
  }
  
  try {
    return JSON.parse(await fs.promises.readFile(configPath, 'utf-8'));
  } catch (error) {
    throw new Error(`无法加载配置文件: ${error.message}`);
  }
}

/**
 * 获取要扫描的文件列表
 * @param {string} scanPath - 扫描目录
 * @param {string[]} patterns - 文件匹配模式
 * @returns {Promise<string[]>}
 */
async function getFiles(scanPath, patterns) {
  try {
    const files = await glob(patterns, {
      cwd: scanPath,
      absolute: true,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    return files;
  } catch (error) {
    throw new Error(`获取文件列表失败: ${error.message}`);
  }
}

/**
 * 打印扫描结果
 * @param {Array} results - 扫描结果数组
 */
function printResults(results) {
  console.log('\n扫描结果:');
  console.log('='.repeat(50));
  
  // 按规则号分组显示结果
  const groupedResults = {};
  results.forEach(result => {
    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        if (!groupedResults[issue.ruleId]) {
          groupedResults[issue.ruleId] = [];
        }
        groupedResults[issue.ruleId].push({
          file: result.file,
          line: issue.line,
          message: issue.message,
          level: issue.level
        });
      });
    }
  });

  // 打印分组后的结果
  Object.entries(groupedResults).forEach(([ruleId, issues]) => {
    console.log(`\n规则 ${ruleId} 检测结果:`);
    issues.forEach(issue => {
      const levelText = issue.level === 'hit' ? '[命中]' : '[可能]';
      console.log(`${levelText} 文件: ${issue.file}`);
      console.log(`   行 ${issue.line}: ${issue.message}`);
    });
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`总计扫描文件: ${results.length}`);
  console.log(`发现兼容性问题: ${results.reduce((sum, r) => sum + r.issues.length, 0)}`);
}

module.exports = {
  scan
}; 