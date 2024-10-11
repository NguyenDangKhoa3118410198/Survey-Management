import { Button, Form, Input, Modal, Typography } from 'antd';
import useStore from 'hooks/useStore';
import React, { useEffect, useState } from 'react';
import { customizeRequiredMark } from 'utils';

interface IProfile {
  email: string;
  password: string;
  verifyPassword?: string;
}

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const { email, password, changePassword } = useStore();
  const [isNewPassword, setIsNewPassword] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue({ email, password, verifyPassword: password });
  }, []);

  const handleChangePassword = () => {
    setIsNewPassword(true);
  };

  const submitForm = (values: IProfile) => {
    changePassword(values.password);
  };

  const showConfirm = (values: IProfile) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin này?',
      onOk: () => submitForm(values),
      onCancel() {
        return;
      },
    });
  };

  const handleSubmit = (values: IProfile) => {
    showConfirm(values);
  };

  return (
    <Form
      form={form}
      style={{ margin: '8px 0', backgroundColor: '#fff', padding: '8px 16px' }}
      requiredMark={customizeRequiredMark}
      onFinish={handleSubmit}
    >
      <Typography.Title level={3}>Profile</Typography.Title>
      <Form.Item name='email' label='Email' colon={false}>
        <Input />
      </Form.Item>
      <Form.Item
        label='Mật khẩu'
        name='password'
        colon={false}
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
            message:
              'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt',
          },
        ]}
      >
        <Input.Password placeholder='Nhập mật khẩu' disabled={!isNewPassword} />
      </Form.Item>
      {isNewPassword && (
        <Form.Item
          label='Xác thực mật khẩu'
          name='verifyPassword'
          colon={false}
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác thực mật khẩu' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
              message:
                'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder='Vui lòng xác thực mật khẩu'
            disabled={!isNewPassword}
          />
        </Form.Item>
      )}

      <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          htmlType='button'
          onClick={handleChangePassword}
          style={{ marginRight: '10px' }}
        >
          Change Password
        </Button>
        <Button htmlType='submit' type='primary'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Profile;
