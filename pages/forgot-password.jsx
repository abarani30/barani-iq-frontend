import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { updateUserPassword } from "./api/authAPIs";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function ForgotPassword() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  if (Cookies.get("authToken")) return (window.location.href = "/");

  const sendEmail = async (email) => {
    setIsLoaded(true);
    // Sending a request to express Server
    await updateUserPassword(email, async (data, error) => {
      if (error) {
        if (Array.isArray(error)) {
          error.map((err) => message.error(err));
        } else message.error(error);
      }
      if (data) {
        router.push("/login");
        message.success(data);
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
            onFinish={sendEmail}
          >
            <h2>Forgot Password</h2>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Enter your email!" }]}
            >
              <Input
                placeholder="john.doe@gmail.com"
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoaded}
                disabled={isLoaded}
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
