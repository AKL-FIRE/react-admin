import React, {Component} from 'react';
import {Upload, Modal, message} from "antd";
import PropTypes from 'prop-types'
import {reqDeleteImg} from "../../api";

import {PlusOutlined} from '@ant-design/icons'
import {BASE_IMG_URL} from "../../utils/constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// 用于图片上传的组件

export default class PicturesWall extends Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  // state = {
  //   previewVisible: false, // modal里面大图是否显示
  //   previewImage: '', // modal里面大图的url
  //   previewTitle: '',
  //   fileList: [],
  // };

  constructor(props) {
    super(props)

    let fileList = []

    // 如果传入了imgs属性
    const {imgs} = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, // modal里面大图是否显示
      previewImage: '', // modal里面大图的url
      fileList
    }
  }

  // 隐藏modal
  handleCancel = () => this.setState({ previewVisible: false });

  // 显示指定file的大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  // file: 当前操作的图片文件（上传/删除)
  // filelist: 所有已上传图片文件对象的数组
  handleChange = async ({ file, fileList }) => {

    // 一旦上传成功，将当前上传的file的信息修正（name, url）
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('上传图片成功')
        const {name, url} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传失败')
      }
    } else if (file.status === 'removed') {
      // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }

    // 在操作上（上传/删除）过程中更新filelist状态
    this.setState({fileList})
  }

  // 获取所有已上传图片文件名的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload" /* 文件上传接口地址 */
          accept="image/*" /* 只接受图片格式文件 */
          name="image" /* 请求参数名 */
          listType="picture-card" /* 卡片样式 */
          fileList={fileList} /* 所有已上传文件的列表 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}