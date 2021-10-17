import { findAuthorsByBookIdsLoader } from './author';
import { findBooksByIdsLoader } from './books'
import { findUsersByIdsLoader } from './user';
import { findReviewsByBookIdsLoader } from './review';

export default () => ({
  findAuthorsByBookIdsLoader: findAuthorsByBookIdsLoader(),
  findBooksByIdsLoader: findBooksByIdsLoader(),
  findUsersByIdsLoader: findUsersByIdsLoader(),
  findReviewsByBookIdsLoader: findReviewsByBookIdsLoader(),
});