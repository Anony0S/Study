## 字符串方法

`String.prototype.padStart()`

- **`padStart()`** 方法用另一个字符串填充当前字符串（如果需要的话，会重复多次），以便产生的字符串达到给定的长度。从当前字符串的左侧开始填充。

- ```js
  'abc'.padStart(10);         // "       abc"
  'abc'.padStart(10, "foo");  // "foofoofabc"
  'abc'.padStart(6,"123465"); // "123abc"
  'abc'.padStart(8, "0");     // "00000abc"
  'abc'.padStart(1);          // "abc"
  ```

  

## 正则判断字符串是否为 Base64 格式 | 加密 | 解密

```js
function isBase64(str) {
	if (str === "" || str.trim() === "") {
		return false;
	}
	try {
		const encrypt = Buffer.from(str).toString("base64") 
		const decode = Buffer.from(encrypt, 'base64').toString()
		// return decode == str;
		const exg = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');
		return exg.test(str)

	} catch (err) {
		return false;
	}
}
```



## 浏览器打开新窗口（非Tab）  

```js
window.open(url, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
```

> [MDN Window：open() 方法](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open)



## SSE 

> 参考：
>
> [ChatGPT Stream 流式处理网络请求](https://juejin.cn/post/7249286903207641146?searchId=20240726124730C4860E7E91DD175F24EE)  
>
> [推送数据？也许你不需要 WebSocket](https://juejin.cn/post/7272564663116759074)  
>
> [MDN Streams_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)  
>
> [Nodejs stream/web](https://nodejs.cn/api/webstreams.html)  
>
> NPM包：@microsoft/fetch-event-source

#### 浏览器原生SSE  

```js
let eventSource = new EventSource(url)

eventSource.onopen = function (event) {
    console.log("open ", event)
}
eventSource.onmessage = function (event) {
    // console.log(event.data)
    const data = JSON.parse(event.data);
    resultArea.innerText += data.event.data

}
eventSource.onerror = function (e) {
    console.log(e)
    eventSource.close()
}
```

#### 缺点

- 只支持`GET`请求
- 无法自定义 Header
- 兼容性，不通过HTTP/2使用时，最大连接数为6；使用HTTP/2默认最大连接数为100

### 使用 fetch 处理 SSE 消息

```js
// 请求函数
const fetchStream = async (url: string, options: object) => {
  const response = await fetch(url, options);
  const reader = response.body.getReader();

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log("done.");
      loading.value = false;
      break; // 读取完毕
    } else {
      console.log("message: ", new TextDecoder().decode(value));
      data.value += new TextDecoder().decode(value);
    }
  }
};

// 使用
fetchStream("http://127.0.0.1:8080", {
    method: "post",
    body: JSON.stringify({ question: input.value, session_id: "test-history" }),
    headers: { "Content-Type": "application/json" },
});
```

1. 服务端返回的 Stream，浏览器会识别为 `ReadableStream` 类型数据，执行 `getReader()` 方法创建一个读取流队列，可以读取 `ReadableStream` 上的每一个分块数据；

2. 通过循环调用 reader 的 `read()` 方法来读取每一个分块数据，它会返回一个 `Promise` 对象，在 `Promise` 中返回一个包含 `value` 参数和 `done` 参数的对象；

3. `done` 负责表明这个流是否已经读取完毕，若值为 `true` 时表明流已经关闭，不会再有新的数据，此时 `result.value` 的值为 `undefined`；

4. `value` 是一个 `Uint8Array` 字节类型，可以通过 `TextDecoder` 转换为文本字符串进行使用。
