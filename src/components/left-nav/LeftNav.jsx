import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import { Menu } from 'antd';

import logo from '../../assets/images/logo.png'
import menuList from "../../config/menuConfig";
import './index.less'

const { SubMenu } = Menu;

/*
* 左侧导航栏
* */
class LeftNav extends Component {

  // 根据menu的数据数组生成对应标签数组,使用map递归调用写法
  getMenuNodes = (menuList) => {
    return menuList.map(item => {
      /*
      *     title: '首页', // 菜单标题名称
            key: '/home', // 对应的path
            icon: 'home', // 图标名称
            isPublic: true, // 公开的
      *
      * */
      const path = this.props.location.pathname
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>
              {item.title}
            </Link>
          </Menu.Item>
        )
      } else {
        // 查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(cItem => cItem.key === path)
        // 如果存在，说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = item.key
        }
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  render() {
    const menuNodes = this.getMenuNodes(menuList)
    // 得到当前请求路由路径
    const path = this.props.location.pathname
    // 得到需要打开的菜单项key
    const openKey = this.openKey
    return (
        <div className="left-nav">
          <Link to="/" className="left-nav-header">
            <img src={logo} alt=""/>
            <h1>硅谷后台</h1>
          </Link>

          <Menu
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
            mode="inline"
            theme="dark"
          >
            {
              menuNodes
            }
          </Menu>
        </div>
    );
  }
}

/*
* withRouter高阶组件：
* 包装非路由组件，返回一个新的组件
* 新的组件向非路由组件传递3个属性：history/location/match
* */
export default withRouter(LeftNav)