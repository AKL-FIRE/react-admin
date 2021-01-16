/*
* 封装axios库
* 函数返回的是Promise对象
* 1. 优化：统一处理请求异常
*   在外层包一个自己创建的promise对象
*   在请求出错时，不reject(value)，而是显示错误提示
* 2. 优化2： 异步得到的不是response，而是response.data
*   在请求成功时：resolve(response.data)
* */

import axios from "axios";
import {message} from "antd";

export default function ajax(url, data={}, type='GET') {

  return new Promise(((resolve, reject) => {
    let promise = null
    // 1. 执行异步ajax请求
    if (type === 'GET') {
      // 发送GET
      promise = axios.get(url, {
        params: data
      })
    } else {
      // 发送POST
      promise = axios.post(url, data)
    }
    // 2. 如果成功了，调用resolve(value)
    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
      // 3. 如果失败了，不调用reject(value),而是提示异常信息
      //reject(error)
      message.error('请求出错了' + error.message)
    })
  }))
}