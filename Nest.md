## 13、metadata 和 Reflector

- ```typescript
  import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class AaaGuard implements CanActivate {
    constructor(private reflactor: Reflector) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      console.log('guard');
      console.log(this.reflactor.get('roles', context.getHandler())); // 这里拿到的是方法上注入的 metadata
      console.log(this.reflactor.get('roles', context.getClass())); // 这里拿到的是 class 上注入的 metadata
  
      return true;
    }
  }
  ```

  这里`this.reflactor.get`相当于`Reflactor.getMetadata(metadataKey, target, propertyKey)`，第一个参数传入注入的key值，第二个参数取决于注入的位置，**方法**还是**class**



## 14、Module 和 Provide 循环依赖

使用 `forwordRef` 注入解决循环依赖报错的问题



## 15、创建动态模块

- 创建模块的时候定义一个静态方法，通过传入options和返回值进行动态创建模块，使用的时候调用模块的这个静态方法即可

  ```typescript
  @Module({})
  export class BbbModule {
    static register(options: Record<string, any>): DynamicModule {
      return {
        module: BbbModule,
        controllers: [BbbController],
        providers: [
          {
            provide: 'CONFIG_OPTIONS',
            useValue: options,
          },
          BbbService,
        ],
        exports: [],
      };
    }
  }
  ```

- 这个静态方法名字可以自定义，但是约定了3种方法名

  - **register**：用一次模块传一次配置，比如这次调用是 BbbModule.register({aaa:1})，下一次就是 BbbModule.register({aaa:2}) 了
  - **forRoot**：配置一次模块用多次，比如 XxxModule.forRoot({}) 一次，之后就一直用这个 Module，一般在 AppModule 里 import
  - **forFeature**：用了 forRoot 固定了整体模块，用于局部的时候，可能需要再传一些配置，比如用 forRoot 指定了数据库链接信息，再用 forFeature 指定某个模块访问哪个数据库和表。

- **方法二**

  - ```typescript
    // ccc.module-definition.ts
    import { ConfigurableModuleBuilder } from '@nestjs/common';
    
    export interface CccModuleOptions {
      aaa: number;
      bbb: string;
    }
    
    export const {
      ConfigurableModuleClass,
      MODULE_OPTIONS_TOKEN,
      OPTIONS_TYPE, // 此处的 OPTIONS_TYPE 就是 CccModuleOptions 和一些拓展属性类型
      ASYNC_OPTIONS_TYPE,
    } = new ConfigurableModuleBuilder<CccModuleOptions>()
      .setClassMethodName('forRoot') // 设置静态方法名 对应3种情况：forRoot、forRootAsync、register
      .setExtras({ isGlobal: true }, (definition, extras) => ({
        // 参数一给 options 拓展的属性，参数二回调函数是收到 extras 属性之后如何修改模块定义
        ...definition,
        global: extras.isGlobal,
      }))
      .build();
    
    ```

  - ```typescript
    // ccc.controller.ts
    import { Controller, Get, Inject } from '@nestjs/common';
    import {
      OPTIONS_TYPE,
      ASYNC_OPTIONS_TYPE,
      MODULE_OPTIONS_TOKEN,
    } from './ccc.module-definition';
    
    @Controller('ccc')
    export class CccController {
      // 使用构造函数进行注入
      constructor(
        @Inject(MODULE_OPTIONS_TOKEN) private readonly options: typeof OPTIONS_TYPE, // 此处通过 typeof 获取到 OPTIONS_TYPE 类型
      ) {}
      // 直接进行注入，不需要再进行构造函数的参数注入
      // @Inject(MODULE_OPTIONS_TOKEN) private readonly options: CccModuleOptions;
    
      @Get('')
      hrllo() {
        console.log(this.options.isGlobal); // 这里打印 undefined，因为 isGlobal 是额外的参数，用来处理模块定义的，options 里拿不到
        return this.options;
      }
    }
    
    ```

  - ```typescript
    // app.module.ts
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { BbbModule } from './bbb/bbb.module';
    import { CccModule } from './ccc/ccc.module';
    
    @Module({
      imports: [
        BbbModule.register({ name: 'bbb', age: 20 }),
        // 使用 register
        // CccModule.register({ aaa: 10, bbb: 'bbb' }),
        // 使用 registerAsync 
        // CccModule.registerAsync({
        //   useFactory: async () => {
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        //     return { aaa: 10, bbb: 'ccc' };
        //   },
        // }),
        // 使用 forRoot 和 拓展属性
        CccModule.forRoot({ aaa: 13, bbb: 'ccc', isGlobal: true }),
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    
    ```




## 16、切换 fastify

- ```typescript
  // 先安装 pnpm install fastify @nestjs/platform-fastify
  // main.ts 中引入
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import {
    FastifyAdapter,
    NestFastifyApplication,
  } from '@nestjs/platform-fastify';
  
  async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
    await app.listen(3000);
  }
  bootstrap();
  ```

- ```typescript
  // app.controller.ts 中使用
  import { Controller, Get, Request, Response } from '@nestjs/common';
  import { AppService } from './app.service';
  import { FastifyReply, FastifyRequest } from 'fastify';
  
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}
  
    @Get()
    getHello(
      @Request() request: FastifyRequest,
      @Response() reply: FastifyReply,
    ): void {
      reply.header('url', request.url);
      reply.send('Hello!');
      // 这里使用 response 注入 reply 对象，就只能通过 send 方法返回数据了，不能使用 return 返回数据
      // 或者使用 @Response({passthrough: true}) 传入参数，表示不会在方法自己发送响应内容，就可以使用 return 返回数据了
      // return this.appService.getHello();
    }
  }
  
  ```

  

## 17、middleWare

> 类似 Express 中的 中间件

1. 创建中间件 `nest g middleware aaa --flat --no-spec`

2. `aaa.middleware.ts`

   ```typescript
   import { Injectable, NestMiddleware } from '@nestjs/common';
   import { Request, Response } from 'express';
   
   @Injectable()
   export class AaaMiddleware implements NestMiddleware {
     use(req: Request, res: Response, next: () => void) {
       console.log('Before');
       next();
       console.log('After');
     }
   }
   ```

3. 使用 `app.module.ts`

   ```typescript
   import {
     MiddlewareConsumer,
     Module,
     NestModule,
     RequestMethod,
   } from '@nestjs/common';
   import { AppController } from './app.controller';
   import { AppService } from './app.service';
   import { AaaMiddleware } from './aaa.middleware';
   
   @Module({
     imports: [],
     controllers: [AppController],
     providers: [AppService],
   })
   export class AppModule implements NestModule {
     configure(consumer: MiddlewareConsumer) {
       consumer
         .apply(AaaMiddleware)
         .forRoutes({ path: 'hello*', method: RequestMethod.GET }); // 这里可以通过传入参数对路由进行匹配
       consumer
         .apply(AaaMiddleware)
         .forRoutes({ path: 'world1', method: RequestMethod.GET });
     }
   }
   ```

4. 可以使用依赖注入的方式在中间件中注入

   ```typescript
   import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
   import { Request, Response } from 'express';
   import { AppService } from './app.service';
   
   @Injectable()
   export class AaaMiddleware implements NestMiddleware {
     // constructor(private readonly appService: AppService) {} // 也可以使用构造器注入
   
     @Inject(AppService) private readonly appService: AppService;
   
     use(req: Request, res: Response, next: () => void) {
       console.log('Before');
       console.log(1111111, this.appService.getHello()); // 注入之后就可以使用 appService 里的方法了
       next();
       console.log('After');
     }
   }
   
   ```

5. **next()** 参数和 **@Next** 装饰器区别

   - next参数是调用下一个middleware的,类似于vue路由守卫中的next

   - @Next 是调用下一个 handler 的, 和 @Response的效果一样

     ![image-20230713133026009](Nest.assets/image-20230713133026009.png)

6. 和 interceptor 的区别

   - interceptor 是能从 ExecutionContext 里拿到目标 class 和 handler，进而通过 reflector 拿到它的 metadata 等信息的，这些 middleware 就不可以
   - interceptor 里是可以用 rxjs 的操作符来组织响应处理流程的



## 18、RxJS 和 Interceptor 

### RxJS

- tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等
- map：对响应数据做修改，一般都是改成 {code, data, message} 的格式
- catchError：在 exception filter 之前处理抛出的异常，可以记录或者抛出别的异常
- timeout：处理响应超时的情况，抛出一个 TimeoutError，配合 catchErrror 可以返回超时的响应

### Interceptor

- 全局注入：main.ts 中 `app.useGlobalInterceptors(new xxxInterceptor())`

  这种手动 new 的没法注入依赖

- 使用 Nest 提供的 token 实现全局注入

  ![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e126e39cc9e435aac798e07947c4cfb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



## 19、内置 Pipe 和 自定义 Pipe

### 内置Pipe

- 直接使用如： `@Query('aa', ParseIntPipe)`

- 通过 new 关键字创建（此方法可以传参进行一些自定义）

  ```typescript
  @Get()
    getHello(
      @Query(
        'aa',
        new ParseIntPipe({
          // errorHttpStatusCode: HttpStatus.NOT_FOUND, // 指定错误状态码
          exceptionFactory: (msg) => {
            // 自定义错误信息 抛出异常
            console.log(msg);
            throw new HttpException('xxx' + msg, HttpStatus.NOT_IMPLEMENTED);
          },
        }),
      )
      aa: string,
    ): string {
      console.log(aa);
      return aa + 1;
      // return this.appService.getHello();
    }
  ```

- **ParseArrayPipe**

  ```typescript
    @Get('cc')
    getCc(
      @Query(
        'cc',
        new ParseArrayPipe({
          items: Number, // 指定每一项数据类型
          separator: '.', // 指定分隔符
          optional: true, // 参数可选
        }),
      )
      cc: number[],
    ) {
      console.log(cc);
      return cc;
    }
  ```

- **ParseEnumPipe**
  
  ```typescript
  // 先定义 enum 
  enum Color {
    a = 'red',
    b = 'blue',
    c = 'green',
  }
  
  // 使用
  // 此方法可以根据定义的 enum 限制传递的参数
  @Get('color/:id')
    getColor(@Param('id', new ParseEnumPipe(Color)) id: Color) {
      return id;
    }
  ```

### 自定义 Pipe

- 使用命令生成文件 `nest g pipe aaa --flat --no-spec`

- 创建的 pipe 的返回值会传递到 handler 里面 

  ```typescript
  import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
  
  @Injectable()
  export class AaaPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      console.log(value, metadata);
      return 'aaa';
    }
  }
  ```

  - **value**：handler里面接收到的值

  - **metadata**：元数据对象，包含有关传递给管道的值的其他信息，例如它的类型和所在的位置![image-20230714103916060](Nest.assets/image-20230714103916060.png)
    - metatype：参数的ts类型
    
    - type：装饰器
    
    - data：传给装饰器的参数
      ![image-20230714104444593](Nest.assets/image-20230714104444593.png)



## 20、ValidationPipe

1. 安装依赖包 `npm install -D class-validator class-transformer`
2. @Body(new ValidationPipe()) 
3. 在 dto 这里，用 class-validator 包的 @IsInt(或其他) 装饰器标记一下

- 自定义 ValiditionPipe

  ```typescript
  import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
  } from '@nestjs/common';
  import { plainToInstance } from 'class-transformer';
  import { validate } from 'class-validator';
  
  @Injectable()
  export class MyValidationPipe implements PipeTransform {
  
    async transform(value: any, metadata: ArgumentMetadata) {
      console.log('value:', value);
      console.log('metadata:', metadata);
  
      if (!metadata.metatype) return value;
      console.log(this.options);
      const object = plainToInstance(metadata.metatype, value);
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new BadRequestException('参数验证失败!');
      }
      return value;
    }
  }
  
  ```
  - value：接收到的值
  - metadata：与get请求时的pipe类似
  - 注意 metadata.metatype 即 dto 里定义的 class， 通过 plainToInstance 将 value 转换为此类的实例对象，再通过 validate 进行验证
  ![](Nest.assets\image-20230714134847858.png)

- 此外 pipe 中也可以进行依赖注入，方法同常规一样，但是需要去掉手动new`@Body(ValidationPipe）` 
- 若要创建全局 pipe，可以使用 nest 提供的 token ： **APP_PIPE**，方法同 Interceptor
- 如果不需要注入依赖（即在 pipe 里使用 @Inject），可以在 main.ts 中使用 App.useGlobalPipes(new xxxValidetionPipe())进行全局注入
- 此外，内置 ValidetionPipe 还包含以下验证方式  
  - @**Length**(10, 20)
  - @**Contains**('hello')
  - @**IsInt**()    @**Min**(0)    @**Max**(10)
  - @**IsEmail**()
  - @**IsFQDN**() // 是否是域名

- 自定义 message 信息：传入 message 函数

  ```typescript
  @Length(10, 20, {
      message({targetName, property, value, constraints}) {
          return `${targetName} 类的 ${property} 属性的值 ${value} 不满足约束: ${constraints}`
      }
  })
  title: string;
  ```

- [更多装饰器](https://www.npmjs.com/package/class-validator)



## 21、串一串Nest核心概念

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24060e0f32204907887ede38c1aa018c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="img" />



## 22、Express 文件上传

> 通过 multer 包实现文件上传

1. 单文件上传

   ```typescript
   const upload = multer({ dest: 'uploads/' }) // 此处设置上传路径
   
   // 这里 single 参数为上传 formData 的 key，只有对应才能上传
   app.post('/aaa', upload.single('aaa'), function (req, res, next) {
     console.log('req.file', req.file);
     console.log('req.body', req.body);
   })
   ```

   - `req.file`为文件相关信息

   - `req.body`为非文件的字段

     

2. 多文件上传 - 通过 upload.array，可以指定最大上传数量

   ```typescript
   app.post('/bbb', upload.array('bbb', 2), function (req, res, next) {
   	console.log('req.files', req.files);
   	console.log('req.body', req.body);
   }, function (err, req, res, nest) { // 第二个回调为错误处理
   	if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
   		res.status(400).end('Too many files uploaded')
   	}
   })
   ```

   - 可以通过添加第二个回调函数，对上传出现的错误进行捕获处理

     

3. 多个字段上传文件 - 可以对不同的字段做不同数量的限制

   ```typescript
   app.post('/ccc', upload.fields([
   	{ name: 'aaa', maxCount: 3 },
   	{ name: 'bbb', maxCount: 2 }
   ]), function (req, res, next) {
   	console.log('req.files:', req.files);
   	console.log('req.body:', req.body);
   })
   ```

4. 不设置上传字段

   ```typescript
   app.post('/ddd', upload.any(), function (req, res, next) {
   	console.log('req.files:', req.files);
   	console.log('req.body:', req.body);
   })
   ```

5. 自定义**上传路径**和**保存文件名**

   ```typescript
   // 设置保存路径和文件名 - 其他用法同上
   const storage = multer.diskStorage({
   	destination: function (req, file, cb) {
   		try {
   			fs.mkdirSync(path.join(process.cwd(), 'my-uploads'))
   		} catch (e) {
   			cb(null, path.join(process.cwd(), 'my-uploads'))
   		}
   	},
   	filename: function (req, file, cb) {
   		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
   		cb(null, file.fieldname + '-' + uniqueSuffix)
   	}
   })
   const upload = multer({ storage }) // 上传文件的目录
   ```



## 23、Nest 文件上传 

1. 安装 multer 类型包 `npm install -D @types/multer`

2. 添加 handler 

   - ```typescript
     @Post('aaa')
     @UseInterceptors(FileInterceptor('aaa', {
         dest: 'uploads'
     }))
     uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
         console.log('body', body);
         console.log('file', file);
     }
     ```

     - 使用 FileInterceptor 来提取 aaa 字段，然后通过 UploadedFile 装饰器把它作为参数传入。

   - 多文件上传

     ```typescript
     @Post('bbb')
     @UseInterceptors(FilesInterceptor('bbb', 3, {
         dest: 'uploads'
     }))
     uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
         console.log('body', body);
         console.log('files', files);
     }
     ```

   - 多个文件字段

     ```typescript
     @Post('ccc')
     @UseInterceptors(FileFieldsInterceptor([
         { name: 'aaa', maxCount: 2 },
         { name: 'bbb', maxCount: 3 },
     ], {
         dest: 'uploads'
     }))
     uploadFileFields(@UploadedFiles() files: { aaa?: Express.Multer.File[], bbb?: Express.Multer.File[] }, @Body() body) {
         console.log('body', body);
         console.log('files', files);
     }
     ```

   - 任何字段

     ```typescript
     @Post('ddd')
     @UseInterceptors(AnyFilesInterceptor({
         dest: 'uploads'
     }))
     uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
         console.log('body', body);
         console.log('files', files);
     }
     ```

3. 指定 storage（存储路径和文件名）

     - ```typescript
       // 设置存储路径和文件名
       import * as multer from "multer";
       import * as fs from 'fs';
       import * as path from "path";
       
       const storage = multer.diskStorage({
           destination: function (req, file, cb) {
               try {
                   fs.mkdirSync(path.join(process.cwd(), 'my-uploads'));
               }catch(e) {}
       
               cb(null, path.join(process.cwd(), 'my-uploads'))
           },
           filename: function (req, file, cb) {
               const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
               cb(null, file.fieldname + '-' + uniqueSuffix)
           }
       });
       
       export { storage };
       ```

     - 使用

       ```typescript
       @Post('ddd')
       @UseInterceptors(AnyFilesInterceptor({
        	storage: storage   
       })
       uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
           console.log('body', body);
           console.log('files', files);
       }
       ```

4. 自定义文件校验

     - 使用 pipe 

       ```typescript
       import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
       
       @Injectable()
       export class FileSizeValidationPipe implements PipeTransform {
         transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
           if(value.size > 10 * 1024) {
             throw new HttpException('文件大于 10k', HttpStatus.BAD_REQUEST);
           }
           return value;
         }
       }
       ```

     - 直接添加到 UploadedFile 里面

       ```typescript
       uploadFiles(@UploadedFiles(FileSizeValidationPipe) files: Array<Express.Multer.File>, @Body() body) {
           console.log('body', body);
           console.log('files', files);
       }
       ```

5. 内置文件校验

   ```typescript
   @Post('aaa')
     @UseInterceptors(FileInterceptor('aaa', { dest: 'uploads' }))
     uploadFile(
       @UploadedFile(
         new ParseFilePipe({
           exceptionFactory(error) { // 自定义文件校验失败信息
             console.log('error:', error);
             throw new HttpException('文件校验失败!', 404);
           },
           validators: [
             new MaxFileSizeValidator({ // 文件大小校验 - 可以传入 message 失败信息
               maxSize: 10 * 1024 * 1024,
               message: '文件大于 10K 了',
             }),
             new FileTypeValidator({ // 文件类型校验 - 没有 message 参数
               fileType: 'image/png',
             }),
           ],
         }),
       )
       files: { aaa?: Express.Multer.File },
       @Body() body,
     ) {
       console.log('body:', body);
       console.log('file:', files);
     }
   ```

6. 自定义 FileValidator

   ```typescript
   import { FileValidator } from "@nestjs/common";
   
   export class MyFileValidator extends FileValidator{
       constructor(options) {
           super(options);
       }
       isValid(file: Express.Multer.File): boolean | Promise<boolean> {
           if(file.size > 10000) {
               return false;
           }
           return true;
       }
       buildErrorMessage(file: Express.Multer.File): string {
           return `文件 ${file.originalname} 大小超出 10k`;
       }
   }
   ```



## 24、Nest 打印日志

> 暂时只做了解



## 25、学习Docker

- `docker pull`：拉取镜像
- `docker run --name nginx-test2 -p 80:80 -v /tmp/aaa:/usr/share/nginx/html -e KEY1=VALUE1 -d nginx:latest `
  - -p 是端口映射
  - -v 是指定数据卷挂载目录
  - -e 是指定环境变量
  - -d 是后台运行

- `docker exec`：相当于在容器内执行命令
  - -i 是 terminal 交互的方式运行
  - -t 是 tty 终端类型
  - 例如：`docker exec -i -t 68630e312c6ebf8b4ded7e9a583d6c5a4e75a1c95948415397a136b329ae5fb5 /bin/bash`
- `docker inspect`：查看容器详情
- `docker volume`：管理卷数据
- `docker start`：启动一个已经停止的容器
- `docker rm`：删除一个容器
- `docker stop`：停止一个容器



## 26、DockerFile

- ```typescript
  FROM node:latest
  
  WORKDIR /app
  
  COPY . .
  
  RUN npm config set registry https://registry.npmmirror.com/
  
  RUN npm install -g http-server
  
  EXPOSE 8080
  
  VOLUME /app
  
  CMD ["http-server", "-p", "8080"]
  ```

  - FROM：基于一个基础镜像来修改
  - WORKDIR：指定当前工作目录
  - COPY：把容器外的内容复制到容器内
  - EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
  - RUN：在容器内执行命令
  - CMD：容器启动的时候执行的命令
  - VOLUME：设置挂载点

- `docker build -t aaa:ddd -f 2.Dockerfile .`

  - -t：指定 name:tag
  - -f：指定 dockerfile 文件名，默认为 dockerfile



## 27、Nest 编写 Dockerfile

- .dockerignore文件：忽略哪些文件 - 即构建的时候不会参与

  ```dockerfile
  *.md
  !README.md
  node_modules/
  [a-c].txt
  .git/
  .DS_Store
  .vscode/
  .dockerignore
  .eslintignore
  .eslintrc
  .prettierrc
  .prettierignore
  ```

  - ***.md**：忽略所有md结尾的文件
  - **!README.md**：不包含README.md文件
  - **node_modules/**：忽略 node_modules 下 的所有文件
  - **[a-c].txt**：忽略 a.txt、b.txt、c.txt 这三个文件
  - 

  

- 使用多阶段构建和 alpine 减小构建镜像体积

  ```dockerfile
  # 第一次构建 - nest 打包
  FROM node:lts-alpine as build-stage
  
  WORKDIR /app
  
  COPY package*.json ./
  
  # 替换 npm 镜像源，可以不用 
  # RUN npm config set registry https://registry.npmmirror.com 
  RUN npm install
  
  COPY . .
  
  RUN npm run build
  
  # 第二次构建 - 将第一次构建的 dist 复制出来
  FROM node:lts-alpine as production-stage
  
  COPY --from=build-stage /app/dist /app
  COPY --from=build-stage /app/package.json /app/package.json
  
  WORKDIR /app
  
  RUN npm install --production
  
  EXPOSE 3000
  
  CMD ["node", "/app/main.js"]
  ```



## 28、提升 Dockerfile

- 使用 alpine 基础镜像构建 - 减小构建镜像体积
- 使用多阶段构建 - 去掉不必要的文件
- package.json 单独安装，利用 Docker 缓存加快构建速度
- 
