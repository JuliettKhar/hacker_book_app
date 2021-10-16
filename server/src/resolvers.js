import { allBooks, imageUrl, findBookById } from './books';
import { authorsByBookId } from './author';
import { allReviews } from './review';
import { allUsers } from './user';
import { findUsersByIdsLoader } from './user';

const resolvers = {
  Book: {
    imageUrl: (book, {size}) => imageUrl(size, book.googleId),
    authors: (book, args, context)  => {
      const { loaders } = context;
      const { findAuthorsByBookIdsLoader } = loaders;

      return findAuthorsByBookIdsLoader.load(book.id)
    },
  },
  Review: {
    book: (review, args, context)  => {
      const { loaders } = context;
      const { findBooksByIdsLoader } = loaders;

      return findBooksByIdsLoader.load(review.bookId)
    },
    user: (review, args, context)  => {
      const { loaders } = context;
      const { findUsersByIdsLoader } = loaders;

      return findUsersByIdsLoader.load(review.userId)
    },
  },
  Query: {
    books: (root, args) => allBooks(args),
    reviews: () => allReviews(),
    users: () => allUsers(),
  },
};

export default resolvers;