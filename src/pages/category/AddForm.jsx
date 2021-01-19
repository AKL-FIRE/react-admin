import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  Input,
} from "antd";

// 添加分类的form组件
const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {

  formRef = React.createRef()

  static propTypes = {
    categories: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类id
    setForm: PropTypes.func.isRequired // 用来传递form对象
  }

  componentDidMount() {
    this.props.setForm(this.formRef.current)
  }

  render() {

    const {categories, parentId} = this.props

    return (
     <Form
       initialValues={{select: parentId}}
       ref={this.formRef}
     >
       <Item name="select">
         <Select>
           <Option value='0'>一级分类</Option>
           {
             categories.map(item => { return (
               <Option key={item._id} value={item._id}>{item.name}</Option>
             )})
           }
         </Select>
       </Item>
      <Item
        name="input"
        rules={[
          {
            required: true,
            message: '分类名称必须输入'
          }
        ]}
      >
        <Input placeholder='请输入分类名称'/>
      </Item>
     </Form>
    );
  }
}
