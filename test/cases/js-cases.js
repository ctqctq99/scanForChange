// 规则 1: document.domain 赋值
const domainTest = () => {
  document.domain = 'example.com'; // 应该触发规则 1
};

// 规则 27: WebSQL API
const websqlTest = () => {
  const db = window.openDatabase('test', '1.0', 'Test DB', 2 * 1024 * 1024); // 应该触发规则 27
  const transaction = new window.SQLTransaction(); // 应该触发规则 27
};

// 规则 28: shadowRoot 属性
const shadowRootTest = () => {
  const element = document.createElement('div');
  const shadow = element.shadowRoot; // 应该触发规则 28
};

// 规则 29: Sanitizer API
const sanitizerTest = () => {
  const sanitizer = new window.Sanitizer(); // 应该触发规则 29
  const element = document.createElement('div');
  element.setHTML('<script>alert(1)</script>'); // 应该触发规则 29
};

// 规则 30: startViewTransition
const viewTransitionTest = () => {
  document.startViewTransition(); // 应该触发规则 30
  document.startViewTransition(null); // 应该触发规则 30
  document.startViewTransition(undefined); // 应该触发规则 30
  const d = document;
  d.startViewTransition(); // 应该触发规则 30 (POSSIBLE)
};

// 规则 39: Selection.isCollapsed
const selectionTest = () => {
  const selection = window.getSelection();
  selection.isCollapsed(); // 应该触发规则 39
  document.getSelection().isCollapsed(); // 应该触发规则 39
};

// 规则 40: import assert
// 注意：这个需要在单独的模块文件中测试
// import json from './data.json' assert { type: 'json' }; // 应该触发规则 40

// 规则 41: Array.prototype.group
const arrayMethodsTest = () => {
  const arr = [1, 2, 3];
  arr.group(x => x % 2); // 应该触发规则 41
  Array.prototype.group.call(arr, x => x % 2); // 应该触发规则 41
  const a = Array;
  a.group([1, 2, 3], x => x % 2); // 应该触发规则 41 (POSSIBLE)
};

// 规则 44: 函数参数数量限制
const parametersLimitTest = () => {
  // 生成超过 65535 个参数的函数
  const params = Array(65536).fill('x').map((x, i) => `a${i}`).join(', ');
  const funcStr = `function test(${params}) {}`;
  eval(funcStr); // 应该触发规则 44
}; 