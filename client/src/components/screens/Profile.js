import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [image, setImage] = useState("");

  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.posts);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instagram-post-images");
      data.append("cloud_name", "dl0dsqomf");
      fetch("https://api.cloudinary.com/v1_1/dl0dsqomf/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url);

          // localStorage.setItem(
          //   "user",
          //   JSON.stringify({ ...state, pic: data.url })
          // );
          //
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);
  const updateProfilePic = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "Loading . . ."}
              alt="user name"
            />
          </div>

          <div>
            <h4>{state ? state.name : "Loading"}</h4>
            <h4>{state ? state.email : "Loading"}</h4>
            <div
              style={{
                display: "flex",
                width: "108%",
                justifyContent: "space-between",
              }}
            >
              <h6>{mypics.length} posts</h6>
              <h6>{state ? state.followers.length : "0"} followers</h6>
              <h6>{state ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>

        <div class="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-2">
            <span>
              Edit Profile Pic
              <i className="material-icons">edit</i>
            </span>
            <input
              required
              type="file"
              onChange={(e) => updateProfilePic(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              alt={item.title}
              src={item.photo}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Profile;
