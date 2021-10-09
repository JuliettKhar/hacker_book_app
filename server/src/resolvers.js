import { allBooks } from './books';

const resolvers = {
  Query: {
    books: () => {
      return allBooks();
    }
  },
};

export default resolvers;