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

