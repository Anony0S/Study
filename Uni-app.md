## 注意事项

- 行内写的参数不会直接转换，如：`$store`

- 转换为小程序时：组件外面会用`view`包裹，所以类名不生效，可以用上层类名

  ![image-20221123111442490](C:\Users\Admin\Documents\Typora\Uni-app.assets\image-20221123111442490.png)

- 微信调试工具不要开启转 ES5 组件会报错

- 注意事件委托的使用

  - 可以在最外层宫格绑定事件，此时每个宫格单元都会被绑定事件
  - 一般直接绑定，因为元素是被循环遍历出来的

- **窗体动画**仅支持`APP`，小程序不支持自定义动画，H5可以使用动画库

- **重要：**uni-app中不管在`data`中是否有定义，都可以直接`this.test = 'abc'`进行赋值而不会报错

  ![image-20221125163436722](C:\Users\Admin\Documents\Typora\Uni-app.assets\image-20221125163436722.png)

- **注意：**如果是在组件中，`onLoad()、onUnload()`等小程序的生命周期不起作用，但是可以使用`creat()、beforeDestroy()`，所以注意不能用`onLoad()`接收参数实现页面间的传值，但是可以使用**页面通讯（全局事件总线），**`vuex`等方法进行传值

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

