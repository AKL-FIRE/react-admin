import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import ProductHome from "./ProductHome";
import ProductAddUpdate from "./ProductAddUpdate";
import ProductDetail from "./ProductDetail";

import './product.less'

// 商品路由
export default class Product extends Component {
  render() {
    return (
     <Switch>
       <Route path='/product' component={ProductHome} exact/>
       <Route path='/product/addupdate' component={ProductAddUpdate}/>
       <Route path='/product/detail' component={ProductDetail}/>
       <Redirect to='/product'/>
     </Switch>
    );
  }
}