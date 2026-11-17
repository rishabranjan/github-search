import { useState } from "react";
import GitHubCard from "./components/GitHubCard";
import LeetCodeCard from "./components/LeetCodeCard";
import "./App.css";

function App() {
  const [sharedUsername, setSharedUsername] = useState("rishabranjan");
  const [githubUsername, setGithubUsername] = useState("rishabranjan");
  const [leetcodeUsername, setLeetcodeUsername] = useState("rishabranjan");

  const updateSharedUsername = (event) => {
    const username = event.target.value;
    setSharedUsername(username);
    setGithubUsername(username);
    setLeetcodeUsername(username);
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">Developer profile lookup</p>
        <h1>Your profiles, side by side.</h1>
        <p className="app-intro">
          Use one username for both, or set a different username on either
          profile card.
        </p>
      </header>

      <div className="shared-search">
        <label htmlFor="shared-username">Same username for both profiles</label>
        <input
          id="shared-username"
          autoComplete="off"
          value={sharedUsername}
          onChange={updateSharedUsername}
          placeholder="Enter a username for both"
        />
        <p>
          Changing this updates both cards. Edit either card below to use a
          different username.
        </p>
      </div>

      <section className="profile-grid" aria-label="Developer profiles">
        <GitHubCard
          username={githubUsername}
          onUsernameChange={setGithubUsername}
        />
        <LeetCodeCard
          username={leetcodeUsername}
          onUsernameChange={setLeetcodeUsername}
        />
      </section>
    </main>
  );
}

export default App;
