import { Button, Checkbox, Flex, Form, Input, Typography } from 'antd';
import useStore from '../hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
    <Flex justify='center' align='center' style={{ height: '100%' }}>
      <Form
        form={form}
        onFinish={onSubmit}
        onKeyDown={handlePressEnter}
        autoComplete='off'
        style={{ width: '350px', margin: 'auto' }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
            fontWeight: 700,
            color: 'var(--main-color)',
            marginBottom: '30px',
          }}
        >
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
            placeholder='Email'
            style={{
              border: '3px solid var(--main-color)',
              padding: '8px 11px',
              color: 'var(--main-color)',
            }}
          />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
              message:
                'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt',
            },
          ]}
          style={{ marginBottom: '5px' }}
        >
          <Input.Password
            placeholder='Vui lòng nhập mật khẩu'
            style={{
              border: '3px solid var(--main-color)',
              padding: '8px 11px',
              color: 'var(--main-color)',
            }}
          />
        </Form.Item>
        <Form.Item
          name='remember'
          valuePropName='checked'
          style={{ margin: '10px 0' }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
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
      </Form>
    </Flex>
  );
};

export default Login;
