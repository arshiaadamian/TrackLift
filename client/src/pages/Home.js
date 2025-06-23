import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";

function Home() {
  const [userName, setUserName] = useState("none");
  useEffect(() => {
    // fetch the username from the server
    console.log("fetching username from server");
    fetch("/api/user")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserName(data.username);
      });
  }, []);
  return (
    <div>
      <div>
        <h1>Home Page</h1>
        <h2>{userName !== "none" && userName}</h2>
      </div>
      {<Navbar />}
    </div>
  );
}

export default Home;
