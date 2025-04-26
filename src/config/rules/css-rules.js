const { DETECTION_LEVEL } = require('../../core/constants');

/**
 * CSS 兼容性规则
 */
module.exports = [
  // {
  //   ruleId: 31,
  //   type: 'container-query-compatibility',
  //   message: '检测到 @container 查询中使用了可能不兼容的特性，这可能导致样式失效',
  //   check: (code) => {
  //     // 使用正则表达式匹配 @container 查询
  //     const containerRegex = /@container\s*\([^)]*\)/g;
  //     let match;
  //     
  //     // Chromium 132 中 @container 查询支持的特性
  //     const supportedFeatures = [
  //       'width',
  //       'height',
  //       'inline-size',
  //       'block-size',
  //       'min-width',
  //       'min-height',
  //       'max-width',
  //       'max-height',
  //       'min-inline-size',
  //       'min-block-size',
  //       'max-inline-size',
  //       'max-block-size'
  //     ];
  //     
  //     while ((match = containerRegex.exec(code)) !== null) {
  //       const query = match[0];
  //       // 检查是否包含不支持的特性
  //       // 如果查询中不包含任何支持的特性，则可能有问题
  //       const hasSupportedFeature = supportedFeatures.some(feature => query.includes(feature));
  //       if (!hasSupportedFeature) {
  //         return DETECTION_LEVEL.HIT;
  //       }
  //       
  //       // 检查是否使用了复杂的逻辑运算符
  //       if (query.includes(' and ') || query.includes(' or ')) {
  //         return DETECTION_LEVEL.POSSIBLE;
  //       }
  //     }
  //     
  //     return DETECTION_LEVEL.NONE;
  //   }
  // }
  {
    ruleId: 32,
    type: 'backdrop-pseudo-element',
    message: '检测到 ::backdrop 伪元素的使用，请注意其继承行为已更改',
    check: (code) => {
      // 使用正则表达式匹配 ::backdrop 伪元素
      const backdropRegex = /::backdrop\b/g;
      let match;
      
      // 检查是否使用了 ::backdrop
      if (backdropRegex.test(code)) {
        // 检查是否直接指定了自定义属性
        const customPropertyRegex = /::backdrop\s*{[^}]*var\([^)]*\)[^}]*}/g;
        if (customPropertyRegex.test(code)) {
          return DETECTION_LEVEL.HIT;
        }
        
        // 检查是否使用了继承属性
        const inheritProperties = [
          'color',
          'font-family',
          'font-size',
          'font-weight',
          'line-height',
          'text-align',
          'text-decoration',
          'text-transform',
          'letter-spacing',
          'word-spacing'
        ];
        
        const propertyRegex = new RegExp(`::backdrop\\s*{[^}]*(${inheritProperties.join('|')})\\s*:[^;]*;`, 'g');
        if (propertyRegex.test(code)) {
          return DETECTION_LEVEL.POSSIBLE;
        }
      }
      
      return DETECTION_LEVEL.NONE;
    }
  }
]; 