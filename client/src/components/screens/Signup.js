import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadDetails();
    }
  }, [url]);

  const uploadPic = () => {
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
        //console.log(data.url);
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const uploadDetails = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#c62828 red darken-3" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          history.push("/signin");
        }
      })
      .catch((err) => console.log(err));
  };
  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadDetails();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Name"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
        <div class="file-field input-field">
          <div className="btn #64b5f6 blue darken-2">
            <span>Upload Profile Pic</span>
            <input
              required
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          onClick={() => PostData()}
          className="btn waves-effect waves-light #64b5f6 blue darken-2"
        >
          SignUp
        </button>
        <h5>
          <Link to="/signin">Already have an account ? Click here!</Link>
        </h5>
      </div>
    </div>
  );
};
export default Signup;
