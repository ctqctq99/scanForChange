const { JSDOM } = require('jsdom');
const { DETECTION_LEVEL } = require('../constants');

/**
 * HTML 分析器
 */
class HTMLAnalyzer {
  /**
   * 分析 HTML 代码
   * @param {string} code - HTML 代码
   * @param {string} filePath - 文件路径
   * @param {Array} rules - 规则配置
   * @returns {Array} 检测到的问题列表
   */
  analyzeHTML(code, filePath, rules) {
    const issues = [];
    
    // 遍历所有规则
    rules.forEach(rule => {
      const result = rule.check(code);
      if (result !== DETECTION_LEVEL.NONE) {
        issues.push({
          ruleId: rule.ruleId,
          line: 1, // HTML 规则通常没有行号信息
          message: rule.message,
          type: rule.type,
          level: result
        });
      }
    });
    
    return issues;
  }
}

module.exports = HTMLAnalyzer; 