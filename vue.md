## 获取元素的高度

> 思路：通过`ref`拿到真是`DOM`元素进行获取

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
     - ![image-20221112094830164](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112094830164.png)
     - [唯一文件类型说明符](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file#%E5%94%AF%E4%B8%80%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E8%AF%B4%E6%98%8E%E7%AC%A6)
  2. `before-upload`上传前钩子函数，拿到上传前文件，通过文件`type`属性获取文件类型进行判断
     - ![image-20221112101536089](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112101536089.png)

- **限制大小**

  - 原理同上，通过`before-upload`拿到上传文件，通过文件`size`属性获取文件大小进行判断

    ![image-20221112101716883](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112101716883.png)

- **实现对上传图片的宽高进行限制**

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

  ![image-20221208105120372](C:\Users\Admin\Documents\Typora\vue.assets\image-20221208105120372.png) 



### 注意事项

- 如果自定义上传函数，注意使用上传前回调函数，异步的时候不起作用，即如果使用`image.onload()`进行图片操作，则阻挡不了上传事件



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

   

##  图片上传相关

###  基于Element-ui上传组件二次封装

- **限制格式**
  1. `accept：`对文件上传控件中可选择的文件类型进行限制
     - ![image-20221112094830164](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112094830164-16739370903751.png)
     - [唯一文件类型说明符](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file#%E5%94%AF%E4%B8%80%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E8%AF%B4%E6%98%8E%E7%AC%A6)
  2. `before-upload`上传前钩子函数，拿到上传前文件，通过文件`type`属性获取文件类型进行判断
     - ![image-20221112101536089](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112101536089-16739370903752.png)

- **限制大小**

  - 原理同上，通过`before-upload`拿到上传文件，通过文件`size`属性获取文件大小进行判断

    ![image-20221112101716883](C:\Users\Admin\Documents\Typora\vue.assets\image-20221112101716883-16739370903753.png)

- **实现对上传图片的宽高进行限制**

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
