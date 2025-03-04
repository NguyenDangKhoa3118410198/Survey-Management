import { RedoOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  PopconfirmProps,
  Tree,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import QuestionFormItem from './QuestionFormItem';
import { requiredLabel } from 'utils';
import { useWatch } from 'antd/es/form/Form';

interface ISurveyFormInfoProps {
  form?: any;
  surveyDetail?: any;
  setOriginalQuestions?: any;
  setTreeData?: any;
  treeData?: any;
}

const SurveyFormInfo: React.FC<ISurveyFormInfoProps> = ({
  form,
  surveyDetail,
  setOriginalQuestions,
  setTreeData,
  treeData,
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (surveyDetail) {
      const questions = surveyDetail.questions.map((q: any, index: any) => ({
        ...q,
        title: q.question || 'Untitled',
        key: `${index}`,
      }));
      setTreeData(questions);
      setOriginalQuestions(questions);
    }
  }, [surveyDetail]);

  useEffect(() => {
    const questions = form.getFieldValue('questions') || [];
    if (questions.length > 0 && treeData.length === 0) {
      const initializedTreeData = questions.map((q: any, idx: any) => ({
        ...q,
        title: q.question || 'Untitled',
        key: `${idx}`,
      }));
      setTreeData(initializedTreeData);
    }
  }, [form.getFieldValue('questions')]);

  const onDrop = (info: any) => {
    const dragKey = info.dragNode.key;
    const dropKey = info.node.key;

    const data = surveyDetail
      ? [...treeData]
      : form.getFieldValue('questions').map((q: any, idx: any) => ({
          ...q,
          title: q.question || 'Untitled',
          key: `${idx}`,
        }));

    const dragIndex = data.findIndex((item: any) => item.key === dragKey);
    const dropIndex = data.findIndex((item: any) => item.key === dropKey);

    const [draggedItem] = data.splice(dragIndex, 1);
    data.splice(dropIndex, 0, draggedItem);

    setTreeData(data);
    form.setFieldsValue({
      questions: data,
    });
  };

  useEffect(() => {
    if (surveyDetail) {
      const {
        startDate,
        endDate,
        questions,
        originalStartDate,
        originalEndDate,
        ...restUserDetail
      } = surveyDetail;

      form.setFieldsValue({
        ...restUserDetail,

        startDate: dayjs(originalStartDate),
        endDate: originalEndDate ? dayjs(originalEndDate) : null,
        questions: questions?.map((question: any) => ({
          ...question,
          description: question.description || '',
          extraOptions: question.extraOptions || [
            { option: '' },
            { option: '' },
          ],
        })),
      });
    }
  }, [surveyDetail, form]);

  const onStartChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const disabledEndDate = (current: Dayjs | null) => {
    return current && startDate && current.isBefore(startDate, 'day');
  };

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    form.resetFields(['questions', 'totalContent']);
  };

  const validateEndDate = (value: any) => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');

    if (!value || !endDate) {
      return Promise.resolve();
    }
    if (dayjs(endDate).isBefore(startDate, 'day')) {
      return Promise.reject(
        new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
      );
    }
    return Promise.resolve();
  };

  const handleAddQuestion = (
    add: any,
    fieldName?: any,
    after?: any,
    isCopying: boolean = false
  ) => {
    const newQuestion = isCopying
      ? form.getFieldValue(['questions', fieldName])
      : {};
    add({ ...newQuestion }, Number(fieldName) + after);
    form.setFieldValue(
      'totalContent',
      Number((form.getFieldValue('totalContent') || 0) + 1)
    );
    const newQuestions = form.getFieldValue('questions');
    const newTreeData = newQuestions.map((q: any, idx: number) => ({
      ...q,
      title: q.question || 'Untitled',
      key: `${idx}`,
    }));
    setTreeData(newTreeData);
  };

  const handleDeleteQuestion = (remove: any, name: any) => {
    remove(name);
    form.setFieldValue(
      'totalContent',
      Number((form.getFieldValue('totalContent') || 0) - 1)
    );
    const newQuestions = form.getFieldValue('questions');
    const newTreeData = newQuestions.map((q: any, idx: any) => ({
      ...q,
      title: q.question || 'Untitled',
      key: `${idx}`,
    }));
    setTreeData(newTreeData);
  };

  return (
    <Flex vertical gap={20}>
      <Card title='Thông tin chung'>
        <Descriptions column={1} style={{ width: '100%' }} bordered>
          <Descriptions.Item label={requiredLabel('Tên khảo sát')}>
            <Form.Item
              style={{ width: '100%' }}
              name='surveyName'
              rules={[
                { required: true, message: 'Vui lòng nhập tên khảo sát' },
              ]}
              colon={false}
            >
              <Input placeholder='Nhập tên khảo sát' />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label={requiredLabel('Điểm thưởng')}>
            <Form.Item
              style={{ width: '100%' }}
              name='averageScore'
              rules={[{ required: true, message: 'Vui lòng nhập điểm thưởng' }]}
              colon={false}
            >
              <InputNumber
                min={0}
                placeholder='Nhập điểm thưởng'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label={requiredLabel('Ngày bắt đầu')}>
            <Form.Item
              name='startDate'
              rules={[
                { required: true, message: 'Vui lòng nhập ngày bắt đầu' },
              ]}
              colon={false}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format='DD/MM/YYYY - HH:mm'
                onChange={onStartChange}
                disabledDate={(current) =>
                  current && current.isBefore(dayjs().startOf('day'))
                }
                placeholder='Ngày bắt đầu'
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label='Ngày kết thúc'>
            <Form.Item
              name='endDate'
              rules={[{ validator: validateEndDate }]}
              colon={false}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format='DD/MM/YYYY - HH:mm'
                disabledDate={(current) => {
                  if (!current) {
                    return false;
                  }
                  return (
                    (current.isBefore(dayjs().startOf('day')) ||
                      disabledEndDate(current)) ??
                    false
                  );
                }}
                placeholder='Ngày kết thúc'
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label='Tổng nội dung khảo sát'>
            <Form.Item
              name='totalContent'
              colon={false}
              style={{ width: '100%' }}
            >
              <InputNumber
                disabled={true}
                style={{ width: '100%' }}
                defaultValue={0}
              />
            </Form.Item>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title='Nội dung khảo sát'>
        <Flex>
          <div
            style={{
              position: 'fixed',
              left: 160,
            }}
          >
            <Tree
              style={{ border: '1px solid #eee', borderRadius: '5px' }}
              treeData={treeData}
              draggable
              blockNode
              onDrop={onDrop}
              titleRender={(nodeData: any) => (
                <div>
                  <span>{nodeData?.title}</span> -{' '}
                  <span>{nodeData?.questionType}</span>
                </div>
              )}
            />
          </div>

          <Flex vertical style={{ width: '100%' }}>
            <Form.List name='questions'>
              {(fields, { add, remove }) => (
                <>
                  <Popconfirm
                    title='Xóa tất cả khảo sát'
                    description='Bạn có chắc chắn muốn xóa tất cả khảo sát?'
                    onConfirm={confirm}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button
                      icon={<RedoOutlined />}
                      style={{
                        position: 'absolute',
                        right: '160px',
                        top: '10px',
                        border: '1px solid var(--main-color)',
                      }}
                    >
                      Xóa tất cả
                    </Button>
                  </Popconfirm>

                  <Button
                    onClick={() => handleAddQuestion(add, 0, 0, false)}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '10px',
                      backgroundColor: 'var(--main-color)',
                      color: '#fff',
                    }}
                  >
                    + Thêm câu hỏi
                  </Button>
                  {fields.map(({ key, name, ...restField }) => {
                    const questionType = form.getFieldValue([
                      'questions',
                      name,
                      'questionType',
                    ]);
                    return (
                      <div key={key}>
                        <QuestionFormItem
                          key={key}
                          fieldName={name}
                          restField={restField}
                          remove={() => handleDeleteQuestion(remove, name)}
                          qtyField={fields.length}
                          questionType={questionType}
                          add={add}
                          handleAdd={handleAddQuestion}
                          form={form}
                        />
                      </div>
                    );
                  })}
                </>
              )}
            </Form.List>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default SurveyFormInfo;
