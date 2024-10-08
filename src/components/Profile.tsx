import { Form, Input, Typography } from 'antd';
import useStore from 'hooks/useStore';
import React, { useEffect } from 'react';

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const { email, password } = useStore();

  useEffect(() => {
    form.setFieldsValue({ email, password });
  }, []);

  return (
    <Form
      form={form}
      style={{ margin: '8px 0', backgroundColor: '#fff', padding: '8px 16px' }}
    >
      <Typography.Title level={3}>Profile</Typography.Title>
      <Form.Item name='email' label='Email'>
        <Input />
      </Form.Item>
      <Form.Item name='password' label='Mật khẩu'>
        <Input.Password />
      </Form.Item>
    </Form>
  );
};

export default Profile;
