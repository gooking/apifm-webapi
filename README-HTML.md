# 纯 HTML 使用教程（无需 npm / 无需打包）

在任何 HTML 网页中，只需引入一个 js 文件，即可通过全局变量 `APIFM` 调用 SDK 的所有方法。

## 1. 引入 js

下载 `dist` 目录下对应版本的文件，放到你的网站目录，然后用 `<script>` 引入。

| 版本 | 文件 | 适用场景 |
| --- | --- | --- |
| 国内版 | `https://www.apifm.com/apifm.min.js` | 服务器和用户主要在中国大陆 |
| 海外版 | `https://www.apifm.net/apifm.intl.min.js` | 服务器和用户主要在海外 |

国内版：

```html
<script src="https://www.apifm.com/apifm.min.js"></script>
```

海外版：

```html
<script src="https://www.apifm.net/apifm.intl.min.js"></script>
```

> 两个版本的用法完全一致，只是请求的接口域名不同。每个页面只引入其中一个。

## 2. 初始化

先在 [api工厂后台](https://www.apifm.com) 获得你的专属域名（subDomain），在调用任何接口之前执行一次：

```js
APIFM.init('你的subDomain')
```

## 3. 调用方法

所有方法都以 `APIFM.方法名(参数)` 的形式调用，返回 Promise。接口返回的数据结构为 `{ code, data, msg }`，`code == 0` 表示成功。

```js
// 写法一：then
APIFM.banners().then(res => {
  if (res.code == 0) {
    console.log(res.data)
  } else {
    console.error(res.msg)
  }
})

// 写法二：async / await
async function load() {
  const res = await APIFM.banners()
  console.log(res)
}
```

方法名和参数说明请查阅 [instructions.md](./instructions.md)（把文档中的 `WEBAPI.` 换成 `APIFM.` 即可）。

## 4. 完整示例

### 示例一：获取 Banner 轮播图

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Banner 示例</title>
</head>
<body>
  <div id="banners"></div>

  <script src="https://www.apifm.com/apifm.min.js"></script>
  <script>
    APIFM.init('你的subDomain')

    APIFM.banners().then(function (res) {
      if (res.code != 0) {
        alert(res.msg)
        return
      }
      var html = ''
      res.data.forEach(function (item) {
        html += '<a href="' + (item.linkUrl || '#') + '">' +
                '<img src="' + item.picUrl + '" style="width:100%"></a>'
      })
      document.getElementById('banners').innerHTML = html
    })
  </script>
</body>
</html>
```

> `APIFM.banners()` 不传参数时读取全部 Banner；如果后台给 Banner 设置了分类，可传 `APIFM.banners({ type: 'index' })` 只读取该分类。
> 如果图片或链接字段与上面不同，请先 `console.log(res.data)` 查看实际返回的字段名。

### 示例二：商品列表

```html
<ul id="goods"></ul>

<script src="https://www.apifm.com/apifm.min.js"></script>
<script>
  APIFM.init('你的subDomain')

  APIFM.goods({ page: 1, pageSize: 10 }).then(function (res) {
    if (res.code != 0) return alert(res.msg)
    var html = ''
    res.data.forEach(function (g) {
      html += '<li><img src="' + g.pic + '" width="60"> ' + g.name + ' ￥' + g.minPrice + '</li>'
    })
    document.getElementById('goods').innerHTML = html
  })
</script>
```

### 示例三：手机号 + 密码登录，并读取用户信息

```html
<input id="mobile" placeholder="手机号">
<input id="pwd" type="password" placeholder="密码">
<button onclick="doLogin()">登录</button>

<script src="https://www.apifm.com/apifm.min.js"></script>
<script>
  APIFM.init('你的subDomain')

  async function doLogin() {
    var mobile = document.getElementById('mobile').value
    var pwd = document.getElementById('pwd').value
    var res = await APIFM.login_mobile(mobile, pwd)
    if (res.code != 0) {
      alert(res.msg)
      return
    }
    var token = res.data.token
    localStorage.setItem('token', token)   // 保存登录凭证，后续接口需要

    var detail = await APIFM.userDetail(token)
    console.log('用户信息', detail.data)
  }
</script>
```

### 示例四：调用任意接口（SDK 未封装时）

```js
// APIFM.requestX(url, needSubDomain, method, data)
APIFM.requestX('/shop/goods/category/all', true, 'get').then(console.log)
```

## 5. 常见问题

- **提示 `APIFM is not defined`**：`<script src>` 的路径不对，或你的代码写在了 `<script src>` 之前。
- **跨域（CORS）报错**：请在 api工厂后台确认域名访问设置；不要用 `file://` 直接打开页面，建议使用本地服务器（如 VS Code 的 Live Server）。
- **登录后的接口要求 token**：登录成功后保存 `res.data.token`，按文档把 token 作为参数传入。

## 6. 自行构建

修改源码后，执行 `npm install` 和 `npm run build:min`，即可在 `dist` 目录重新生成两个 min.js 文件。
