This basic react app uses GitHub API, semantic-ui, and hooks.
You can visit this website at https://rishabranjan.github.io/github-search/ and enter your username on the search button to get your details quickly and easily.

## LeetCode GraphQL proxy

The browser app sends LeetCode GraphQL requests through the Vercel function in
`api/leetcode.js`, since LeetCode does not allow this GitHub Pages origin through
CORS. Deploy this repository to Vercel to publish the function, then add a
GitHub Actions repository variable named `REACT_APP_LEETCODE_API_URL` with the
function URL, for example
`https://<your-vercel-project>.vercel.app/api/leetcode`. The variable is read
when the GitHub Pages bundle is built.

By default, the function allows requests from
`https://rishabranjan.github.io` and `http://localhost:3000`. To use a different
origin, configure the Vercel environment variable `LEETCODE_ALLOWED_ORIGINS`
with a comma-separated list of allowed origins. For local development, run the
app using `vercel dev` so the function is available at `/api/leetcode`.

