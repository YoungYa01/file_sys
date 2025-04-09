import {ProForm, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {Button, Flex} from 'antd';
import {ReactNode} from 'react';

type SearchFormProps = {
  onFinish: (values: any) => (values) => void,
  buttons?: ReactNode
}

const SearchForm = (props: SearchFormProps) => {
  const {onFinish, buttons} = props;
  const [form] = ProForm.useForm();
  /**
   * 重置表单
   */
  const handleReset = () => {
    form.resetFields();
    onFinish({});
  }
  /**
   * 查询表单
   */
  const handleSubmit = () => {
    form.submit();
  }
  return (
    <ProForm
      layout={'inline'}
      form={form}
      onFinish={(value) => onFinish(value)}
      onReset={() => onFinish({})}
      submitter={false}
    >
      <Flex justify={'space-between'} style={{width: '100%'}} wrap>
        <Flex justify={'start'} wrap>
          <ProFormText
            name="title"
            label="任务名"
          />
          <ProFormSelect
            name="file_type"
            label="文件类型"
            style={{width: 150, textAlign: 'left'}}
            valueEnum={{
              all: '任意类型',
              image: '图片文件',
              word: 'Word 文档',
              excel: 'Excel 表格',
              pdf: 'PDF 文档',
              ppt: 'PPT 幻灯片',
              zip: 'ZIP 压缩包',
            }}
          />
        </Flex>
        <div >
          <Button ket={'reset'} onClick={handleReset}>重置</Button>,
          <Button ket={'search'} type={'primary'} htmlType={'submit'}>查询</Button>,
          {buttons}
        </div>
      </Flex>
    </ProForm>
  )
}

export default SearchForm;
