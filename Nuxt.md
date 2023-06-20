## 使用axios 包含请求拦截器 响应拦截器

1. 安装 axios `npm i axios`

2. 使用插件注册，将`axios`挂在到`nuxtApp`上

   注：可以同时设置`axios`的默认配置

   ```js
   import axios from 'axios';
   
   export default defineNuxtPlugin((nuxtApp) => {
   	nuxtApp.$axios = axios;
   	// 请求拦截器
   	nuxtApp.$axios.interceptors.request.use((config) => {
   		// config.headers.common['Authorization'] = 'Bearer token123';
   		return config;
   	}, (error) => {
   		// 请求错误的处理
   		return Promise.reject(error);
   	});
   
   	// 响应拦截器
   	nuxtApp.$axios.interceptors.response.use((response) => {
   		return response;
   	}, (error) => {
   		// 响应错误的处理
   		if (error.response.status === 401) {
   			nuxtApp.app.redirect('/404');
   		}
   		return Promise.reject(error);
   	});
   });
   
   ```

3. 使用时直接引入axios即可`const axios = useNuxtApp().$axios`



## assets 和 public

- assets 文件夹里的文件使用需要 动态引入 ：`~/assets/test.png`
- public 文件夹里的文件可以直接使用静态路径 ： `/test.png`，会自动引入 public 文件夹下的 test.png