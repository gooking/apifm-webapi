---
inclusion: auto
name: build-min-js
description: 当用户说“重新生成 min.js 文件”或要求生成/更新浏览器可直接引用的 min.js（国内版、海外版）时使用。
---

# 重新生成 min.js 文件

目的：让纯 HTML 页面通过 `<script src="xxx.min.js"></script>` 直接使用全局变量 `APIFM.xxx` 调用 SDK 全部方法（`index.js` 导出的所有方法）。

## 执行步骤

1. 如果没有 `node_modules`，先执行 `npm install`。
2. 执行 `npm run build:min`（脚本：`scripts/build-min.js`，基于 esbuild，打包 axios 和 qs，IIFE 格式，globalName 为 `APIFM`）。
3. 产物输出到 `dist/`：
   - `dist/apifm.min.js`：国内版，沿用 `index.js` 中的域名。
   - `dist/apifm.intl.min.js`：海外版，构建时替换以下域名：
     - `API_BASE_URL` = `https://api.apifm.net`
     - `COMMON_BASE_URL` = `https://common.apifm.net/`
     - `CMS_BASE_URL` = `https://cms.apifm.net/`
     - `OSS_BASE_URL` = `https://oss.apifm.net/`
4. 校验（必须做）：
   - 国内版：包含 `api.it120.cc`，不包含 `apifm.net`。
   - 海外版：不包含 `api.it120.cc`，四个域名均为 `apifm.net`。
   - 在带最小 DOM 模拟的 `vm` 中执行产物，确认 `APIFM` 的方法数量与 `index.js` 导出一致，且 `APIFM.init`、`APIFM.goods` 等为函数。

## 注意

- 不要手工修改 `dist/` 产物，也不要修改 `index.js` 来适配海外版；域名替换只发生在 `scripts/build-min.js` 的构建插件里。
- 如果 `index.js` 中域名变量的声明方式改变（不再是 `var XXX_BASE_URL = '...'`），构建会报错，需同步更新脚本中的正则。
- `JDVOP_BASE_URL` 目前海外版不替换（用户未指定），如需替换，在 `scripts/build-min.js` 的 `INTL_URLS` 中添加。
- 引用示例：`<script src="apifm.min.js"></script>`，然后 `APIFM.init('your-subdomain'); APIFM.goods({}).then(console.log)`。
- 完成后向用户报告两个文件的路径、大小和校验结果。
