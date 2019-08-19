import axios from "axios";

const isCustomCatch = function(error) {
  const catchConfig = error.config.headers.catch;
  if (catchConfig) {
    if (catchConfig === "all") {
      return true;
    } else {
      const status = error.response && error.response.status;
      if (status) {
        const needCatchedStatusCodes = catchConfig
          .split(",")
          .map(function(statusCodeStr) {
            return parseInt(statusCodeStr);
          });
        if (needCatchedStatusCodes.includes(status)) {
          return true;
        }
      }
    }
  }
  return false;
};

let defaultErrorHandler = function(error) {
  console.warn("需要自定义错误处理函数");
  console.log(error);
};

let Loading = {
  show: function() {
    console.warn("需要自定义loading.show方法");
  },
  hide: function() {
    console.warn("需要自定义loading.hide方法");
  }
};

let onRequestHandler = function(config) {};

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

export const setDefaultErrorHander = function(handler) {
  defaultErrorHandler = handler;
};
export const setLoadingMethod = function(loadingMethod) {
  Loading = loadingMethod;
};
export const setOnRequestHandler = function(handler) {
  onRequestHandler = handler;
};
