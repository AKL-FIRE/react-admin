import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Modal} from "antd";

import {formatDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {reqWeather} from "../../api";
import LinkButton from "../link-button";
import menuList from "../../config/menuConfig";
import './index.less'
import {ExclamationCircleOutlined} from '@ant-design/icons'


/*
* 头部
* */

class Header extends Component {

  state = {
    currentTime: formatDate(Date.now()), // 当前时间字符串
    dayPictureUrl: '', // 天气图片url
    weather: '', //天气
  }

  getTime = () => {
    this.token = setInterval(() => {
      const currentTime = formatDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }

  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京')
    // 更新状态
    this.setState({dayPictureUrl, weather})
  }

  getTitle = () => {
    let title = '首页'
    // 得到当前请求路径
    const path = this.props.location.pathname
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(item => item.key === path)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  handleLogout = () => {
    // 显示确认框
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确定退出吗',
      onOk: () => {
        // console.log('OK');
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}
        // 跳转到login
        this.props.history.replace('/login')
      },
    })
  }

  // 一般执行异步操作，发请求，启动定时器
  componentDidMount() {
    // 请求定时器
    this.getTime()
    // 获取当前天气
    this.getWeather()
  }

  componentWillUnmount() {
    clearInterval(this.token)
  }

  render() {

    const {currentTime, dayPictureUrl, weather} = this.state

    const user = memoryUtils.user.username

    const title = this.getTitle()

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎， {user}</span>
          <LinkButton onClick={this.handleLogout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt=""/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header)