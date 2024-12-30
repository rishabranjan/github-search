import { gql } from "@apollo/client";

export const GET_LEETCODE_DATA = gql`
  query leetcodeData {
    matchedUser(username: "rishabranjan") {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`;
