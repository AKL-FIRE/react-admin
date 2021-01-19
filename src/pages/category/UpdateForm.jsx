import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
} from "antd";

// 更新分类的form组件
const Item = Form.Item

export default class UpdateForm extends Component {

  formRef = React.createRef()

  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    // 将form对象传给父组件
    this.props.setForm(this.formRef.current)
  }

  render() {
    const {categoryName} = this.props

    return (
     <Form
       ref={this.formRef}
       initialValues={{
         categoryName: categoryName
       }}
     >
      <Item
        name="categoryName"
        rules={[
          {
            required: true,
            message: '分类名称必须输入'
          }
        ]}
      >
        <Input/>
      </Item>
     </Form>
    );
  }
}
