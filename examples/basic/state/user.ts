export const schema = `
  type User {
    id: String!
  }
  extend type Query {
    user: User
  }
`;
