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
  ![image-20230714134847858](C:\Users\Admin\Documents\Typora\Nest.assets\image-20230714134847858.png)

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



## Express 文件上传

