## Uncapitalize：将字符串首字母转为小写

```typescript
// Uncapitalize 内置类型：将字符串首字母转为小写
type KebabCase<S> = S extends `${infer First}${infer Rest}` ? Rest extends Uncapitalize<Rest> ? `${Uncapitalize<First>}${KebabCase<Rest>}` : `${Uncapitalize<First>}-${KebabCase<Rest>}` : S 

// For example
type FooBarBaz = KebabCase<"FooBarBaz">;
const foobarbaz: FooBarBaz = "foo-bar-baz";

type DoNothing = KebabCase<"do-nothing">;
const doNothing: DoNothing = "do-nothing";
```



## & 交叉类型

- **&** 交叉类型算的是 2 个类型的 **并集**。就是双方都有的东西才能合并到一起，不一样的将会被排除

- 如果排除到最后都没有相同的东西，**那么就会变 never 类型（即该类型不存在）**

- 内置类型(string,number,boolean,unio 联合类型)之间可以使用 



## & 交叉类型 和 extend 继承

- & 用于合并两个/多个类型的**交集**，当交集有冲突的时候会**自动转换为never**

- & 对 `type`和`interface` 都能生效，对这两个定义都能合并
- `extend`只能从一个接口继承另外一个接口的内容
- `extend`接口继承的时候如果类型的**交集**有冲突，那么定义接口的时候就会报错，不会自动转换为never
- 定义单个字段的时候/定义工具类（做类型体操）的时候`type`非常合适
- 定义base类/模块需要对外提供功能，提供接口/模块会被其他模块继承过去拓展的时候，`interface`更适合

## | 联合类型

- 在对象和非对象中使用存在差异

```typescript
type person = {
  name: string,
  age: number
}

type animal = {
  name: number,
  age: number,
  color: string
}

type res = person | animal // 对象和属性都具有联合属性
// 以下都为正确
const test: res = {
  name: 12,
  age: 18,
  color: "red"
}

const test: res = {
  name: "xiaohong",
  age: 18,
  color: "red"
}

const test: res = {
  name: "xiaohong", // ??? 这里使用 number 会提示缺少 color 类型 ？？？
  age: 18,
}

type res = keyof ( person | animal ) // "name" | "age"

```



## Omit、Pick、Exclude

- **Omit**：省去一部分类型 创建新类型，参数一为原始类型，参数二为**属性名称**或**属性名称的联合类型**
- **Pick**：选出一部分类型创建新类型，参数同上
- **Exclude**：排除可以赋值给指定类型的类型，注意和前两者接受参数不同

```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

```typescript
// 例子
interface Person {
  name: string;
  age: number;
  gender: string;
}

type PersonWithoutAge = Omit<Person, 'age'>;

// 等价于
// type PersonWithoutAge = {
//   name: string;
//   gender: string;
// }

const person: PersonWithoutAge = {
  name: 'John',
  gender: 'male',
};

```



## 判断是否为空类型

```typescript
{[K: string]: never} // since no value is of type never

// 例子 - 949
type AnyOf<T extends any[]> = T[number] extends 0 | '' | false | [] | {[key: string]: never}
? false : true;
```



## 其他

- type 中使用`never` 做键，就能把字段值排除
- 判断是否为某一种类型的键：`string extends K`