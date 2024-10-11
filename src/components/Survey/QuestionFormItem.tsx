import {
  CheckOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Flex,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

interface IQuestionFormItemProps {
  fieldName: number;
  restField: any;
  remove: (name: number) => void;
  qtyField?: number;
  questionType?: string;
  add: any;
  form: any;
}

const QuestionFormItem: React.FC<IQuestionFormItemProps> = ({
  fieldName,
  restField,
  remove,
  qtyField,
  questionType,
  add,
  form,
}) => {
  const [showExtraInputByType, setShowExtraInputByType] = useState('text');

  useEffect(() => {
    if (questionType) {
      setShowExtraInputByType(questionType);
    }
  }, [questionType]);

  const handleGetExtraInput = (value: string) => {
    setShowExtraInputByType(value);

    if (value === 'single' || value === 'multiple') {
      form.setFieldsValue({
        ['questions']: {
          [fieldName]: {
            extraOptions: [{ option: '' }, { option: '' }],
          },
        },
      });
    }

    form.resetFields([
      ['questions', fieldName, 'question'],
      ['questions', fieldName, 'isRequired'],
      ['questions', fieldName, 'ratingOption'],
    ]);
  };

  return (
    <div
      style={{
        border: '1px double lightgray',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '35px',
      }}
    >
      <Form.Item
        {...restField}
        name={[fieldName, 'questionType']}
        label='Loại câu hỏi'
        colon={false}
        rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
      >
        <Select
          placeholder='Chọn loại câu hỏi'
          style={{ width: '100%' }}
          onChange={handleGetExtraInput}
        >
          <Select.Option value='rating'>Rating</Select.Option>
          <Select.Option value='text'>Văn bản</Select.Option>
          <Select.Option value='single'>Đơn lựa chọn</Select.Option>
          <Select.Option value='multiple'>Nhiều lựa chọn</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        {...restField}
        name={[fieldName, 'question']}
        label={`Câu hỏi ${Number(qtyField) - fieldName}`}
        colon={false}
        rules={[{ required: true, message: 'Vui lòng nhập tên câu hỏi' }]}
      >
        <Input placeholder='Nhập tên câu hỏi' />
      </Form.Item>

      <Form.Item
        {...restField}
        name={[fieldName, 'isRequired']}
        label='Bắt buộc'
        valuePropName='checked'
        colon={false}
      >
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>

      {showExtraInputByType === 'rating' && (
        <Form.Item
          label='Đánh giá'
          colon={false}
          name={[fieldName, 'ratingOption']}
        >
          <Radio.Group defaultValue={1}>
            <Radio value={1}>1 Sao</Radio>
            <Radio value={2}>2 Sao</Radio>
            <Radio value={3}>3 Sao</Radio>
            <Radio value={4}>4 Sao</Radio>
            <Radio value={5}>5 Sao</Radio>
          </Radio.Group>
        </Form.Item>
      )}

      {(showExtraInputByType === 'multiple' ||
        showExtraInputByType === 'single') && (
        <Flex>
          <Typography.Text style={{ width: '190px', textAlign: 'left' }}>
            Phương án
            <span style={{ color: 'red' }}> *</span>
          </Typography.Text>
          <Flex vertical style={{ width: '100%' }}>
            <Form.List
              name={[fieldName, 'extraOptions']}
              initialValue={[{ option: '' }, { option: '' }]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Form.Item
                        style={{ width: '100%' }}
                        {...restField}
                        key={key}
                        name={[name, 'option']}
                        colon={false}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập phương án',
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Nhập phương án ${name + 1}`}
                          style={{
                            marginRight: '8px',
                          }}
                        />
                      </Form.Item>
                      {fields.length > 2 && (
                        <Form.Item>
                          <Button
                            type='link'
                            onClick={() => remove(name)}
                            style={{ color: 'red' }}
                          >
                            <CloseOutlined style={{ color: 'red' }} />
                          </Button>
                        </Form.Item>
                      )}
                    </div>
                  ))}
                  <Button
                    type='dashed'
                    onClick={() => {
                      add();
                    }}
                    style={{ width: '100%', marginBottom: '8px' }}
                  >
                    Thêm phương án
                  </Button>
                </>
              )}
            </Form.List>
          </Flex>
        </Flex>
      )}

      <Button
        type='link'
        onClick={() => {
          remove(fieldName);
          form.setFieldValue(
            'totalContent',
            form.getFieldValue('totalContent') - 1
          );
        }}
        style={{
          color: 'red',
          border: '1px solid red',
          borderRadius: '14px',
        }}
      >
        Xoá câu hỏi {Number(qtyField) - fieldName}
      </Button>
      <Button
        type='link'
        onClick={() => {
          add({}, fieldName + 1);
          form.setFieldValue(
            'totalContent',
            form.getFieldValue('totalContent') + 1
          );
        }}
        icon={<PlusCircleOutlined />}
        style={{ color: 'green' }}
      >
        Thêm câu hỏi
      </Button>
    </div>
  );
};

export default QuestionFormItem;
