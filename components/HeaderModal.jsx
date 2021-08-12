import { Button, message, Modal } from "antd";
import Image from "next/image";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";
import useSWR from "swr";
import { updateUserProfile } from "../pages/api/homeAPI";

export default function HeaderModal({
  visible,
  modalType,
  userData,
  closeModal,
  username,
}) {
  const BASE_URL = "https://barani-iq-backend.herokuapp.com";
  const { data } = useSWR(`${BASE_URL}/api/posts`);

  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        folder: "avatars",
      },
      (error, result) => {
        if (result.event === "success") {
          setAvatar(result.info.secure_url);
        }
      }
    );
    widget.open(); // open up the widget after creation
  };

  const updateProfileData = async () => {
    if (avatar == "" && formData != {}) {
      await updateUserProfile(formData, async (data, error) => {
        if (error) {
          if (Array.isArray(error)) {
            error.map((err) => message.error(err));
          } else message.error(error);
        }
        if (data) {
          message.success("Profile Updated");
          closeModal();
        }
      });
    } else {
      formData["avatar"] = avatar;
      await updateUserProfile(formData, async (data, error) => {
        if (error) {
          if (Array.isArray(error)) {
            error.map((err) => message.error(err));
          } else message.error(error);
        }
        if (data) {
          message.success("Profile Updated");
          closeModal();
        }
      });
    }
  };

  return (
    <Modal
      className="header-modal"
      visible={visible}
      closable={false}
      footer={null}
      animation={false}
      bodyStyle={{ overflowY: "scroll" }}
    >
      {modalType === "profile" ? (
        <>
          <div className="spanDiv">
            <span onClick={() => closeModal()}>X</span>
          </div>
          <div className="userDiv">
            <Image
              src={avatar === "" ? userData.avatar : avatar}
              preview="false"
              responsive="true"
              width="70"
              height="70"
              alt="user-avatar"
            />

            <Button
              className="uploadBtn"
              icon={<UploadOutlined />}
              onClick={openWidget}
            ></Button>
            <h3>{username}</h3>
          </div>
          <div className="formDiv">
            <form className="profile" name="profile">
              <div className="inputDiv">
                <div className="label">Email:</div>

                <input
                  name="email"
                  type="email"
                  defaultValue={
                    !formData.email ? userData.email : formData.email
                  }
                  onChange={handleInputChange}
                  style={{ outline: "none" }}
                />
              </div>
              <div className="textareaDiv">
                <div className="label">Bio:</div>

                <textarea
                  name="bio"
                  defaultValue={userData.bio}
                  onChange={handleInputChange}
                  style={{ outline: "none" }}
                />
              </div>
              <div className="inputDiv">
                <div className="label"> WSite</div>

                <input
                  type="text"
                  name="website"
                  defaultValue={userData.website}
                  onChange={handleInputChange}
                  style={{ outline: "none" }}
                />
              </div>

              <div className="btnDiv">
                <Button
                  onClick={updateProfileData}
                  type="primary"
                  style={{ marginRight: "10px" }}
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <span style={{ cursor: "pointer" }} onClick={() => closeModal()}>
              X
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            {data?.post && data.post.length !== 0
              ? data?.post
                  .filter((p) => p.authorName === username)
                  .map((post) => (
                    <div style={{ display: "flex" }} key={post._id}>
                      <div style={{ marginRight: "10px" }}>
                        {post.post_img !== "" ? (
                          <Image
                            src={post.post_img}
                            responsive="true"
                            preview="false"
                            objectFit="cover"
                            width="140"
                            height="140"
                            alt="post_image"
                          />
                        ) : null}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItem: "center",
                        }}
                      >
                        <p>{post.post_description}</p>
                        <p style={{ marginTop: "-10px", color: "#999" }}>
                          {moment(post.posted_on).format("LL")}
                        </p>
                      </div>
                    </div>
                  ))
              : "No Posts :("}
          </div>
        </>
      )}
    </Modal>
  );
}
