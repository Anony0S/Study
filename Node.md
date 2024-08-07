## Base64转换

```js
Buffer.from('Man').toString('base64')
// TWFu
Buffer.from('TWFu', 'base64').toString()
// Man
```

   

## NVM使用

1. nvm list 命令 - 显示版本列表

```
nvm list // 显示已安装的版本（同 nvm list installed）
nvm list installed // 显示已安装的版本
nvm list available // 显示所有可以下载的版本
复制代码
```

1. nvm install 命令 - 安装指定版本nodejs

```arduino
nvm install 14.5.0 // 安装14.5.0版本node
nvm install latest // 安装最新版本node
复制代码
```

1. nvm use 命令 - 使用指定版本node

```rust
nvm use 14.5.0 // 使用14.5.0版本node
复制代码
```

1. nvm uninstall 命令 - 卸载指定版本 node

```arduino
nvm uninstall 14.5.0 // 卸载14.5.0版本node
复制代码
```

#### 4. 其他命令

1. `nvm arch` ：显示node是运行在32位还是64位系统上的
2. `nvm on` ：开启nodejs版本管理
3. `nvm off` ：关闭nodejs版本管理
4. `nvm proxy [url]` ：设置下载代理。不加可选参数url，显示当前代理。将url设置为none则移除代理。
5. `nvm node_mirror [url]` ：设置node镜像。默认是[nodejs.org/dist/](https://link.juejin.cn?target=https%3A%2F%2Flinks.jianshu.com%2Fgo%3Fto%3Dhttps%3A%2F%2Fnodejs.org%2Fdist%2F)。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
6. `nvm npm_mirror [url]` ：设置npm镜像。[github.com/npm/cli/arc…](https://link.juejin.cn?target=https%3A%2F%2Flinks.jianshu.com%2Fgo%3Fto%3Dhttps%3A%2F%2Fgithub.com%2Fnpm%2Fcli%2Farchive%2F)。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
7. `nvm root [path]` ：设置存储不同版本node的目录。如果未设置，默认使用当前目录。
8. `nvm version` ：显示nvm版本。version可简化为v。

