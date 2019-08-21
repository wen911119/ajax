import axios from "axios";

var isCustomCatch = function(error) {
  var catchConfig = error.config.headers.catch;
  if (catchConfig) {
    if (catchConfig === "all") {
      return true;
    } else {
      var status = error.response && error.response.status;
      if (status) {
        var needCatchedStatusCodes = catchConfig
          .split(",")
          .map(function(statusCodeStr) {
            return parseInt(statusCodeStr);
          });
        if (needCatchedStatusCodes.indexOf(status) > -1) {
          return true;
        }
      }
    }
  }
  return false;
};

var defaultErrorHandler = function(error) {
  console.warn("需要自定义错误处理函数");
  console.log(error);
};

var Loading = {
  show: function() {
    console.warn("需要自定义loading.show方法");
  },
  hide: function() {
    console.warn("需要自定义loading.hide方法");
  }
};

var onRequestHandler = function(config) {};

axios.interceptors.request.use(function(config) {
  if (config.headers.loading !== "false") {
    config.headers.loadingId = Loading.show();
  }
  onRequestHandler && onRequestHandler(config);
  return config;
});

axios.interceptors.response.use(
  function(response) {
    if (response.config.headers.loading !== "false") {
      Loading.hide(response.config.headers.loadingId);
    }
    return response.data;
  },
  function(error) {
    if (error.config.headers.loading !== "false") {
      Loading.hide(error.config.headers.loadingId);
    }
    if (isCustomCatch(error)) {
      // 用户希望自己处理异常
      return Promise.reject(error);
    } else {
      // 默认错误处理
      defaultErrorHandler(error);
      // 终止promise链
      return new Promise(function() {});
    }
  }
);

export default axios;

export var setDefaultErrorHander = function(handler) {
  defaultErrorHandler = handler;
};
export var setLoadingMethod = function(loadingMethod) {
  Loading = loadingMethod;
};
export var setOnRequestHandler = function(handler) {
  onRequestHandler = handler;
};
