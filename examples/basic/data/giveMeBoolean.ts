export const resolvers = {
  Query: {
    giveMeBoolean() {
      return Math.random() < 0.5;
    }
  }
};