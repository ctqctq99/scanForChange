const { DETECTION_LEVEL } = require('../../core/constants');

/**
 * HTML 兼容性规则
 */
module.exports = [
  {
    ruleId: 33,
    type: 'inline-script-block-render',
    message: '检测到 inline script 使用了 block=render 属性，这会阻塞渲染',
    check: (code) => {
      // 使用正则表达式匹配 inline script 标签
      const scriptRegex = /<script[^>]*>/g;
      let match;
      
      while ((match = scriptRegex.exec(code)) !== null) {
        const scriptTag = match[0];
        // 检查是否包含 block=render 属性
        if (scriptTag.includes('block=render') || scriptTag.includes('block="render"') || scriptTag.includes("block='render'")) {
          return DETECTION_LEVEL.HIT;
        }
      }
      
      return DETECTION_LEVEL.NONE;
    }
  }
]; 