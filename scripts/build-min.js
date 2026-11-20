/**
 * 生成可直接通过 <script> 引入的 min.js（全局变量 APIFM）
 * 运行：npm run build:min
 * 产物：dist/apifm.min.js（国内版）、dist/apifm.intl.min.js（海外版）
 */
const fs = require('fs')
const path = require('path')
const esbuild = require('esbuild')

const root = path.resolve(__dirname, '..')
const entry = path.join(root, 'index.js')
const pkg = require(path.join(root, 'package.json'))

// 海外版需要替换的域名（源码中的 var 声明行）
const INTL_URLS = {
  API_BASE_URL: 'https://api.apifm.net',
  COMMON_BASE_URL: 'https://common.apifm.net/',
  CMS_BASE_URL: 'https://cms.apifm.net/',
  OSS_BASE_URL: 'https://oss.apifm.net/'
}

// esbuild 插件：构建海外版时，在加载 index.js 时替换域名常量
const intlPlugin = {
  name: 'intl-urls',
  setup(build) {
    build.onLoad({ filter: /index\.js$/ }, (args) => {
      if (path.resolve(args.path) !== entry) return null
      let code = fs.readFileSync(args.path, 'utf8')
      for (const [name, url] of Object.entries(INTL_URLS)) {
        const re = new RegExp(`(var\\s+${name}\\s*=\\s*)(['"]).*?\\2`)
        if (!re.test(code)) {
          throw new Error(`index.js 中未找到 ${name} 的声明，无法替换为海外域名`)
        }
        code = code.replace(re, `$1'${url}'`)
      }
      return { contents: code, loader: 'js', resolveDir: path.dirname(args.path) }
    })
  }
}

const targets = [
  { file: 'apifm.min.js', plugins: [], label: '国内版' },
  { file: 'apifm.intl.min.js', plugins: [intlPlugin], label: '海外版' }
]

async function main() {
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true })
  for (const t of targets) {
    const outfile = path.join(root, 'dist', t.file)
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      platform: 'browser',
      format: 'iife',
      globalName: 'APIFM',
      target: ['es2015'],
      define: { 'process.env.NODE_ENV': '"production"' },
      banner: { js: `/*! apifm-webapi v${pkg.version} ${t.label} | MIT */` },
      plugins: t.plugins,
      outfile,
      logLevel: 'warning'
    })
    const kb = (fs.statSync(outfile).size / 1024).toFixed(1)
    console.log(`[${t.label}] dist/${t.file} (${kb} KB)`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
