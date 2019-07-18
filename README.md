### 用法

和 axios 一致。

### 和 axios 不同地方

基础用法和 axios 是一样的，只有以下几个地方不一样。

##### 错误处理

默认会处理所有的错误，也就是你在使用时不用再 catch 了。
如果某次请求你希望自己处理错误，可以参考以下：

1. 不管什么错误类型你都希望自己处理

```javascript
import ajax from "@ruiyun/ajax";
ajax.post(
  "https://demo.ruiyun.com",
  {
    name: "wj"
  },
  {
    headers: {
      catch: "all"
    }
  }
);
```

2. 只有 status 等于 400 或者 401 时才自己处理

```javascript
import ajax from "@ruiyun/ajax";
ajax.post(
  "https://demo.ruiyun.com",
  {
    name: "wj"
  },
  {
    headers: {
      catch: "400,401"
    }
  }
);
```

##### 默认 loading（可关闭）

默认是所有请求都有 loaidng。但是需要你先设置自定义 loading 方法。

```javascript
import { setLoadingMethod } from "@ruiyun/ajax";
import Indicator from "h5-indicator";
setLoadingMethod({
  show: Indicator.showLoading,
  hide: Indicator.hideLoading
});
```

如果某次请求需要关闭 loading 可以参考以下：

```javascript
import ajax from "@ruiyun/ajax";
ajax.post(
  "https://demo.ruiyun.com",
  {
    name: "wj"
  },
  {
    headers: {
      loading: "false"
    }
  }
);
```

##### 设置 onRequest 拦截器

```javascript
import { setOnRequestHandler } from "@ruiyun/ajax";
setOnRequestHandler(config => {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.token = token;
  }
});
```

##### 设置默认错误处理函数

```javascript
import { setDefaultErrorHander } from "@ruiyun/ajax";
import Indicator from "h5-indicator";
setDefaultErrorHander(error => {
  console.dir(error);
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      // 未授权
      Indicator.toast("未授权");
    } else if (status < 500) {
      Indicator.toast(error.response.data.message);
    } else {
      Indicator.toast("服务异常,请稍后再试");
    }
  } else {
    Indicator.toast("网络异常");
  }
});
```
