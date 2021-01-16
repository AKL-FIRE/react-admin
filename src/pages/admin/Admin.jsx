import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout} from "antd";

import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav/LeftNav";
import Header from "../../components/header/Header";
import Home from "../home/Home";
import Category from "../category/Category";
import Product from "../product/Product";
import Role from "../role/Role";
import User from "../user/User";
import Bar from "../charts/Bar";
import Line from "../charts/Line";
import Pie from "../charts/Pie";

const {Footer, Sider, Content} = Layout;

/*
* 后台管理的路由组件
* */

export default class Admin extends Component {
  render() {
    const user = memoryUtils.user
    // 如果内存没有user => 当前没有登录
    if (!user || !user._id) {
      // 自动跳转到登录
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{height: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: '20px', backgroundColor: '#fff'}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/role' component={Role}/>
              <Route path='/user' component={User}/>
              <Route path='/charts/bar' component={Bar}/>
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器,可以获得更佳体验</Footer>
        </Layout>
      </Layout>
    );
  }
}