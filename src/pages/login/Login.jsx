import React, {Component} from 'react';
import {
  Form,
  Input,
  Button} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';


import './login.less'
import logo from './images/logo.png'

/*
* 登录的路由组件
* */

export default class Login extends Component {

  handleSubmit = (values) => {
    console.log(values)
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
