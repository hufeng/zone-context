# zone-context

dubbo-js 的 zone 的改进版，等孵化成熟合入 dubbo-js
设计新的 zone-context,通过 asyncResource.runInAsyncScope 来进行隔离，解决同步调用和异步调用的问题

# api

## zoneContext

```js
ZoneContext(fn: Function);
//如果fn是异步函数，确保返回promise,zonecontext要根据fn的执行结束清除context中的数据
```

## getContext

## setContext

## test

```sh
node test.js
```
