import React, {Component} from 'react';
import {
  Form,
  Input,
  Button,
  message
} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";

import './login.less'
import logo from '../../assets/images/logo.png'

/*
* 登录的路由组件
* */

export default class Login extends Component {

  /*
  * async和await
  * 简化Promise对象的使用：不用再使用then()来指定成功/失败的回调函数
  * 2. 哪里写await
  *   在返回promise的表达式左侧写await： 不想要promise，想要promise异步执行成功的value数据
  * 3. 哪里写async
  *   await所在的函数（最近的）定义的左侧
  * */
  handleSubmit = async (values) => {
    // console.log(values);
    // 请求登录
    const {username, password} = values
    const result = await reqLogin(username, password) // {status: 0, data: user} {status: 1, msg: 'xxx}
    if (result.status === 0) {
      // 登录成功
      message.success('登录成功')

      // 保存user
      const user = result.data
      memoryUtils.user = user // 存在内存中
      storageUtils.saveUser(user) // 本地存储

      // 跳转到管理页面(不需要回退)
      this.props.history.replace('/')
    } else {
      // 登录失败
      message.error(result.msg)
    }
  }

  // 对密码进行验证(自定义方式)
  validatorPwd = (rule, value) => {
    if (!value) {
      return Promise.reject('密码必须输入')
    } else if (value.length < 4) {
      return Promise.reject('密码长度不能小于4位')
    } else if (value.length > 12) {
      return Promise.reject('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject('密码必须是英文，数字或下划线')
    } else {
      return Promise.resolve() // 验证通过
    }
  }

  render() {

    // 如果用户已经登录，直接跳转到管理页面
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/'/>
    }

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目:后台管理项目</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.handleSubmit}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your Username!' },
                {min: 4, message: '用户名最少4位'},
                {max: 12, message: '用户名最多12位'},
                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是字母数字和下划线'}
                ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { validator: this.validatorPwd }
                ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
