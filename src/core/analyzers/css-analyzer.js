const { DETECTION_LEVEL } = require('../constants');

/**
 * CSS 分析器
 */
class CSSAnalyzer {
  /**
   * 分析 CSS 代码
   * @param {string} code - CSS 代码
   * @param {string} filePath - 文件路径
   * @param {Array} rules - 规则配置
   * @returns {Array} 检测到的问题列表
   */
  analyzeCSS(code, filePath, rules) {
    const issues = [];
    
    // 遍历所有规则
    rules.forEach(rule => {
      const result = rule.check(code);
      if (result !== DETECTION_LEVEL.NONE) {
        issues.push({
          ruleId: rule.ruleId,
          line: 1, // CSS 规则通常没有行号信息
          message: rule.message,
          type: rule.type,
          level: result
        });
      }
    });
    
    return issues;
  }
}

module.exports = CSSAnalyzer; 