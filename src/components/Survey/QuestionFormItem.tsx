import { CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Select, Switch, Typography } from 'antd';
import { useState } from 'react';

interface IQuestionFormItemProps {
  fieldName: number;
  restField: any;
  remove: (name: number) => void;
  qtyField?: number;
}

const QuestionFormItem: React.FC<IQuestionFormItemProps> = ({
  fieldName,
  restField,
  remove,
  qtyField,
}) => {
  const [showExtraInput, setShowExtraInput] = useState(false);

  const handleQuestionTypeChange = (value: string) => {
    if (value === 'multiple' || value === 'single') {
      setShowExtraInput(true);
    } else {
      setShowExtraInput(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
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
          onChange={handleQuestionTypeChange}
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
        <Switch />
      </Form.Item>

      {showExtraInput && (
        <>
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
                      <Form.Item
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
                        <Flex>
                          <Input
                            placeholder={`Nhập phương án ${name + 1}`}
                            style={{
                              width: 'calc(100% - 32px)',
                              marginRight: '8px',
                            }}
                          />
                          {fields?.length > 2 && (
                            <Button
                              type='link'
                              onClick={() => remove(name)}
                              style={{ color: 'red' }}
                            >
                              <CloseOutlined style={{ color: 'red' }} />
                            </Button>
                          )}
                        </Flex>
                      </Form.Item>
                    ))}

                    <Button
                      type='dashed'
                      onClick={() => add()}
                      style={{ width: '100%', marginBottom: '8px' }}
                    >
                      Thêm phương án
                    </Button>
                  </>
                )}
              </Form.List>
            </Flex>
          </Flex>
        </>
      )}

      <Button
        type='link'
        onClick={() => remove(fieldName)}
        style={{ color: 'red', border: '1px solid red', borderRadius: '14px' }}
      >
        Xoá câu hỏi {Number(qtyField) - fieldName}
      </Button>
    </div>
  );
};

export default QuestionFormItem;
