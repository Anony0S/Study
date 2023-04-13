## CSS制作角标

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div class="select">测试</div>
</body>

</html>

<style>
    .select {
        position: relative;
        width: 81px;
        height: 93px;
        margin: 0 auto;
        text-align: center;
        line-height: 93px;
        color: #4ABE84;
        background-color: #fff;
        box-shadow: 0px 2px 7px 0px rgba(85, 110, 97, 0.35);
        border-radius: 7px;
        border: 1px solid rgba(74, 190, 132, 1);
    }

    .select:before {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        border: 17px solid #4ABE84;
        border-top-color: transparent;
        border-left-color: transparent;
        border-radius: 0 0 5px 0;
    }

    .select:after {
        content: '';
        width: 5px;
        height: 12px;
        position: absolute;
        right: 6px;
        bottom: 6px;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: rotate(45deg);
    }
</style>

```

效果：

​	　![image-20221227141616190](C:\Users\Admin\Documents\Typora\CSS.assets\image-20221227141616190.png)



## 瀑布流布局  

```js
/* 瀑布流布局 */
.consultCon .picture {
  column-gap: 5rpx;
  column-count: 2;
  margin: 20rpx 0;
}
```

> 使用CSS多列布局的方式
>
> [CSS 多列布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Columns)



## 边框图片（`border-image`）

> 参考：http://c.biancheng.net/css3/border-image.html

- `border-image-source`：定义边框图像的路径；
- `border-image-slice`：定义边框图像从什么位置开始分割；
- `border-image-width`：定义边框图像的厚度（宽度）；
- `border-image-outset`：定义边框图像的外延尺寸（边框图像区域超出边框的量）；
- `border-image-repeat`：定义边框图像的平铺方式。



## `object-fit`属性

> [半深入理解CSS3 object-position/object-fit属性](https://link.zhihu.com/?target=https%3A//www.zhangxinxu.com/wordpress/2015/03/css3-object-position-object-fit/)



## 多列布局图片不铺满

![image-20230318112128248](C:\Users\Admin\Documents\Typora\CSS.assets\image-20230318112128248.png)

给图片添加属性`vertical-align: middle;`

其他情况下同理，图片高度未固定为整个盒子高度时都会发生这种情况



## 文字溢出省略号

```css
font-size: 10pt !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
display: -webkit-box !important;
-webkit-line-clamp: 2; //文字上限行
-webkit-box-orient: vertical;
```

