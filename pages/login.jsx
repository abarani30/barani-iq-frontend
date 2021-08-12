import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { userLogin } from "../pages/api/authAPIs";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Login() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  if (Cookies.get("authToken")) return (window.location.href = "/");

  // This will be triggered after submitting the login button
  const onFinish = async (values) => {
    setIsLoaded(true);
    // Sending a request to express Server
    await userLogin(values, async (data, error) => {
      if (error) {
        if (Array.isArray(error)) {
          error.map((err) => message.error(err));
        } else message.error(error);
      }

      if (data) {
        const { token } = data;
        Cookies.set("authToken", token, { secure: true, expires: 3 });
        router.push("/");
      }
      setIsLoaded(false);
    });
  };

  return (
    <div className="wrapper">
      <div className="registerContainer">
        <div className="right-side-login">
          <Form
            className="register"
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <h2>Login here</h2>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Enter your username!" }]}
            >
              <Input placeholder="John Doe" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Enter your password!" }]}
            >
              <Input.Password placeholder="******" prefix={<LockOutlined />} />
            </Form.Item>
            <div className="already">
              <h4>
                Don&apos;t have account,
                <Link href="/register">
                  <a style={{ marginLeft: "5px" }}>Register</a>
                </Link>
              </h4>
            </div>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoaded}
                disabled={isLoaded}
              >
                Login
              </Button>
              <Link href="/forgot-password">
                <a className="login-form-forgot">Forgot Password</a>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
