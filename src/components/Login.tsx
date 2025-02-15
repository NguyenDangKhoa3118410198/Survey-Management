import { Button, Checkbox, Flex, Form, Input, Typography } from 'antd';
import useStore from '../hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const { setUser, email, password, isRemembered } = useStore();
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();

  const onSubmit = (values: LoginFormValues): void => {
    const { email, password } = values;
    const date = Date.now();
    const combied = `${email}+${password}+${date}`;
    const isRemembered = values.remember ?? false;

    const token = btoa(combied);
    setUser(email, password, token, isRemembered);
    navigate('/users');
  };

  const { token } = useStore();

  useEffect(() => {
    if (token) {
      navigate('/users');
    }
  }, [navigate]);

  useEffect(() => {
    if (email && password && isRemembered) {
      form.setFieldsValue({
        email,
        password,
        remember: isRemembered,
      });
    }
  }, []);

  const handlePressEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.submit();
    }
  };

  return (
    <Flex
      justify='center'
      align='center'
      style={{ height: '100%', position: 'relative' }}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        onKeyDown={handlePressEnter}
        autoComplete='off'
        style={{
          margin: 'auto',
          border: '2px solid var(--main-color)',
          padding: 24,
          display: 'flex',
          height: '500px',
          borderRadius: '14px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
          alignItems: 'center',
        }}
      >
        <img
          src='/imgs/survey.jpg'
          alt='error image'
          style={{ width: '350px', marginRight: '50px' }}
        />
        <Flex vertical style={{ width: '380px' }}>
          <Typography.Title
            level={4}
            style={{
              fontWeight: 700,
              color: 'var(--main-color)',
              marginBottom: '30px',
            }}
            data-testid='title-login'
          >
            <p
              style={{
              fontSize: 30,
                textAlign: 'left',
                fontWeight: 700,
                color: 'var(--main-color)',
              }}
            >
              The Liems
            </p>
            Admin Panel Management Survey
          </Typography.Title>
          <Form.Item
            name='email'
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email',
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Email không hợp lệ',
              },
            ]}
          >
            <Input
              data-testid='login-page-input-email'
              prefix={<MailOutlined />}
              placeholder='Email'
              style={{
                border: '2px solid var(--main-color)',
                padding: '8px 11px',
                color: 'var(--main-color)',
                borderRadius: '14px',
              }}
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              {
                pattern:
                  /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                message:
                  'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt',
              },
            ]}
            style={{ marginBottom: '5px' }}
          >
            <Input.Password
              data-testid='login-page-input-password'
              prefix={<LockOutlined />}
              placeholder='Vui lòng nhập mật khẩu'
              style={{
                border: '2px solid var(--main-color)',
                padding: '8px 11px',
                color: 'var(--main-color)',
                marginTop: 12,
              }}
            />
          </Form.Item>
          <Form.Item
            data-testid='login-page-remember-password'
            name='remember'
            valuePropName='checked'
            style={{ margin: '10px 0' }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              data-testid='login-page-btn-login'
              type='primary'
              htmlType='submit'
              style={{
                width: '100%',
                backgroundColor: 'var(--main-color)',
                height: '49px',
                color: 'white',
                fontWeight: 700,
                marginTop: '10px',
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Flex>
      </Form>
      <p
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          padding: 12,
        }}
      >
        version 1.0
      </p>
    </Flex>
  );
};

export default Login;
