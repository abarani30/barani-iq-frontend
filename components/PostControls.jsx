import { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Script from "next/script";
import { addNewPost } from "../pages/api/homeAPI";
import Image from "next/image";
import useSWR, { mutate, trigger } from "swr";

const PostControls = () => {
  const BASE_URL = "https://barani-iq-backend.herokuapp.com";

  const { data } = useSWR(`${BASE_URL}/api/posts`);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postImg, setPostImg] = useState("");
  const [form] = Form.useForm();

  const openWidget = () => {
    // create the widget
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "alibarani",
        uploadPreset: "thytbcm3",
        sources: ["local"],
        multiple: false,
        secure: true,
        resourceType: "image",
        clientAllowedFormats: ["png", "jpg", "gif"],
        folder: "media",
      },
      (error, result) => {
        if (result.event === "success") {
          setPostImg(result.info.secure_url);
        }
      }
    );
    widget.open(); // open up the widget after creation
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    values["post_img"] = postImg;
    await mutate(`${BASE_URL}/api/posts`, [...data?.post, values], true);
    addNewPost(values, async (data, error) => {
      if (data) {
        message.success("New post is added!");
        setPostImg("");
        setIsModalVisible(false);
        form.resetFields();
      }
      await trigger(`${BASE_URL}/api/posts`);
    });
  };

  return (
    <div className="post-controls">
      <div className="container">
        <div className="post-div" onClick={showModal}>
          <div className="happy-emoji">
            <Image
              src="/happy.svg"
              preview="false"
              responsive="true"
              width="28"
              height="28"
              alt="happy-emoji"
            />
          </div>
          <label>Post Now..</label>
        </div>
      </div>
      <Modal
        title="Add your video"
        visible={isModalVisible}
        closable={false}
        footer={null}
        animation={false}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="post_description">
            <Input.TextArea
              style={{ marginBottom: "-15px", resize: "none" }}
              placeholder="Share your magic with us.."
            />
          </Form.Item>
          {!postImg ? (
            <Button
              style={{ marginBottom: "25px" }}
              icon={<UploadOutlined />}
              onClick={openWidget}
            >
              Upload
            </Button>
          ) : null}

          {postImg ? (
            <div
              style={{
                width: "100%",
                padding: "5px",
                border: "1.5px solid #ccc",
              }}
            >
              <Image
                src={postImg}
                responsive="true"
                preview="false"
                width="100"
                height="100"
                alt="post-thumbnail"
              />
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button style={{ marginRight: "10px" }} onClick={onClose}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              Post
            </Button>
          </div>
        </Form>
      </Modal>
      <Script src="https://widget.Cloudinary.com/v2.0/global/all.js" />
    </div>
  );
};

export default PostControls;
