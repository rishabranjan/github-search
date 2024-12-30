import React, { useState, useEffect } from "react";
import { Card, Image, Icon, Form, Button } from "semantic-ui-react";
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

  useEffect(() => {
    handleSubmit();
  }, []);

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

  const handleSubmit = () => {
    fetch(`https://api.github.com/users/${userInput}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) seterror(data.message);
        else {
          setData(data);
          seterror(null);
        }
      });
  };

  return (
    <div className="App">
      <div className="nav">
        <p className="heading">Github Search</p>
        {!loading ? console.log(data) : console.log(queryError)}
      </div>
      <div className="form">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Input
              value={userInput}
              onChange={(e) => handleChange(e)}
              placeholder="Github user"
            />
            <Button type="submit">Search</Button>
          </Form.Group>
        </Form>
      </div>
      {error ? (
        <h1 className="error">{error}</h1>
      ) : (
        <div className="card">
          <Card>
            <Image src={avatar} wrapped ui={false} />
            <Card.Content>
              <Card.Header>
                <a target="_blank" rel="noopener noreferrer" href={githubLink}>
                  {userName}
                </a>
              </Card.Header>
              <Card.Meta>
                <span className="date">{location}</span>
              </Card.Meta>
              <Card.Description>{bio}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <p>
                <Icon name="user" />
                {followers} Followers
              </p>
            </Card.Content>
            <Card.Content extra>
              <p>
                <Icon name="user" />
                {repos} Repos
              </p>
            </Card.Content>
            <Card.Content extra>
              <p>
                <Icon name="user" />
                {following} Followings
              </p>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;
