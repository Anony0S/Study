## 获取元素的高度

> 思路：通过`ref`拿到真实`DOM`元素进行获取

```js
<div ref="getheight"></div>

// JavaScript
// 获取高度值 （内容高+padding+边框）
let height= this.$refs.getheight.offsetHeight;  

// 获取元素样式值 （存在单位）
let height = window.getComputedStyle(this.$refs.getheight).height;

//获取元素内联样式值（非内联样式无法获取）
let height = this.$refs.getheight.style.height;  

// 注意：要在元素渲染出来才能获取元素的高度实例： 
mounted(){
    this.$nextTick(()=>{ // 页面渲染完成后的回调
        console.log(this.$refs.getheight.offsetHeight)
    })
}
```

- 注意`$nextTick()`的使用



## 自定义上传操作

> 实现思路：使用`input`的`file`属性，触发`@change`事件，完成上传和删除的操作

```html
<input
    id="inputAudio"
    ref="audio"
    accept="audio/mp3,"
    type="file"
    hidden
    @change="uploadFileAudio1"
/>
<label for="inputAudio" v-if="!dataForm.audio">
    <span class="btn-upAudio"> 上传音频 </span>
</label>
```

- 注意：`label`标签里面不能使用`button`，因为按钮默认有提交表单的功能，会直接将`input`当作表单提交，达不到点击弹出文件选择器的效果，使用其他标签即可



## 分页

> 删除最后一个不跳转问题

**方法一：**删除之后将页码置为第一页，即每次删完一个跳转到第一页

**方法二：**判断当前页是否有数据，可以根据`总数%页数`判断

```js
// 当前页没有数据时
if (total !== 0 && rows.length === 0) {
    this.page.page = this.page.page - 1
    this.getEmployeesList()
}
```



## 路由跳转404

通过路由前置守卫判断有没匹配到路由，没有则跳转上级路由，或者跳转404

```js
if (to.matched.length === 0) {  //如果未匹配到路由
    from.path? next({ path:from.path}) : next('/404');   //如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
}
```


##  图片上传
###  基于Element-ui上传组件二次封装

- **限制格式**

  1. `accept：`对文件上传控件中可选择的文件类型进行限制
     - ![image-20230628133057826](Vue.assets/image-20230628133057826.png)
     - [唯一文件类型说明符](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file#%E5%94%AF%E4%B8%80%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E8%AF%B4%E6%98%8E%E7%AC%A6)
  2. `before-upload`上传前钩子函数，拿到上传前文件，通过文件`type`属性获取文件类型进行判断
     - ![image-20221112101536089](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112101536089.png)

- **限制大小**

  - 原理同上，通过`before-upload`拿到上传文件，通过文件`size`属性获取文件大小进行判断

    ![image-20221112101716883](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112101716883.png)

- **实现对上传图片的宽高进行限制**

  - **`Image()`一个很好用的方法：`await img.decode(); // 等待图片加载完成`**

  - 通过`Image()`构造函数创建`img`实例（相当于创建了一个`img` `DOM`元素）

  - 设置`img`的`src`为上传的图片

  - 使用`img.onload()`函数，在图片加载完成后获取到图片的宽高（必须在此函数中获取宽高，大概是因为读取图片为异步行为？），对宽高进行判断

  - 核心代码

    - ```js
      beforeAvatarUpload(file) {
                  // === 限制格式和大小
                  const isTypeTrue = /^image\/(jpeg|png|jpg)$/.test(file.type);
                  const isLt = file.size / 1024 / 1024 < this.imgSize;
                  if (!isTypeTrue) {
                      this.$message.error("请上传指定格式图片");
                      return false;
                  }
                  if (!isLt) {
                      this.$message.error(`请上传大小在${this.imgSize}M内的图片`);
                      return false;
                  }
                  // === 限制尺寸
                  let _this = this;
                  const isSize = new Promise(function (resolve, reject) {
                      let width = _this.width; // 限制图片尺寸
                      let height = _this.height;
                      // URL对象是硬盘（SD卡等）指向文件的一个路径
                      let _URL = window.URL || window.webkitURL;
                      let img = new Image();
                      //设置src才能取到图片宽高等属性
                      img.src = _URL.createObjectURL(file);
                      img.onload = function () {
                          console.log("Width:", img.width, "height:", img.height);
                          let valid = img.width <= width && img.height <= height;
                          // let valid = true;
                          valid ? resolve(img.src) : reject();
                      };
                  }).then(
                      (res) => {
                          _this.imageUrl = res; // 图片回显
                          return file;
                      },
                      () => {
                          _this.$message.error(`上传图片与要求尺寸不符,请重新上传`);
                          return Promise.reject();
                      }
                  );
                  return isTypeTrue && isLt && isSize;
              },
      ```

- 参考文章：https://juejin.cn/post/6844904150833037325#comment

### 基于Element-ui上传组件实现图片上传压缩

> 实现方法写在`before-upload`属性（上传文件之前的钩子）中，即上传前进行图片的压缩操作

- **实现原理**

  1. 通过`canvas`画布将上传的图片绘制出来

  2. 再通过`canvas.toDataURL()`方法对图片进行压缩（核心）

     此方法获取到的图片为Base64格式

  3. 上传图片到后端可转换为Blob或其他格式进行上传

- **核心代码**

  ```js
  beforeAvatarUpload(file) {
      const fileSize = file.size / 1024 / 1024;
      console.log("图片原始大小：", fileSize.toFixed(2) + "M");
      // 创建画布
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      // 创建新的图片对象
      let img = new Image();
      // 指定图片的DataURL(base64格式/此处使用Blob)
      img.src = URL.createObjectURL(file);
      img.onload = () => {
          // 指定画布大小 =》 这里设置为原大小
          canvas.width = img.width;
          canvas.height = img.height;
          // 绘制画布
          context.drawImage(img, 0, 0);
          // 核心：将绘制完成的图片转化为base64，并进行压缩
          this.imageUrl = canvas.toDataURL(file.type, 0.5);
      };
      return false;
  },
  ```



>  参考链接:
>
>  [前端图片压缩上传（压缩篇）：可能是最适合小白的前端图片压缩文章了](https://juejin.cn/post/7081619017365979149)
>
>  [Vue使用vant上传组件上传图片并对大图压缩](https://juejin.cn/post/6844903742416879630)
>
>  [一个项目小亮点---图片压缩上传](https://juejin.cn/post/7081619017365979149)
>
>  [[1.3万字]玩转前端二进制](https://juejin.cn/post/6846687590783909902)

### 文件上传处理两种思路

- 使用通用文件上传接口，上传时不需要对象点位ID，具体点位只需增改链接

- 单独上传接口，上传时需要对应的点位ID，点位不需要提供增改字段

  ![image-20230628133109453](Vue.assets/image-20230628133109453.png) 

### 注意事项

- 如果自定义上传函数，注意使用上传前回调函数，异步的时候不起作用，即如果使用`image.onload()`进行图片操作，则阻挡不了上传事件


## 文件下载

```js
axios
    .get(
      "https://qtnc.worldmaipu.com/admin/static/img/%E9%A6%96%E9%A1%B5.9d1f7334.jpg",
      {
        responseType: "blob",
        headers: {
          content: "test",
        },
      }
    )
    .then((res) => {
      console.log("返回信息：", res);
      const link = document.createElement("a");
      link.download = "test.jpg"
      link.href = window.URL.createObjectURL(res.data);
      link.click();
    });
```




## 高德地图API

- 使用搜索等业务时，注意使用web服务API，否则不会报错也不会生效



## 图标选择组件 

[e-icon-picker](https://www.npmjs.com/package/e-icon-picker)



## vue项目中使用`Animate.css`

[参考文档](https://www.cnblogs.com/suwanbin/p/13200296.html)

1. 安装 `npm i animate.css`

2. `main.js` 中使用

   ```js
   import animated from 'animate.css'
   Vue.use(animated)
   ```

3. 页面中使用

   ```vue
   vue模板中：
   <div class="ty">
       <!-- animate__animated 这个类属性是必须加的，应用的动画类也需要加上 animate__ 前缀 -->
       <div class="box animate__animated animate__bounceInLeft"></div>
   </div>
   ```

4. 注意：可以在[Animate.css官网](https://animate.style/)找到动画

   进阶用法：[使用Vue中的transition标签](https://juejin.cn/post/6844904106432135175)

5. 另一种方案

   ```vue
   <transition
       appear
       name="animate__animated animate__bounce"
       :enter-active-class="`animate__slideInUp`"
       :leave-active-class="`animate__slideOutDown`"
       :duration="{ enter: 500, leave: 1000 }"
   >
       内容
   </transition>
   ```

6. 页面跳转使用动画

   ```vue
   <template>
   	<div>
   		<transition
   			appear
   			name="animate__animated animate__bounce"
   			:enter-active-class="`animate__${right} animate__faster`"
   			:leave-active-class="`animate__${left} animate__faster`"
   		>
   			<router-view class="routee"></router-view>
   		</transition>
   	</div>
   </template>
   
   <script>
   export default {
   	name: "App",
   	data() {
   		return {
   			right: "fadeInRight",
   			left: "fadeOutLeft",
   		};
   	},
   	watch: {
   		$route(to, from) {
   			if (to.meta.index > from.meta.index) {
   				this.right = "fadeInRight";
   				this.left = "fadeOutLeft";
   			} else {
   				this.right = "fadeInLeft";
   				this.left = "fadeOutRight";
   			}
   		},
   	},
   };
   </script>
   
   <style lang="less">
   .routee {
   	position: absolute;
   	width: 100%;
   	height: 100%;
   }
   </style>
   ```

   

## config配置

```js
const path = require('path');
module.exports = {
  // 部署应用时的基本 URL
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // build时构建文件的目录 构建时传入 --no-clean 可关闭该行为
  outputDir:'dist',
  // build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir:'static',
  lintOnSave:false,  // 关闭eslint
  productionSourceMap:false,//不出现map打包
  devServer:{
    //host:'localhost',
    port:6860,
    // port:8080,
    open: true, //配置自动启动浏览器
    // proxy:{
    //   '/api':{//遇见api1前缀的请求就会触发该代理配置
    //     target:'https://dygc.worldmaipu.com',//转发的目标地址线上
    //     // target:'http://192.168.1.234:6860',//转发的目标地址线上
    //     changeOrigin:true,//支持跨域，如果协议/主机也不相同，必须加上
    //     //重写请求路径
    //     pathRewrite:{
    //       '^/api':''
    //     }
    //   }
    // }
    disableHostCheck: true, //关闭hostname检查
    // allowedHosts：‘all’
   },
  configureWebpack:{  // 覆盖webpack默认配置的都在这里
    resolve:{   // 配置解析别名
        alias:{
            '@':path.resolve(__dirname, './src'),
            '@s':path.resolve(__dirname, './src/assets/css'),
            '@i':path.resolve(__dirname, './src/assets/images'),
        } 
    }
  }
}
```


## 打包分析工具

1. 安装`webpack`和`webpack-cli`

2. 安装插件

```js
npm install --save-dev webpack-bundle-analyzer
```

```js
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```



## 音频相关（视频类似）

> 参考文章：
>
> [记一次vue中获取audio媒体总时长duration遇到的问题](https://blog.csdn.net/qq_37124515/article/details/106406242)
>
> [MDN HTMLMediaElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement)
>
> [HTMLAudioElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLAudioElement)



## 打包之后打开dist->index报错

```js
// vue.config.js
module.exports = {
	publicPath: './',    
}

// vite.config.js
module.exports = {
	base: './',    
}
```



## Vue使用`ECharts`

1. **方式一：**使用`Vue-ECharts`

   - 高于`Vue 2.7.0`版本引入

     - [Github地址](npm install echarts vue-echarts)

     - ```shell
       npm install echarts vue-echarts
       ```

   - 低于`Vue 2.7.0`版本引入  
     - 先安装`@vue/composition-api`：`npm install @vue/composition-api`

     - 注册插件：
     
       ```js
       import Vue from 'vue'
       import VueCompositionAPI from '@vue/composition-api'
       
       Vue.use(VueCompositionAPI)
       ```
       
     - 然后按照正常方式引入即可使用
    - 参考文档
      - [Vue-ECharts GitHub](https://github.com/ecomfe/vue-echarts/blob/main/README.zh-Hans.md)
      - [在Vue2项目中使用@vue/composition-api](https://juejin.cn/post/6966813426291048455)

2. **方式二：**原生ECharts引入  

   直接按照官网引入即可：https://echarts.apache.org/handbook/zh/basics/import/





## Element 验证码抽离自定义校验获取外部值

⭐此方法严重弊端：再次打开会有校验

![image-20230628133122238](Vue.assets/image-20230628133122238.png)

- 将校验规则写成一个函数，使用的时候传参
- 参数放在规则后即可
- 在自定义函数中第一个参数`rule`即可接收到参数
- ![image-20230628133127549](Vue.assets/image-20230628133127549.png)



## Vue2添加非响应式数据

1. **直接将数据定义在`script`标签下**

   - 此方定义的数据在`script`标签内部可访问变量，`template`不能访问

2. **将数据直接定义在生命周期钩子`created()`上或者`mounted()`上**

3. **使用`Object.preventExtensions`方法（）**

   - ```js
     export default {
       data() {
         return {
           bigData: Object.preventExtensions({
             ···
           })
         }
       }
     }
     ```

   - 当`bigData`值改变时，需要重新调用一次，因为`bigData`属性是响应式的

     ```js
      updateBigData (newBigData) {
         this.bigData = Object.preventExtensions(newBigData)
      }
     ```

> 参考：[为Vue组件添加非响应式数据](https://juejin.cn/post/6934711893147779109#heading-1)



## 获取设备陀螺仪

> 注意需要在`HTTPS`下才会生效，安卓设备只支持前三种数值

```js
window.addEventListener("deviceorientation", function (e) {
  console.log(e);
  // 处理event.alpha、event.beta及event.gamma
  document.querySelector("#item").innerHTML = `
  <p> 设备沿z轴上的旋转角度${e.alpha} </p>
  <p> 设备在x轴上的旋转角度，描述设备由前向后旋转的情况 ${e.beta}  </p>
  <p>表示设备在y轴上的旋转角度，描述设备由左向右旋转的情况${e.gamma} </p>
  <p>与北方向的角度差值，正北为0度，正东为90度，正南为180度，正西为270度${e.webkitCompassHeading}</p>
  <p>指北针的精确度，表示偏差为正负多少度${e.webkitCompassAccuracy} </p>
  `;
});

// 判断设备是否支持
if (window.DeviceOrientationEvent) {
    //  支持DeviceOrientation API写在这里
} else {
    console.log("对不起，您的浏览器还不支持Device Orientation!!!");
}
```

- 注意设备是否支持`absolute`

- 可使用一下方案，强制使用`absolute`（未测试不同设备效果）

- ```js
  // 获取陀螺仪数据
  function getGyro() {
    if ("ondeviceorientationabsolute" in window) {
      console.log("绝对方位");
      window.addEventListener("deviceorientationabsolute", function (event) {
        throttle(rotateMarker(-event.alpha), 100); // 设置旋转
      });
    } else if ("ondeviceorientation" in window) {
      console.log("非绝对方位");
      window.addEventListener(
        "deviceorientation",
        function (event) {
          throttle(rotateMarker(-event.alpha), 100); // 设置旋转
        },
        false
      );
    } else {
      console.log("不支持陀螺仪！");
    }
  }
  
  // 节流函数
  function throttle(fn, wait) {
    let timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(this, arguments);
          timer = null;
        }, wait);
      }
    };
  }
  ```

- 参考链接：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/deviceorientation_event)

  

## 字符串比较

- [localCompare()  MDN示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#%E4%BD%BF%E7%94%A8_localecompare)
- [构造函数 Intl.Collator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)



## 通过请求模拟a链接下载

```js
import axios from 'axios'

axios
    .get(
      "https://qtnc.worldmaipu.com/admin/static/img/%E9%A6%96%E9%A1%B5.9d1f7334.jpg",
      {
        responseType: "blob", // 设置请求类型为 blob
        headers: {
          content: "test", // 可以加载 headers，例如用作校验 token
        },
      }
    )
    .then((res) => {
      console.log("返回信息：", res);
      const link = document.createElement("a");
      link.download = "test.jpg"; // 此属性用于下载，属性值为下载名字，不填则由浏览器决定
      link.href = window.URL.createObjectURL(res.data);
      link.click();
    });
```



## 主题切换方案

- [前端主题切换](https://juejin.cn/post/7134594122391748615)

- `vue3`中可以使用`v-bind`直接给style样式绑定变量：[官方文档](https://cn.vuejs.org/api/sfc-css-features.html#v-bind-in-css)

  此方法可以响应更新css

  

## 配置跨域访问

```js
// vue.config.js
module.exports = {
    edvServer: {
        headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Methods': '*'
		},
    }
}


// vite.config.js
export default {
    server: {
        cors: true,
        host: '0,0,0,0',
    }
}
```

- 参考文档：[掘金](https://juejin.cn/post/7205546336082001980)



## element-plus nav 效果

```css
background-image: radial-gradient(transparent 1px, #ffffff 1px);
background-size: 4px 4px;
backdrop-filter: saturate(50%) blur(4px);
```



