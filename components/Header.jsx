import { useState, useEffect } from "react";
import { Popover } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { FiDatabase } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Cookies from "js-cookie";
import { useStore } from "../store";
import Image from "next/image";
import Link from "next/link";
import { userProfile } from "../pages/api/homeAPI";
import dynamic from "next/dynamic";
import useSWR from "swr";

const HeaderModal = dynamic(() => import("./HeaderModal"));

const Header = () => {
  const BASE_URL = "https://barani-iq-backend.herokuapp.com";

  const { data } = useSWR(`${BASE_URL}/api/posts`);
  const { username } = useStore();
  const [userData, setUserData] = useState([]);
  const [modalType, setModalType] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  let getUserData = async () => {
    await userProfile(async (data, error) => {
      if (data) setUserData(data);
    });
  };

  useEffect(() => getUserData(), []);

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  const logoutUser = () => {
    Cookies.remove("authToken");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="headerShadow">
        <div className="container">
          <header>
            <div className="container">
              <div className="logo">
                <h3>
                  <b className="first-letter">B</b>
                  arani
                </h3>
              </div>

              <div className="user">
                <p>{username}</p>
                {!isModalVisible && (
                  <Popover
                    placement="bottomRight"
                    content={
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <li
                          onClick={() => showModal("profile")}
                          style={{
                            marginBottom: "7px",
                          }}
                        >
                          <Link href="">
                            <a style={{ cursor: "pointer" }}>
                              <UserOutlined
                                style={{
                                  fontSize: "13px",
                                  marginLeft: "2px",
                                  marginRight: "5px",
                                }}
                                className="menu-item-icon"
                              />
                              Profile
                            </a>
                          </Link>
                        </li>

                        <li
                          style={{
                            marginBottom: "7px",
                          }}
                          onClick={logoutUser}
                        >
                          <Link href="">
                            <a style={{ cursor: "pointer" }}>
                              <LogoutOutlined
                                style={{
                                  fontSize: "12px",
                                  marginLeft: "3px",
                                  marginRight: "5px",
                                }}
                                className="menu-item-icon"
                              />
                              Logout
                            </a>
                          </Link>
                        </li>
                        <li
                          style={{
                            marginBottom: "7px",
                          }}
                          onClick={() => showModal("my-posts")}
                        >
                          <Link href="">
                            <a style={{ cursor: "pointer" }}>
                              <FiDatabase
                                style={{
                                  marginRight: "4px",
                                  marginLeft: "2px",
                                  marginBottom: "-2px",
                                }}
                                className="menu-item-icon"
                              />
                              Posts
                              {data?.post && data.post.length !== 0 && (
                                <label
                                  style={{
                                    background: "#333",
                                    color: "white",
                                    padding: "1px 4px",
                                    borderRadius: "3px",
                                    fontSize: "12px",
                                    marginLeft: "5px",
                                  }}
                                >
                                  {
                                    data?.post.filter(
                                      (p) => p.authorName === username
                                    ).length
                                  }
                                </label>
                              )}
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="">
                            <a style={{ cursor: "pointer" }}>
                              <IoMdNotificationsOutline
                                style={{
                                  fontSize: "17px",
                                  marginRight: "2px",
                                  marginBottom: "-3px",
                                }}
                                className="menu-item-icon"
                              />
                              Notify
                              {/*
                              <label
                                style={{
                                  background: "#e74c3c",
                                  color: "white",
                                  padding: "1px 4px",
                                  borderRadius: "3px",
                                  fontSize: "12px",
                                  marginLeft: "5px",
                                }}
                              >
                                0
                              </label>
                              */}
                            </a>
                          </Link>
                        </li>
                      </div>
                    }
                    trigger="click"
                  >
                    <Image
                      src={!userData.avatar ? "/avatar.svg" : userData.avatar}
                      preview="false"
                      responsive="true"
                      width="35"
                      height="35"
                      alt="user-avatar"
                      className="avatar"
                    />
                  </Popover>
                )}
              </div>
            </div>
          </header>
        </div>
      </div>
      <HeaderModal
        visible={isModalVisible}
        modalType={modalType}
        userData={userData}
        closeModal={onClose}
        username={username}
      />
    </>
  );
};

export default Header;
