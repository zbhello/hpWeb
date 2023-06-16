// 这里请求封装的主要逻辑，你可以分析并将他优化，如果有更好的封装方法欢迎联系我Q：2356924146
import axios, { CreateAxiosDefaults } from "axios";
import { IOption } from "./inteface";
const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 此处编写请求拦截代码，一般用于加载弹窗，或者每个请求都需要携带的token
    console.log("正在请求..."); // 请求携带的token
    return config;
  },
  (err) => {
    console.log("请求失败", err);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    console.log("响应成功"); //该返回对象会绑定到响应对象中
    return res;
  },
  (err) => {
    console.log("响应失败", err);
  }
);
//options 接收 {method, url, params/data}
export default function (
  options: IOption = {
    method: "get",
  }
) {
  return instance({
    ...options,
  } as any);
}
