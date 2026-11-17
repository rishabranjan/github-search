import React, { act } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

it("keeps usernames independent and cancels previous requests per platform", async () => {
  const originalFetch = global.fetch;
  const originalActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  const requests = [];
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  global.fetch = jest.fn((url, options) => {
    requests.push({ url, signal: options.signal });
    return new Promise(() => {});
  });

  const div = document.createElement("div");
  const root = ReactDOM.createRoot(div);

  try {
    await act(async () => {
      root.render(<App />);
    });

    const githubRequest = requests.find(({ url }) =>
      url.includes("api.github.com"),
    );
    const leetCodeRequest = requests.find(({ url }) =>
      url.includes("social-integration-api"),
    );
    const setInputValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;

    await act(async () => {
      const input = div.querySelector("#github-username");
      setInputValue.call(input, "octocat");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(requests).toHaveLength(3);
    expect(githubRequest.signal.aborted).toBe(true);
    expect(leetCodeRequest.signal.aborted).toBe(false);
    expect(requests[2].url).toContain("users/octocat");
    expect(div.querySelector("#leetcode-username").value).toBe("rishabranjan");

    await act(async () => {
      const input = div.querySelector("#leetcode-username");
      setInputValue.call(input, "different-lc");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(requests).toHaveLength(4);
    expect(leetCodeRequest.signal.aborted).toBe(true);
    expect(requests[2].signal.aborted).toBe(false);
    expect(requests[3].url).toContain("userName=different-lc");
    expect(div.querySelector("#github-username").value).toBe("octocat");
  } finally {
    await act(async () => {
      root.unmount();
    });
    global.fetch = originalFetch;
    if (originalActEnvironment === undefined) {
      delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    } else {
      globalThis.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
    }
  }
});

it("updates both card usernames from the shared username field", async () => {
  const originalFetch = global.fetch;
  const originalActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  const requests = [];
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  global.fetch = jest.fn((url, options) => {
    requests.push({ url, signal: options.signal });
    return new Promise(() => {});
  });

  const div = document.createElement("div");
  const root = ReactDOM.createRoot(div);
  const setInputValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;

  try {
    await act(async () => {
      root.render(<App />);
    });

    await act(async () => {
      const input = div.querySelector("#shared-username");
      setInputValue.call(input, "shared-handle");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(div.querySelector("#github-username").value).toBe("shared-handle");
    expect(div.querySelector("#leetcode-username").value).toBe("shared-handle");
    expect(requests.some(({ url }) => url.includes("users/shared-handle"))).toBe(
      true,
    );
    expect(
      requests.some(({ url }) => url.includes("userName=shared-handle")),
    ).toBe(true);
  } finally {
    await act(async () => {
      root.unmount();
    });
    global.fetch = originalFetch;
    if (originalActEnvironment === undefined) {
      delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    } else {
      globalThis.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
    }
  }
});

it("renders independent GitHub and LeetCode profile statistics", async () => {
  const originalFetch = global.fetch;
  const originalActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  global.fetch = jest.fn((url) => {
    const body = url.includes("api.github.com")
      ? {
          login: "rishabranjan",
          name: "Rishab",
          avatar_url: "https://example.com/avatar.png",
          html_url: "https://github.com/rishabranjan",
          public_repos: 42,
          followers: 100,
          following: 75,
        }
      : {
          data: {
            matchedUser: {
              username: "rishabranjan",
              profile: { realName: "Rishab" },
              submitStats: {
                acSubmissionNum: [
                  { difficulty: "All", count: 368, submissions: 665 },
                  { difficulty: "Easy", count: 157, submissions: 284 },
                  { difficulty: "Medium", count: 198, submissions: 350 },
                  { difficulty: "Hard", count: 13, submissions: 31 },
                ],
              },
            },
          },
        };
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    });
  });

  const div = document.createElement("div");
  const root = ReactDOM.createRoot(div);

  try {
    await act(async () => {
      root.render(<App />);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(div.textContent).toContain("GitHub");
    expect(div.textContent).toContain("Repositories");
    expect(div.textContent).toContain("42");
    expect(div.textContent).toContain("LeetCode");
    expect(div.textContent).toContain("368");
    expect(div.textContent).toContain("157");
    expect(div.textContent).toContain("55.3%");
    expect(div.textContent).toContain("Not available");
  } finally {
    await act(async () => {
      root.unmount();
    });
    global.fetch = originalFetch;
    if (originalActEnvironment === undefined) {
      delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    } else {
      globalThis.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
    }
  }
});
