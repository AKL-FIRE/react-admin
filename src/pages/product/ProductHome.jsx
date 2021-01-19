import React, {Component} from 'react';
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  message
} from 'antd'
import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";

import {PlusOutlined} from '@ant-design/icons';
const Option = Select.Option

// product的默认子路由组件
export default class ProductHome extends Component {

  state = {
    total: 0, // 商品的总数量
    products: [], // 商品的数组
    loading: false, // 是否loading
    searchName: '', // 搜索的关键字
    searchType: 'productName', // 根据哪个字段搜索
  }

  componentDidMount() {
    this.getProducts(1)
  }

  // 获取指定页码的列表数据显示
  getProducts = async (pageNum) => {
    this.pageNum = pageNum // 保存pageNum,让其他方法看得见
    this.setState({loading: true}) // 显示loading
    const {searchName, searchType} = this.state
    let result
    if (searchName) {
      // 如果关键字有值，说明要做搜索分页
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else {
      // 一般分页
      result = await reqProducts(pageNum, 3)
    }
    this.setState({loading: false}) // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据，更新状态，显示分页列表
      const {total, list} = result.data
      this.setState({total, products: list})
    }
  }

  // 更新指定商品的状态
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }

  render() {

    const {products, total, loading, searchType, searchName} = this.state

    const title = (
      <span>
        <Select
          defaultValue={searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType: value})}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type='primary'>
        <PlusOutlined/>
        添加商品
      </Button>
    )

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: price => '￥' + price // 当前指定了对应的属性，传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        render: product => {
          const {status, _id} = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '下架'}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        render: products => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', {products})}>详情</LinkButton>
              <LinkButton>修改</LinkButton>
            </span>
          )
        }
      }
    ];


    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          bordered
          rowKey='_id'
          dataSource={products}
          columns={columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total: total,
            onChange: this.getProducts
          }}
        >
        </Table>
      </Card>
    );
  }
}