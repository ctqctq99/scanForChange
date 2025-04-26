# Chromium 兼容性扫描工具

这是一个基于 Node.js 的工具，用于扫描项目中可能因 Chromium 内核升级导致的兼容性问题。

## 功能特点

- 自动扫描项目中的 JavaScript 和 TypeScript 文件
- 检测可能受 Chromium 版本升级影响的 API 和特性
- 提供详细的兼容性报告
- 支持自定义扫描规则和配置

## 使用方法

1. 安装依赖：
```bash
npm install
```

2. 运行扫描：
```bash
npm run scan
```

## 配置选项

可以通过配置文件自定义扫描行为：
- 指定要扫描的文件类型
- 设置要检查的 Chromium 版本
- 自定义扫描规则

## 开发状态

项目正在积极开发中，欢迎提交问题和建议。

## 许可证

MIT 