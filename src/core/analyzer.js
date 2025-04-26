const fs = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { analyzeJS } = require('./analyzers/js-analyzer');
const { analyzeHTML } = require('./analyzers/html-analyzer');
const { analyzeCSS } = require('./analyzers/css-analyzer');

/**
 * 分析单个文件的兼容性问题
 * @param {string} filePath - 文件路径
 * @param {Object} rules - 扫描规则配置
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeFile(filePath, rules) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const fileExt = filePath.split('.').pop().toLowerCase();
    
    let issues = [];
    
    // 根据文件类型选择不同的分析器
    switch (fileExt) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        issues = await analyzeJS(content, rules.js);
        break;
      case 'html':
      case 'htm':
        issues = await analyzeHTML(content, rules.html);
        break;
      case 'css':
      case 'scss':
      case 'less':
        issues = await analyzeCSS(content, rules.css);
        break;
      default:
        console.warn(`不支持的文件类型: ${fileExt}`);
    }

    return {
      file: filePath,
      issues
    };
  } catch (error) {
    console.error(`分析文件 ${filePath} 时出错:`, error);
    return {
      file: filePath,
      issues: []
    };
  }
}

module.exports = {
  analyzeFile
}; 