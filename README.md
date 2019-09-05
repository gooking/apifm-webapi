# 功能介绍

web开发云接口工具包，无需服务器，无需开发后台，开箱即用，轻松开发web应用

只要是基于web（浏览器）上访问的应用，都可以使用该插件进行快速开发

交流 QQ 群: 718308203

欢迎大家进群交流，文档持续更新中...

# 平台支持

* [微信小程序开发](https://github.com/gooking/apifm-wxapi)
* [web/h5 网站开发](https://github.com/gooking/apifm-webapi)
* [Flutter 开发](https://github.com/gooking/apifm-flutter)

# 使用方法

## 安装

```
npm install apifm-webapi
```

## 使用

1. js文件头部引入插件：

    ```
    const WEBAPI = require('apifm-webapi')
    WEBAPI.init('gooking')
    ```

2. js文件直接调用方法：

    ```
    WEBAPI.banners().then(res => {
      // 输出请求结果
      console.log(res)
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      console.log('request complete!')
    })
    ```

# 返回值说明

WXAPI 方法返回数据主要包含 3 个内容： 

1. code 错误码，0 代表操作重构，其他数字均表示错误，具体错误描述请查看 msg；
2. msg 如果上面的code不为0，那么 msg 将会返回具体的错误说明描述
3. data 字段保存了 code 为0 时候的数据，一起你需要的数据，都保存在 data 中返回给你

# 相关资源

[「功能说明文档」](instructions.md)
[「api接口文档」](https://api.it120.cc/doc.html)

# 联系作者

| ➕微信 | ➕支付宝 | ➕QQ |
| :------: | :------: | :------: |
| <img src="https://cdn.it120.cc/apifactory/2019/07/03/a86f7e46-1dbc-42fe-9495-65403659671e.jpeg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2019/07/03/fda59aeb-4943-4379-93bb-92856740bd6a.jpeg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2019/07/07/d420e29b-872e-4147-b57d-0aa988cd4853.png" width="200px"> |

# 授权协议

[MIT License](LICENSE)