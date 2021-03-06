import { allBooks, imageUrl, searchBook, createBook } from './books';
import { allReviews, createReview } from './review';
import { allUsers } from './user';
import { search } from './search';
import gravatar from 'gravatar';

const resolvers = {
  User: {
    imageUrl:(user, args) => gravatar.url(user.email, {s: args.size})
  },
  Book: {
    imageUrl: (book, {size}) => imageUrl(size, book.googleId),
    authors: (book, args, context)  => {
      const { loaders } = context;
      const { findAuthorsByBookIdsLoader } = loaders;

      return findAuthorsByBookIdsLoader.load(book.id)
    },
    reviews:(book, args, context) => {
      const { loaders } = context;
      const { findReviewsByBookIdsLoader } = loaders;

      return findReviewsByBookIdsLoader.load(book.id)
    }
  },
  SearchBookResult: {
    imageUrl: (result, args) => imageUrl(args.size, result.id),
  },
  SearchResult: {
    __resolveType: obj => obj.__type
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
    book: (root, args, context) => {
      const { loaders } = context;
      const { findBooksByIdsLoader } = loaders;

      return findBooksByIdsLoader.load(args.id)
    },
    searchBook: (root, args) => {
      const {query} = args;
      return searchBook(query)
    },
    search: (root, args) => {
      const {query} = args;
      return search(query)
    }
  },
  Mutation: {
    createReview: (root, args) => {
      const {reviewInput} = args;
      return createReview(reviewInput);
    },
    createBook: (root, args) => {
      const { googleBookId } = args;
      return createBook(googleBookId);
    }
  }
};

export default resolvers;