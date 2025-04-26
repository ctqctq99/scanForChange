const { DETECTION_LEVEL } = require('../constants');

/**
 * JavaScript 分析器
 */
class JSAnalyzer {
  /**
   * 分析 JavaScript 代码
   * @param {string} code - JavaScript 代码
   * @param {string} filePath - 文件路径
   * @param {Array} rules - 规则配置
   * @returns {Array} 检测到的问题列表
   */
  analyzeJS(code, filePath, rules) {
    const issues = [];
    
    // 遍历所有规则
    rules.forEach(rule => {
      // 使用 Babel 解析代码
      const ast = require('@babel/parser').parse(code, {
        sourceType: 'module',
        plugins: ['jsx']
      });
      
      // 遍历 AST
      require('@babel/traverse').default(ast, {
        enter(path) {
          const result = rule.check(path);
          if (result !== DETECTION_LEVEL.NONE) {
            issues.push({
              ruleId: rule.ruleId,
              line: path.node.loc.start.line,
              message: rule.message,
              type: rule.type,
              level: result
            });
          }
        }
      });
    });
    
    return issues;
  }
}

module.exports = JSAnalyzer; 