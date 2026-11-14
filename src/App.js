import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { useQuery } from "@apollo/client";
import { GET_LEETCODE_DATA } from "./data";

function App() {
  const { loading, error: queryError, data } = useQuery(GET_LEETCODE_DATA);
  const [userName, setUserName] = useState("");
  const [repos, setrepos] = useState("");
  const [followers, setfollowers] = useState("");
  const [following, setfollowing] = useState("");
  const [avatar, setavatar] = useState("");
  const [error, seterror] = useState(null);
  const [userInput, setuserInput] = useState("rishabranjan");
  const [bio, setBio] = useState(null);
  const [location, setLocation] = useState("");
  const [githubLink, setGithubLink] = useState("");

  const handleSubmit = useCallback(() => {
    fetch(`https://api.github.com/users/${userInput}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) seterror(data.message);
        else {
          setData(data);
          seterror(null);
        }
      });
  }, [userInput]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  const setData = ({
    avatar_url,
    followers,
    following,
    public_repos,
    name,
    bio,
    location,
    html_url,
  }) => {
    setUserName(name);
    setrepos(public_repos);
    setfollowers(followers);
    setfollowing(following);
    setavatar(avatar_url);
    setBio(bio);
    setLocation(location);
    setGithubLink(html_url);
  };

  const handleChange = (e) => {
    setuserInput(e.target.value);
  };

  return (
    <div className="App">
      <div className="nav">
        <p className="heading">Github Search</p>
        {!loading ? console.log(data) : console.log(queryError)}
      </div>
      <div className="form">
        <form
          className="ui form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="fields">
            <div className="field">
              <input
                value={userInput}
                onChange={(e) => handleChange(e)}
                placeholder="Github user"
              />
            </div>
            <div className="field">
              <button className="ui button" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      {error ? (
        <h1 className="error">{error}</h1>
      ) : (
        <div className="card">
          <div className="ui card">
            <div className="image">
              <img src={avatar} alt={`${userName}'s avatar`} />
            </div>
            <div className="content">
              <div className="header">
                <a target="_blank" rel="noopener noreferrer" href={githubLink}>
                  {userName}
                </a>
              </div>
              <div className="meta">
                <span className="date">{location}</span>
              </div>
              <div className="description">{bio}</div>
            </div>
            <div className="extra content">
              <p>
                <i className="user icon" />
                {followers} Followers
              </p>
            </div>
            <div className="extra content">
              <p>
                <i className="user icon" />
                {repos} Repos
              </p>
            </div>
            <div className="extra content">
              <p>
                <i className="user icon" />
                {following} Followings
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
