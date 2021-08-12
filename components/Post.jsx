import { useState } from "react";
import { Button, Card, Spin, Popover, message, Modal } from "antd";
import {
  BsBookmark,
  BsBookmarkFill,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { useStore } from "../store";
import {
  AddorRemoveLike,
  AddorRemoveSave,
  deletePost,
} from "../pages/api/homeAPI";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BiHide } from "react-icons/bi";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import useSWR, { mutate, trigger } from "swr";

const Post = ({ users }) => {
  const BASE_URL = "https://barani-iq-backend.herokuapp.com";
  const { data } = useSWR(`${BASE_URL}/api/posts`);

  const { username } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postID, setPostID] = useState(false);

  const showModal = (postId) => {
    setIsModalVisible(true);
    setPostID(postId);
  };

  const handleOk = () => {
    delPost(postID);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const delPost = async (postId) => {
    await mutate(`${BASE_URL}/api/posts`, [
      ...data?.post.filter((post) => post._id !== postId),
    ]);
    deletePost(postId, async (data, error) => {
      if (data) {
        message.success("Post is deleted!");
        await trigger(`${BASE_URL}/api/posts`);
      }
    });
    setIsModalVisible(false);
  };

  const handleLikes = async (postId) => {
    AddorRemoveLike(postId, async (data, error) => {
      if (data) await trigger(`${BASE_URL}/api/posts`);
    });
  };

  const handleSaves = async (postId) => {
    AddorRemoveSave(postId, async (data, error) => {
      if (data) await trigger(`${BASE_URL}/api/posts`);
    });
  };

  return (
    <Card className="cards">
      <Modal
        title="Barani.iq"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Are you sure you want to delete this post?
      </Modal>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Recent Posts:</h4>
        <h4 style={{ marginRight: "10px" }}>
          No.of Posts: <b>{data?.post && data?.post.length}</b>
        </h4>
      </div>
      {data?.post && data.post.length !== 0 ? (
        data?.post.map((post) => (
          <Card
            key={post._id}
            type="inner"
            title={
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginTop: "-2px",
                }}
              >
                {users.map(
                  (user) =>
                    user.username === post.authorName && (
                      <div key={user.username}>
                        <Image
                          src={user.avatar}
                          preview="false"
                          responsive="true"
                          width="40"
                          height="40"
                          alt="avatar"
                        />
                      </div>
                    )
                )}

                <div
                  style={{
                    marginLeft: "10px",
                    paddingTop: "0px",
                  }}
                >
                  {post.authorName}
                </div>
              </div>
            }
            extra={
              <div>
                <label className="post-date">
                  {moment(post.posted_on).format("LLL")}
                </label>
                {username === post.authorName && !isModalVisible ? (
                  <Popover
                    placement="bottomRight"
                    content={
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <li
                          style={{
                            marginBottom: "9px",
                          }}
                          onClick={() => showModal(post._id)}
                        >
                          <Link href="">
                            <a>
                              <DeleteOutlined
                                style={{ marginRight: "4px" }}
                                className="menu-item-icon"
                              />
                              Delete
                            </a>
                          </Link>
                        </li>

                        <li
                          style={{
                            marginBottom: "9px",
                          }}
                        >
                          <Link href="">
                            <a>
                              <EditOutlined
                                style={{ marginRight: "4px" }}
                                className="menu-item-icon"
                              />
                              Update
                            </a>
                          </Link>
                        </li>

                        <li>
                          <Link href="">
                            <a>
                              <BiHide
                                style={{
                                  marginBottom: "-2px",
                                  marginRight: "5px",
                                }}
                                className="menu-item-icon"
                              />
                              Hide
                            </a>
                          </Link>
                        </li>
                      </div>
                    }
                    trigger="click"
                  >
                    <Button
                      className="dropdown-btn"
                      icon={<FiMoreVertical style={{ marginTop: "5px" }} />}
                    ></Button>
                  </Popover>
                ) : (
                  <div style={{ marginTop: "10px", color: "white" }}>X</div>
                )}
              </div>
            }
          >
            <div className="post-description">{post.post_description}</div>

            {post.post_img ? (
              <div style={{ overflow: "hidden" }}>
                <Image
                  src={post.post_img}
                  responsive="true"
                  preview="false"
                  objectFit="cover"
                  width="700"
                  height="400"
                  className="post-img"
                  alt="post-image"
                />
              </div>
            ) : (
              ""
            )}

            <div className="ant-card-footer">
              <div style={{ display: "flex" }}>
                <Popover
                  placement="topLeft"
                  content={
                    post.likes.length > 0
                      ? post.likes.map((like, index) => (
                          <div key={index}>
                            <label style={{ color: "rgb(53, 108, 226)" }}>
                              {like}
                            </label>
                          </div>
                        ))
                      : "no likes"
                  }
                >
                  <Button
                    onClick={() => handleLikes(post._id)}
                    className="like-btn"
                    icon={
                      post.likes.includes(username) ? (
                        <BsHeartFill
                          color="#E74C3C"
                          style={{ marginTop: "5px" }}
                        />
                      ) : (
                        <BsHeart style={{ marginTop: "5px" }} />
                      )
                    }
                  ></Button>
                </Popover>
                <p
                  style={{
                    marginTop: "10px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                >
                  {post.likes.length > 0 && post.likes.length}
                </p>
                <Popover
                  placement="topLeft"
                  content={
                    post.saves.length > 0
                      ? post.saves.map((save, index) => (
                          <div key={index}>
                            <label style={{ color: "rgb(53, 108, 226)" }}>
                              {save}
                            </label>
                          </div>
                        ))
                      : "no saves"
                  }
                >
                  <Button
                    onClick={() => handleSaves(post._id)}
                    className="save-btn"
                    icon={
                      post.saves.includes(username) ? (
                        <BsBookmarkFill
                          color="steelblue"
                          style={{ marginTop: "5px" }}
                        />
                      ) : (
                        <BsBookmark style={{ marginTop: "5px" }} />
                      )
                    }
                  ></Button>
                </Popover>

                <p
                  style={{
                    marginTop: "10px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                >
                  {post.saves.length > 0 && post.saves.length}
                </p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <center>
          <Spin />
        </center>
      )}
    </Card>
  );
};

export default Post;
