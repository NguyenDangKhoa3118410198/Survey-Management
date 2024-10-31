import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Dropdown,
  Flex,
  Form,
  Input,
  Select,
  Switch,
  Typography,
} from 'antd';
import TextEditor from 'components/common/MyCKEditor';
import { useEffect, useState } from 'react';
import { requiredLabel } from 'utils';

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
      ['questions', fieldName, 'description'],
    ]);
  };

  const items = [
    {
      key: 'addQuestion',
      label: (
        <div
          onClick={() => {
            add({}, fieldName + 1);
            form.setFieldValue(
              'totalContent',
              form.getFieldValue('totalContent') + 1
            );
          }}
        >
          <Flex gap={10}>
            <PlusCircleOutlined />
            Thêm câu hỏi
          </Flex>
        </div>
      ),
    },
    {
      key: 'duplicateQuestion',
      label: (
        <div
          onClick={() => {
            const newQuestion = form.getFieldValue(['questions', fieldName]);
            add({ ...newQuestion }, fieldName + 1);
          }}
          style={{ marginLeft: 8 }}
        >
          <Flex gap={10}>
            <CopyOutlined />
            Sao chép
          </Flex>
        </div>
      ),
    },
    {
      key: 'deleteQuestion',
      label: (
        <div
          onClick={() => {
            remove(fieldName);
            form.setFieldValue(
              'totalContent',
              form.getFieldValue('totalContent') - 1
            );
          }}
        >
          <Flex gap={10}>
            <DeleteOutlined />
            Xoá câu hỏi
          </Flex>
        </div>
      ),
    },
  ];

  return (
    <Flex gap={8}>
      <Descriptions
        column={1}
        style={{ width: '100%', margin: '20px 10px' }}
        bordered
      >
        <Descriptions.Item label={requiredLabel('Loại câu hỏi')}>
          <Form.Item
            {...restField}
            name={[fieldName, 'questionType']}
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
        </Descriptions.Item>
        <Descriptions.Item
          label={requiredLabel(`Câu hỏi ${Number(qtyField) - fieldName}`)}
        >
          <Form.Item
            {...restField}
            name={[fieldName, 'question']}
            colon={false}
            rules={[{ required: true, message: 'Vui lòng nhập tên câu hỏi' }]}
          >
            <Input placeholder='Nhập tên câu hỏi' />
          </Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label='Mô tả'>
          <Form.Item
            {...restField}
            name={[fieldName, 'description']}
            colon={false}
            rules={[
              {
                required: false,
                message: 'Vui lòng nhập mô tả (không bắt buộc)',
              },
            ]}
          >
            <TextEditor
              value={form.getFieldValue('description') || ''}
              onChange={(data) => form.setFieldsValue({ description: data })}
              placeholder='Nhập mô tả (không bắt buộc)'
            />
          </Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label='Bắt buộc'>
          <Form.Item
            {...restField}
            name={[fieldName, 'isRequired']}
            valuePropName='checked'
            colon={false}
            initialValue={false}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
        </Descriptions.Item>

        {(showExtraInputByType === 'multiple' ||
          showExtraInputByType === 'single') && (
          <Descriptions.Item label={requiredLabel('Phương án')}>
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
          </Descriptions.Item>
        )}
      </Descriptions>
      <Flex
        justify='flex-end'
        style={{ marginTop: 'auto', marginBottom: '24px' }}
      >
        <Dropdown menu={{ items }} placement='bottomRight'>
          <Button
            icon={<EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />}
          />
        </Dropdown>
      </Flex>
    </Flex>
  );
};

export default QuestionFormItem;
