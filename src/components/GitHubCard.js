import { useEffect, useState } from "react";
import "./GitHubCard.css";

function GitHubCard({ username, onUsernameChange }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setRefreshKey((key) => key + 1);
  };

  useEffect(() => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setProfile(null);
      setError("");
      setStatus("empty");
      return undefined;
    }

    const controller = new AbortController();
    setStatus("loading");
    setError("");

    fetch(
      `https://api.github.com/users/${encodeURIComponent(trimmedUsername)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load this GitHub profile.");
        }
        return data;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        setProfile(data);
        setStatus("success");
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setProfile(null);
        setError(requestError.message || "Unable to load this GitHub profile.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [username, refreshKey]);

  return (
    <article className="profile-card github-card" aria-busy={status === "loading"}>
      <header className="platform-heading">
        <span className="platform-mark github-mark" aria-hidden="true">
          GH
        </span>
        <div>
          <p className="platform-kicker">Developer profile</p>
          <h2>GitHub</h2>
        </div>
        <span className="platform-status">github.com</span>
      </header>

      <form className="card-search github-search" onSubmit={handleSubmit}>
        <label htmlFor="github-username">GitHub username</label>
        <div className="card-search-controls">
          <input
            id="github-username"
            autoComplete="off"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            placeholder="Enter a GitHub username"
          />
          <button type="submit">Refresh</button>
        </div>
      </form>

      {status === "loading" && (
        <div className="card-message" role="status">
          <span className="loading-dot" />
          Loading GitHub profile…
        </div>
      )}

      {status === "empty" && (
        <div className="card-message">Enter a username to view this profile.</div>
      )}

      {status === "error" && (
        <div className="card-message card-error" role="alert">
          {error}
        </div>
      )}

      {status === "success" && profile && (
        <>
          <div className="github-identity">
            <img className="github-avatar" src={profile.avatar_url} alt="" />
            <div className="identity-copy">
              <h3>{profile.name || profile.login}</h3>
              <a
                className="profile-handle"
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{profile.login}
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </div>

          {profile.bio && <p className="github-bio">{profile.bio}</p>}

          <div className="github-meta">
            {profile.location && (
              <span>
                <span aria-hidden="true">⌖</span> {profile.location}
              </span>
            )}
            {profile.company && <span>{profile.company}</span>}
          </div>

          <div className="github-stats" aria-label="GitHub statistics">
            <div className="github-stat">
              <strong>{profile.public_repos.toLocaleString()}</strong>
              <span>Repositories</span>
            </div>
            <div className="github-stat">
              <strong>{profile.followers.toLocaleString()}</strong>
              <span>Followers</span>
            </div>
            <div className="github-stat">
              <strong>{profile.following.toLocaleString()}</strong>
              <span>Following</span>
            </div>
          </div>

          <a
            className="github-action"
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub profile <span aria-hidden="true">→</span>
          </a>
        </>
      )}
    </article>
  );
}

export default GitHubCard;
