import { useState } from "react";
import ReCaptchaV2 from "react-google-recaptcha";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { addNewUser } from "./api/authAPIs";
import Cookies from "js-cookie";

export default function Register() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  if (Cookies.get("authToken")) return (window.location.href = "/");

  // This will be triggered after submitting the register button
  const onFinish = async (values) => {
    setIsLoaded(true);
    // Adding the token to the values object
    values["token"] = localStorage.getItem("recaptchaToken");
    // Sending a request to express Server
    await addNewUser(values, async (data, error) => {
      if (error) {
        if (Array.isArray(error)) {
          error.map((err) => message.error(err));
        } else message.error(error);
      }
      if (data) router.push("/login");
      setIsLoaded(false);
    });
  };

  // Set a token to our form
  const handleToken = (token) => {
    localStorage.setItem("recaptchaToken", token);
  };

  return (
    <div className="wrapper">
      <div className="registerContainer">
        <div className="right-side">
          <Form
            className="register"
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <h2>Register here</h2>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Enter your username!" }]}
            >
              <Input placeholder="John Doe" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Enter your email!" }]}
            >
              <Input
                placeholder="john.doe@gmail.com"
                prefix={<MailOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Enter your password!" }]}
            >
              <Input.Password placeholder="******" prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              name="passwordConfirm"
              rules={[{ required: true, message: "Confirm the password!" }]}
            >
              <Input.Password placeholder="******" prefix={<LockOutlined />} />
            </Form.Item>

            <div style={{ margin: "0.5rem" }}>
              <ReCaptchaV2
                sitekey="6LeVUb4UAAAAAAaisqZUFqcWwEp9gyfiJxru3cYj"
                onChange={handleToken}
              />
            </div>

            <div className="already">
              <h4>
                Already have account,{" "}
                <Link href="/login">
                  <a>Login</a>
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
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
