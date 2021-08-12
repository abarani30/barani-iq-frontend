import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getAllUsers } from "./api/homeAPI";
import Users from "../components/Users";

const Header = dynamic(() => import("../components/Header"));
const PostControls = dynamic(() => import("../components/PostControls"));
const Posts = dynamic(() => import("../components/Posts"));
const ProtectRoute = dynamic(() => import("../HOC/ProtectRoute"));

const Home = () => {
  const router = useRouter();
  const [users, setAllUsers] = useState([]);

  useEffect(() => allUsers(), []);

  const allUsers = async () => {
    await getAllUsers(async (data, error) => {
      if (data) setAllUsers(data);
    });
  };

  return (
    <>
      <ProtectRoute>
        <Header />
        <PostControls />
        <Users users={users} />
        <Posts users={users} />
      </ProtectRoute>
    </>
  );
};

export default Home;
