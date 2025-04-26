const { DETECTION_LEVEL } = require('../../core/constants');

/**
 * JavaScript 兼容性规则
 */
module.exports = [
  {
    ruleId: 1,
    type: 'document-domain-assignment',
    message: '检测到 document.domain 赋值操作，这可能导致安全风险',
    check: (path) => {
      // 检查是否是 document.domain 的赋值操作
      if (path.isAssignmentExpression()) {
        const left = path.node.left;
        if (left.type === 'MemberExpression' &&
            left.object.type === 'Identifier' &&
            left.object.name === 'document' &&
            left.property.type === 'Identifier' &&
            left.property.name === 'domain') {
          return DETECTION_LEVEL.HIT;
        }
      }
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 27,
    type: 'deprecated-websql',
    message: '检测到使用了已废弃的 WebSQL API',
    check: (path) => {
      // 检查是否使用了 WebSQL API
      if (path.isMemberExpression()) {
        const object = path.node.object;
        const property = path.node.property;
        
        // 检查是否使用了 window.openDatabase 或 window.sqlitePlugin
        if (object.type === 'Identifier' && 
            (object.name === 'window' || object.name === 'self') &&
            property.type === 'Identifier' &&
            (property.name === 'openDatabase' || property.name === 'sqlitePlugin')) {
          return DETECTION_LEVEL.HIT;
        }
        
        // 检查是否使用了 window.SQLTransaction 或 window.SQLResultSet
        if (object.type === 'MemberExpression' &&
            object.object.type === 'Identifier' &&
            (object.object.name === 'window' || object.object.name === 'self') &&
            object.property.type === 'Identifier' &&
            (object.property.name === 'SQLTransaction' || 
             object.property.name === 'SQLResultSet' ||
             object.property.name === 'SQLResultSetRowList' ||
             object.property.name === 'SQLError')) {
          return DETECTION_LEVEL.HIT;
        }
      }
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 28,
    type: 'deprecated-shadow-dom',
    message: '检测到使用了已废弃的 shadowRoot 属性，建议使用 shadowRootNode',
    check: (path) => {
      // 检查是否使用了 shadowRoot 属性
      if (path.isMemberExpression()) {
        const property = path.node.property;
        if (property.type === 'Identifier' && property.name === 'shadowRoot') {
          return DETECTION_LEVEL.HIT;
        }
      }
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 29,
    type: 'sanitizer-api',
    message: '检测到使用了 Sanitizer API，请注意兼容性问题',
    check: (path) => {
      // 检查是否使用了 Sanitizer API
      if (path.isMemberExpression()) {
        const object = path.node.object;
        const property = path.node.property;
        
        // 检查是否使用了 window.Sanitizer
        if (object.type === 'Identifier' && 
            (object.name === 'window' || object.name === 'self') &&
            property.type === 'Identifier' &&
            property.name === 'Sanitizer') {
          return DETECTION_LEVEL.HIT;
        }
        
        // 检查是否使用了 Sanitizer 实例方法
        if (object.type === 'MemberExpression' &&
            object.object.type === 'Identifier' &&
            object.property.type === 'Identifier' &&
            object.property.name === 'Sanitizer' &&
            property.type === 'Identifier' &&
            ['sanitize', 'sanitizeFor', 'getConfiguration'].includes(property.name)) {
          return DETECTION_LEVEL.HIT;
        }
      }
      
      // 检查是否使用了 Element.setHTML
      if (path.isMemberExpression() &&
          path.node.property.type === 'Identifier' &&
          path.node.property.name === 'setHTML') {
        return DETECTION_LEVEL.HIT;
      }
      
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 30,
    type: 'view-transition-api',
    message: '检测到 startViewTransition 方法调用，回调函数参数现在不能为空',
    check: (path) => {
      // 检查是否是 startViewTransition 方法调用
      if (path.isCallExpression()) {
        const callee = path.node.callee;
        
        // 检查是否是 startViewTransition 方法调用
        if (callee.type === 'MemberExpression') {
          const object = callee.object;
          const property = callee.property;
          
          // 确定可能性等级
          if (object.type === 'Identifier' && 
              object.name === 'document' && 
              property.type === 'Identifier' && 
              property.name === 'startViewTransition') {
            // 检查是否提供了回调函数参数
            const args = path.node.arguments;
            if (args.length === 0 || 
                (args.length === 1 && args[0].type === 'NullLiteral') ||
                (args.length === 1 && args[0].type === 'Identifier' && args[0].name === 'undefined')) {
              return DETECTION_LEVEL.HIT;
            }
          } else if (property.type === 'Identifier' && property.name === 'startViewTransition') {
            // 可能是混淆后的代码
            return DETECTION_LEVEL.POSSIBLE;
          }
        }
      }
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 39,
    type: 'selection-is-collapsed',
    message: '检测到使用了 Selection.isCollapsed() 方法，在 Chromium 114 中可能存在阴影树相关的兼容性问题',
    check: (path) => {
      // 检查是否是 Selection.isCollapsed() 方法调用
      if (path.isCallExpression()) {
        const callee = path.node.callee;
        
        // 检查是否是 isCollapsed 方法调用
        if (callee.type === 'MemberExpression') {
          const object = callee.object;
          const property = callee.property;
          
          // 检查是否是 Selection 对象的方法调用
          if (property.type === 'Identifier' && property.name === 'isCollapsed') {
            // 检查是否是 Selection 对象
            if (object.type === 'Identifier' && object.name === 'Selection') {
              return DETECTION_LEVEL.POSSIBLE;
            } else if (object.type === 'MemberExpression' &&
                      object.object.type === 'Identifier' &&
                      (object.object.name === 'window' || object.object.name === 'document') &&
                      object.property.type === 'Identifier' &&
                      object.property.name === 'getSelection') {
              // 通过 window.getSelection() 或 document.getSelection() 获取的 Selection 对象
              return DETECTION_LEVEL.POSSIBLE;
            }
          }
        }
      }
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 40,
    type: 'deprecated-import-assert',
    message: '检测到使用了已废弃的 import assert 语法，请使用 with 关键字替代',
    check: (path) => {
      // 检查是否是 import 语句
      if (path.isImportDeclaration()) {
        // 检查是否使用了 assert 关键字
        if (path.node.assertions && path.node.assertions.length > 0) {
          return DETECTION_LEVEL.HIT;
        }
      }
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 41,
    type: 'deprecated-array-methods',
    message: '检测到使用了已废弃的 Array.prototype.group 或 groupToMap 方法',
    check: (path) => {
      // 检查是否是方法调用
      if (path.isCallExpression()) {
        const callee = path.node.callee;
        
        // 检查是否是 Array.prototype.group 或 groupToMap 方法调用
        if (callee.type === 'MemberExpression') {
          const object = callee.object;
          const property = callee.property;
          
          // 检查是否是数组方法调用
          if (property.type === 'Identifier' && 
              (property.name === 'group' || property.name === 'groupToMap')) {
            
            // 确定可能性等级
            if (object.type === 'Identifier' && object.name === 'Array') {
              // 直接调用 Array.group 或 Array.groupToMap
              return DETECTION_LEVEL.HIT;
            } else if (object.type === 'MemberExpression' && 
                      object.object.type === 'Identifier' && 
                      object.object.name === 'Array' && 
                      object.property.type === 'Identifier' && 
                      object.property.name === 'prototype') {
              // 调用 Array.prototype.group 或 Array.prototype.groupToMap
              return DETECTION_LEVEL.HIT;
            } else {
              // 可能是混淆后的代码
              return DETECTION_LEVEL.POSSIBLE;
            }
          }
        }
      }
      return DETECTION_LEVEL.NONE;
    }
  },
  {
    ruleId: 44,
    type: 'function-parameters-limit',
    message: '检测到函数参数数量超过 65535 个，这可能导致兼容性问题',
    check: (path) => {
      // 检查是否是函数声明或函数表达式
      if (path.isFunctionDeclaration() || path.isFunctionExpression() || path.isArrowFunctionExpression()) {
        const params = path.node.params;
        
        // 如果没有剩余参数，检查参数数量是否超过 65535
        if (params && params.length > 65535) {
          return DETECTION_LEVEL.HIT;
        }
      }
      
      return DETECTION_LEVEL.NONE;
    }
  }
]; 