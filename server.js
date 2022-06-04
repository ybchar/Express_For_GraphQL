import { ApolloServer, gql } from "apollo-server";

// memory db
let tweets = [
  {
    id: "1",
    text: "first one",
  },
  {
    id: "2",
    text: "second one",
  },
];

let users = [
  {
    id: "1",
    firstName: "yb",
    lastName: "cha",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];

// graphQL
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    #dynamic field
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

// graphQL resolver
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("alluser called");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    // 원하는 쿼리 스트링을 return 받을 수 있음
    fullName({ firstName, lastName }) {
      // console.log(firstName, lastName);
      // return "hello";
      return `${firstName}${lastName}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
