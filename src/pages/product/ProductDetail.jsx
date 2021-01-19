import React, {Component} from 'react';
import {
  Card,
  List
} from 'antd';
import {BASE_IMG_URL} from "../../utils/constants";
import {reqGetCategory} from "../../api";
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from "../../components/link-button";

const Item = List.Item

export default class ProductDetail extends Component {

  state = {
    cName1: '', // 一级分类名称
    cName2: '' // 二级分类名称
  }

  async componentDidMount() {
    const {pCategoryId, categoryId} = this.props.location.state.products
    if (pCategoryId === '0') {
      // 一级分类下的商品
      const result = await reqGetCategory(categoryId)
      if (result.status === 0) {
        const cName1 = result.data.name
        this.setState({cName1})
      }
    } else {
      // 二级分类下的商品
      // 通过多个await方式发多个请求，后面一个请求是在前一个请求成功后才发送
      // const result1 = await reqGetCategory(pCategoryId)
      // const result2 = await reqGetCategory(categoryId)
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name

      // 一次性发送多个请求
      const results = await Promise.all([reqGetCategory(pCategoryId), reqGetCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({cName1, cName2})
    }
  }

  render() {

    const {name, desc, price, detail, imgs} = this.props.location.state.products
    const {cName1, cName2} = this.state
    const title = (
      <span>
          <LinkButton>
            <ArrowLeftOutlined
              style={{marginRight: 10, fontSize: 20}}
              onClick={() => this.props.history.goBack()}
            />
          </LinkButton>
          <span>商品详情</span>
        </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item style={{justifyContent: 'start'}}>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item style={{justifyContent: 'start'}}>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item style={{justifyContent: 'start'}}>
            <span className='left'>价格：</span>
            <span>{price}元</span>
          </Item>
          <Item style={{justifyContent: 'start'}}>
            <span className='left'>所属分类：</span>
            <span>{cName1} {cName2 ? ' --> ' + cName2 : ''}</span>
          </Item>
          <Item style={{justifyContent: 'start'}}>
            <span className='left'>商品图片：</span>
            <span>
              {
                imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    alt="img"
                    className="product-img"
                  />
                ))
              }
            </span>
          </Item>
          <Item style={{justifyContent: 'start'}}>
            <span className='left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html: detail}}></span>
          </Item>
        </List>
      </Card>
    );
  }
}