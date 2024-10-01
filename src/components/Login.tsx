import { Button, Flex, Form, Input, Typography } from "antd";
import useStore from "../hooks/useStore";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { setUser } = useStore();
  const onSubmit = (values: LoginFormValues) => {
    const { email, password } = values;
    const date = Date.now();
    const combied = `${email}+${password}+${date}`;

    const token = btoa(combied);
    setUser(email, token);
  };

  return (
    <Flex justify='center' align='center' style={{ height: "100%" }}>
      <Form
        onFinish={onSubmit}
        autoComplete='off'
        style={{ width: "350px", margin: "auto" }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: "center",
            fontWeight: 700,
            color: "var(--main-color)",
          }}
        >
          Admin Panel
        </Typography.Title>
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email",
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input
            placeholder='Email'
            style={{
              width: "100%",
              border: "3px solid var(--main-color)",
              padding: "8px 11px",
              borderRadius: "14px",
              color: "var(--main-color)",
              fontSize: "16px",
            }}
          />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
              message:
                "Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt",
            },
          ]}
        >
          <Input.Password
            placeholder='Vui lòng nhập mật khẩu'
            style={{
              width: "100%",
              border: "3px solid var(--main-color)",
              padding: "8px 11px",
              borderRadius: "14px",
              color: "var(--main-color)",
              fontSize: "16px",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              width: "100%",
              backgroundColor: "var(--main-color)",
              height: "49px",
              borderRadius: "14px",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}
