## 注意事项

- 行内写的参数不会直接转换，如：`$store`

- 转换为小程序时：组件外面会用`view`包裹，所以类名不生效，可以用上层类名

  ![image-20221123111442490](C:\Users\Admin\Documents\Typora\Uni-app.assets\image-20221123111442490.png)

- 微信调试工具不要开启转 ES5 组件会报错

- 注意事件委托的使用

  - 可以在最外层宫格绑定事件，此时每个宫格单元都会被绑定事件
  - 一般直接绑定，因为元素是被循环遍历出来的

- **窗体动画**仅支持`APP`，小程序不支持自定义动画，H5可以使用动画库（针对于页面切换的动画）

- **重要：**uni-app中不管在`data`中是否有定义，都可以直接`this.test = 'abc'`进行赋值而不会报错

  ![image-20221125163436722](C:\Users\Admin\Documents\Typora\Uni-app.assets\image-20221125163436722.png)

- **注意：**如果是在**组件**中，`onLoad()、onUnload()`等小程序的生命周期不起作用，但是可以使用`creat()、beforeDestroy()`，所以注意不能用`onLoad()`接收参数实现页面间的传值，但是可以使用**页面通讯（全局事件总线），**`vuex`等方法进行传值

- 若要**绑定样式**，可使用计算属性，直接绑定不生效（可能原因：渲染DOM的时候未拿到值，渲染不出来）

  - <img src="C:\Users\Admin\Documents\Typora\Uni-app.assets\image-20221129132953049.png" alt="image-20221129132953049" style="zoom:150%;" />

  - 解决方法一：使用计算属性

    ![image-20221129133536696](C:\Users\Admin\Documents\Typora\Uni-app.assets\image-20221129133536696.png)

  - 解决方法二：使用数组写法（colorUI案例）

    ![image-20221129135756042](C:\Users\Admin\Documents\Typora\Uni-app.assets\image-20221129135756042.png)
    
  - **注意：**静态的样式统一写到 class 中。style 接收动态的样式，在运行时会进行解析，请尽量避免将静态的样式写进 style 中，以免影响渲染速度。

- **自定义组件**中不能使用的标签选择器

  - 组件和引用组件的页面不能使用 id 选择器（`#a`）、属性选择器（`[a]`）和标签名选择器，请改用 class 选择器。
  - 组件和引用组件的页面中使用后代选择器（`.a .b`）在一些极端情况下会有非预期的表现，如遇，请避免使用。
  - 子元素选择器（`.a>.b`）只能用于 `view` 组件与其子节点之间，用于其他组件可能导致非预期的情况。
  - 继承样式，如 `font` 、 `color` ，会从组件外继承到组件内。
  - 除继承样式外， `app.wxss` 中的样式、组件所在页面的的样式对自定义组件无效（除非更改组件样式隔离选项）。

  ```css
  #a { } /* 在组件中不能使用 */
  [a] { } /* 在组件中不能使用 */
  button { } /* 在组件中不能使用 */
  .a > .b { } /* 除非 .a 是 view 组件节点，否则不一定会生效 */
  ```

  


## 页面传值

### 父子通讯

- 跳转绑定事件及回调事件 - 父传子/子传父： https://uniapp.dcloud.net.cn/api/router.html#navigateto

  - 父页面绑定事件，子页面调用并传值（**子传父**）
  
    ```js
     // 父页面
     uni.navigateTo({
         url: '/pages/subpages/home/video?id=' + id,
         events: {
             // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
             acceptDataFromOpenedPage(data) {
                 console.log('1111', data)
             }
         },
     })
    
    // 子页面
    onLoad(option) {
        // 获取父页面通过链接传的值
        console.log('页面传值 - ID', option.id);
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('acceptDataFromOpenedPage', {
            data: 'data from test page',
            aa: '123'
        });
    },
    ```
  
  - 子页面绑定事件，父页面调用事件（**父传子**）
  
    ```js
    // 子页面
    onLoad() {
        const eventChannel = this.getOpenerEventChannel();
        //监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
        	console.log(data)
        })
    },
    
    // 父页面
    uni.navigateTo({
        url: '/pages/subpages/home/video?id=' + id,
        // 接口调用成功的回调函数
        success(res) {
        	// 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
                data: 'Home 页面的数据'
            })
        }
    })
    ```

### 页面通讯（全局事件总线）

- 通过`uni.$emit()`触发，`uni.$on()`监听事件
- 此方法可以跨任意组件、页面等
- **注意**在`onLoad()`里面使用`uni.$on`注册监听，在`onUnload()`里边使用`uni.$off`移除



## 背景图片的设置

- 微信开发者工具无法直接使用本地图片，uni-app会转换为`Base64`格式
- 可以使用行内样式，uni-app不会进行转换
- 使用网络图片
- 推荐使用计算属性，直接在行内样式引入会报**`Failed to load local image resource`**错误

  ```vue
  <template>
  	<view class="topbox " :style="{backgroundImage: bgImage}"></view>
  </template>
  
  <script>
      export default {
          computed: {
              bgImage() {
                  return 'url('+require('@/static/icon/register/bg03.png')+')'
              }
          },
      }
  </script>
  ```

  



## `border-image`设置渐变边框

```css
div {
  border: 4px solid;
  border-image: linear-gradient(to right, #8f41e9, #578aef) 1;
}
```



## 根据背景颜色设置字体颜色

[如何根据背景颜色动态修改文字颜色（掘金）](https://juejin.cn/post/6844903960487149582)

[使用CSS完成效果](https://www.cnblogs.com/coco1s/p/16012545.html)





##  微信开发者工具打不开
1. uni-app，manifest.json, 微信小程序配置，请填写正确的微信appid
2. uni-app，编译后的微信小程序代码，在unpackage目录下，复制路径，在微信开发者工具打开。
来自 <https://ask.dcloud.net.cn/question/138939> 

## 报错：  Vue is not defined
在APP.vue 引入 import Vue from 'vue'

## 判断开发还是生产环境
```js
if (process.env.NODE_ENV === 'development') {
  console.log('开发环境')
} else {
  console.log('生产环境')
}
```


## uView 导航栏透明
去掉 顶部占位 -> placeholder
rgba(0, 0, 0, 0)

## uniApp页面滚动监听
> https://codeantenna.com/a/wPRLnTmfeP



## `web-view`覆盖原生组件

- 使用`cover-view`实现，`position`设置为`fxed`，设置层级
- 注意不能使用背景图片，可以使用`cover-image`
- 其他注意事项参考：[MSDN](https://blog.csdn.net/WEIGUO19951107/article/details/94305964)





