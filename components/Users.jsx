import Image from "next/image";
import React from "react";

export default function Users({ users }) {
  return (
    <div className="all-users">
      <div className="container">
        <div className="cards">
          <div>
            {users.map((user) => (
              <div className="card" key={user.username}>
                <div className="userAvatar">
                  <Image
                    src={user.avatar}
                    responsive="true"
                    preview="false"
                    objectFit="cover"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="username">
                  {user.username.length >= 11
                    ? user.username.substring(0, 12)
                    : user.username}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
