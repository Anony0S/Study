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