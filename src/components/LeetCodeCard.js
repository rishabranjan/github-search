import { useEffect, useState } from "react";
import "./LeetCodeCard.css";

const LEETCODE_API_URL =
  "https://social-integration-api.vercel.app/leetcode/getUserProfile";

function getSubmissionCount(submissions, difficulty) {
  const entry = submissions?.find(
    (submission) =>
      submission.difficulty?.toLowerCase() === difficulty.toLowerCase(),
  );
  return Number(entry?.count) || 0;
}

function getLeetCodeStats(profile) {
  const submissions = profile.submitStats?.acSubmissionNum || [];
  const allSubmissions = submissions.find(
    ({ difficulty }) => difficulty?.toLowerCase() === "all",
  );
  const totalSolved =
    Number(allSubmissions?.count) ||
    ["Easy", "Medium", "Hard"].reduce(
      (total, difficulty) =>
        total + getSubmissionCount(submissions, difficulty),
      0,
    );
  const totalSubmissions = Number(allSubmissions?.submissions);
  const acceptanceRate =
    totalSubmissions > 0
      ? (totalSolved / totalSubmissions) * 100
      : null;
  const contestRating = Number(profile.userContestRanking?.rating);

  return {
    totalSolved,
    easy: getSubmissionCount(submissions, "Easy"),
    medium: getSubmissionCount(submissions, "Medium"),
    hard: getSubmissionCount(submissions, "Hard"),
    acceptanceRate,
    contestRating:
      Number.isFinite(contestRating) && contestRating > 0
        ? contestRating
        : null,
  };
}

function LeetCodeCard({ username, onUsernameChange }) {
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
      `${LEETCODE_API_URL}?userName=${encodeURIComponent(trimmedUsername)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load this LeetCode profile.");
        }
        if (data.errors?.length) {
          throw new Error(data.errors[0].message || "LeetCode returned an error.");
        }
        const matchedUser = data.data?.matchedUser;
        if (!matchedUser) {
          throw new Error(`LeetCode user "${trimmedUsername}" was not found.`);
        }
        return matchedUser;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        setProfile(data);
        setStatus("success");
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setProfile(null);
        setError(requestError.message || "Unable to load this LeetCode profile.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [username, refreshKey]);

  const stats = profile ? getLeetCodeStats(profile) : null;
  const profileUrl = profile
    ? `https://leetcode.com/u/${encodeURIComponent(profile.username)}/`
    : "";

  return (
    <article className="profile-card leetcode-card" aria-busy={status === "loading"}>
      <header className="platform-heading">
        <span className="platform-mark leetcode-mark" aria-hidden="true">
          LC
        </span>
        <div>
          <p className="platform-kicker">Problem-solving profile</p>
          <h2>LeetCode</h2>
        </div>
        <span className="platform-status">leetcode.com</span>
      </header>

      <form className="card-search leetcode-search" onSubmit={handleSubmit}>
        <label htmlFor="leetcode-username">LeetCode username</label>
        <div className="card-search-controls">
          <input
            id="leetcode-username"
            autoComplete="off"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            placeholder="Enter a LeetCode username"
          />
          <button type="submit">Refresh</button>
        </div>
      </form>

      {status === "loading" && (
        <div className="card-message" role="status">
          <span className="loading-dot" />
          Loading LeetCode profile…
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

      {status === "success" && profile && stats && (
        <>
          <div className="leetcode-identity">
            <img
              className="leetcode-avatar"
              src={profile.profile?.userAvatar || undefined}
              alt=""
            />
            <div className="identity-copy">
              <h3>{profile.profile?.realName || profile.username}</h3>
              <a
                className="leetcode-handle"
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{profile.username}
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
            <span className="leetcode-spark" aria-hidden="true">
              ✦
            </span>
          </div>

          <div className="solved-summary">
            <span className="solved-label">Problems solved</span>
            <strong>{stats.totalSolved.toLocaleString()}</strong>
            <div
              className="solved-meter"
              role="img"
              aria-label={`${stats.easy} easy, ${stats.medium} medium, ${stats.hard} hard problems solved`}
            >
              <span className="meter-easy" style={{ flexGrow: stats.easy }} />
              <span
                className="meter-medium"
                style={{ flexGrow: stats.medium }}
              />
              <span className="meter-hard" style={{ flexGrow: stats.hard }} />
            </div>
            <div className="difficulty-stats">
              <div>
                <span className="difficulty-dot easy-dot" />
                <span>Easy</span>
                <strong>{stats.easy}</strong>
              </div>
              <div>
                <span className="difficulty-dot medium-dot" />
                <span>Medium</span>
                <strong>{stats.medium}</strong>
              </div>
              <div>
                <span className="difficulty-dot hard-dot" />
                <span>Hard</span>
                <strong>{stats.hard}</strong>
              </div>
            </div>
          </div>

          <div className="leetcode-extras">
            <div>
              <span>Acceptance rate</span>
              <strong>
                {stats.acceptanceRate === null
                  ? "Not available"
                  : `${stats.acceptanceRate.toFixed(1)}%`}
              </strong>
            </div>
            <div>
              <span>Contest rating</span>
              <strong>
                {stats.contestRating === null
                  ? "Not available"
                  : stats.contestRating.toFixed(0)}
              </strong>
            </div>
          </div>

          <a
            className="leetcode-action"
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open LeetCode profile <span aria-hidden="true">→</span>
          </a>
        </>
      )}
    </article>
  );
}

export default LeetCodeCard;
