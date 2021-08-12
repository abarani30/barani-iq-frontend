import dynamic from "next/dynamic";

const Post = dynamic(() => import("./Post"));

const Posts = ({ users }) => {
  return (
    <div className="post-container">
      <div className="container">
        <Post users={users} />
      </div>
    </div>
  );
};

export default Posts;
