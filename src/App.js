import React, { useState, useEffect } from "react";
import { Card, Image, Icon, Form, Button } from "semantic-ui-react";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [repos, setrepos] = useState("");
  const [followers, setfollowers] = useState("");
  const [following, setfollowing] = useState("");
  const [avatar, setavatar] = useState("");
  const [error, seterror] = useState(null);
  const [userInput, setuserInput] = useState("");
  const [bio, setBio] = useState(null);
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetch("https://api.github.com/users/example")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  const setData = ({
    avatar_url,
    followers,
    following,
    public_repos,
    name,
    bio,
    location
  }) => {
    setUserName(name);
    setrepos(public_repos);
    setfollowers(followers);
    setfollowing(following);
    setavatar(avatar_url);
    setBio(bio);
    setLocation(location);
  };

  const handleChange = e => {
    // console.log(e.target.value);
    setuserInput(e.target.value);
    // console.log(userInput);
  };

  const handleSubmit = () => {
    fetch(`https://api.github.com/users/${userInput}`)
      .then(res => res.json())
      .then(data => {
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
      </div>
      <div className="form">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Input
              onChange={e => handleChange(e)}
              placeholder="Github user"
            />
            <Button type="submit">Search</Button>
          </Form.Group>
        </Form>
      </div>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <div className="card">
          <Card>
            <Image src={avatar} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{userName}</Card.Header>
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
