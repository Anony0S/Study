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