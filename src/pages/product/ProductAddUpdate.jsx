import React, {Component} from 'react';
import {
  Card,
  Form,
  Input,
  Cascader,
  Upload,
  Button
} from 'antd';
import LinkButton from "../../components/link-button";
import PicturesWall from "./PicturesWall";
import {reqCategory} from "../../api";

import {ArrowLeftOutlined} from '@ant-design/icons'
const {Item} = Form
const {TextArea} = Input

// Product的添加和更新的子路由组件


export default class ProductAddUpdate extends Component {

  state = {
    optionLists: []
  }

  pw = React.createRef()

  initOptions = async (categories) => {
    // 根据categories生成options数组
    const options = categories.map(value => ({
      value: value._id,
      label: value.name,
      isLeaf: false // 不是叶子
    }))
    // 如果是一个二级分类商品的更新
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if (isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategory = await this.getCategory(pCategoryId)
      // 生成二级列表的options
      const childOptions = subCategory.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级option上
      targetOption.children = childOptions

    }
    this.setState({optionLists: options})
  }

  // 获取一级/二级分类列表
  // async函数的返回值是一个新的Promise对象，Promise的结果和值由async的结果来决定
  getCategory = async (parentId) => {
    const result = await reqCategory(parentId)
    if (result.status === 0) {
      const categories = result.data
      if (parentId === '0') {
        // 一级分类列表
        this.initOptions(categories)
      } else {
        // 二级分类列表
        return categories // 返回二级列表 ==》 当前async函数返回的Promise
      }
    }
  }

  // 验证价格的函数
  validatePrice = (rule, value) => {
    if (value * 1 > 0) {
      // 验证通过
      return Promise.resolve()
    } else {
      return Promise.reject('输入必须是大于0的数字')
    }
  }

  // 用来加载下一级列表的回调函数
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 显示loading
    targetOption.loading = true;

    // 根据选中的分类获取二级列表数据，并更新
    const subCategories = await this.getCategory(targetOption.value)
    // 隐藏loading
    targetOption.loading = false
    if (subCategories && subCategories.length > 0) {
      // 生成二级列表的options
      const childOptions = subCategories.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else {
      // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
    // 强制react重绘DOM
    this.setState({optionLists: this.state.optionLists})
  }

  submit = (values) => {
    // console.log(values)
    const imgs = this.pw.current.getImgs()
    console.log(imgs)
  }

  componentDidMount() {
    this.getCategory('0')
  }

  render() {
    // 头部左侧标题
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <ArrowLeftOutlined/>
        </LinkButton>
        <span>{this.isUpdate ? '更新商品' : '添加商品'}</span>
      </span>
    )

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: {span: 3}, // 左侧col的宽度
      wrapperCol: {span: 8} // 指定右侧包裹的宽度
    }

    // 取出路由携带的state
    const product = this.props.location.state
    // 保存是否是更新的标志
    this.isUpdate = !!product
    // 保存商品（如果没有，保存{}）
    this.product = product || {}
    // 用来接受级联分类ID的数组
    const categoryIds = []
    const {pCategoryId, categoryId, imgs} = this.product
    if (this.isUpdate) {
      if (pCategoryId === '0') {
        // 商品是一个一级分类商品
        categoryIds.push(categoryId)
      } else {
        // 商品是一个一级分类商品
        // 商品是一个二级分类商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const {optionLists} = this.state

    return (
      <Card title={title}>
        <Form
          {...formItemLayout}
          initialValues={{
            name: this.product.name,
            desc: this.product.desc,
            price: this.product.price,
            category: categoryIds
          }}
          onFinish={this.submit}
        >
          <Item
            label="商品名称"
            name="name"
            rules={[{
              required: true,
              message: '必须输入商品名称'
            }]}
          >
            <Input placeholder='请输入商品名称'/>
          </Item>
          <Item
            label="商品描述"
            name="desc"
            rules={[{
              required: true,
              message: '必须输入商品描述'
            }]}
          >
            <TextArea placeholder="请输入商品描述"/>
          </Item>
          <Item
            label="商品价格"
            name="price"
            rules={[{
              required: true,
              message: '必须输入价格'
            },
              {
                validator: this.validatePrice
              }]}
          >
            <Input type="number" addonAfter="元"/>
          </Item>
          <Item
            label="商品分类"
            name="category"
            rules={[{
              required: true,
              message: '必须选择类型'
            }]}
          >
            <Cascader
              options={optionLists} // 需要显示的列表数据
              loadData={this.loadData} // 当选择某个列表项，加载下一级列表项数据
            />
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="商品详情">
            <Input/>
          </Item>
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.submit}
            >提交</Button>
          </Item>
        </Form>
      </Card>
    );
  }
}