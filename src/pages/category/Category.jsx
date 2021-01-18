import React, {Component} from 'react';
import {Button, Card, message, Table, Modal} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategory, reqUpdateCategory} from "../../api";
import AddForm from "./AddForm";
import UpdateForm from "./UpdateForm";

import {PlusOutlined, ArrowRightOutlined} from '@ant-design/icons';



export default class Category extends Component {

  state = {
    categories: [], // 一级分类列表
    loading: false, // 是否正在获取数据中
    parentId: '0', // 当前需要显示的分类列表的父分类Id
    parentName: '', //当前需要显示的分类列表的父分类名称
    subCategories: [], // 二级分类列表
    showStatus: 0, // 标识更新/更新的确认框是否显示，0： 都不显示， 1： 显示添加， 2： 都显示
  }

  // 获取一级/二级分类列表
  getCategory = async () => {
    // 在发请求前显示loading
    this.setState({loading: true})
    const {parentId} = this.state
    // 发异步ajax请求
    const result = await reqCategory(parentId)
    // 请求完成后，隐藏loading
    this.setState({loading: false})
    if (result.status === 0) {
      // 取出分类数据(一级或二级)
      const categories = result.data
      if (parentId === '0') {
        // 更新一级分类
        this.setState({categories: categories})
      } else {
        // 更新二级分类
        this.setState({subCategories: categories})
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  // 显示指定一级分类子对象的二级子列表
  showSubCategories = (category) => {
    // 先更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      // 回调函数会在状态更新且重新render()后执行
      this.getCategory()
    })
  }

  // 显示一级分类列表
  showCategories = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategories: []
    })
  }

  // 响应点击取消
  handleCancel = () => {
    this.form.resetFields() // 清除输入数据
    this.setState({
      showStatus: 0
    })
  }

  // 显示添加
  showAdd = () => {
    this.setState({showStatus: 1})
  }

  // 显示更新
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    this.setState({showStatus: 2})
  }

  // 添加分类
  addCategory = () => {

  }

  // 更新分类
  updateCategory = async () => {
    // 隐藏确认
    this.setState({showStatus: 0})
    // 2.发请求更新分类
    const categoryId = this.category._id
    const categoryName = this.form.getFieldValue('categoryName')
    this.form.resetFields() // 清除输入数据
    const result = await reqUpdateCategory(categoryId, categoryName)
    // 3.重新显示列表
    if (result.status === 0) {
      this.getCategory()
    }
  }

  componentDidMount() {
    // 发异步ajax请求
    this.getCategory()
  }

  render() {
    // 读取状态数据
    const {categories, loading, subCategories, parentId, parentName, showStatus} = this.state

    // 读取指定的分类
    const category = this.category || {}

    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
        <ArrowRightOutlined style={{marginRight: '5px'}}/>
        <span>{parentName}</span>
      </span>)

    // card的右侧
    const extra = (
      <Button type="primary" icon={<PlusOutlined/>} onClick={this.showAdd}>
        添加
      </Button>
    )

    const columns = [
      {
        title: '分类的名称',
        dataIndex: 'name', // 显示数据对应的属性名
      },
      {
        title: '操作',
        width: 300,
        // 返回需要显示的界面标签
        render: (category) => {return (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {
              this.state.parentId === '0' ?  <LinkButton onClick={() => this.showSubCategories(category)}>查看子分类</LinkButton> : null
            }
          </span>
        )}
      }
    ];

    return (
      <Card title={title} extra={extra} style={{width: "100%"}}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId === '0' ? categories : subCategories}
          columns={columns}
          pagination = {{defaultPageSize: 5, showQuickJumper: true}}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm/>
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={category.name} setForm={form => this.form = form}/>
        </Modal>
      </Card>
    );
  }
}