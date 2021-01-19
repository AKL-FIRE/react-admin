/*
* 包含应用中所有接口请求函数的模块
* 每个函数的返回值都是promise
* */

import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from "antd";

// const BASE = 'http://localhost:5000'
const BASE = ''

// 登录接口
// export function reqLogin(username, password) {
//   return ajax('/login', {username, password}, 'POST')
// }
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

// 获取一级/二级分类的列表
export const reqCategory = (parentId) => ajax(BASE + '/manage/category/list', {parentId}, 'GET')
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')
// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')
// 获取一个分类
export const reqGetCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId}, 'GET')
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize}, 'GET')
// 搜索商品分页列表
// searchType: 搜索的类型,productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})
// 更新商品的状态（上架或者下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
/*
* 天气接口
* */
export const reqWeather = (city) => {
  return new Promise((resolve, reject)=> {
    const url = `http://api.map.baidu.com?city=${city}`
    // jsonp(url, {}, (err, data) => {
    //   // 如果成功了
    //   if (!err && data.status === 'success') {
    //     // 取出需要的数据
    //     const {dayPictureUrl, weather} = data.results[0].weather_data[0]
    //     resolve({dayPictureUrl,weather})
    //   } else {
    //     // 如果失败了
    //     message.error('获取天气失败')
    //   }
    // })
    resolve({dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png', weather: '晴'})
  })
}
