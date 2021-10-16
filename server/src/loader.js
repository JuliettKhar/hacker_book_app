import { findAuthorsByBookIdsLoader } from './author';
import { findBooksByIdsLoader } from './books'
import { findUsersByIdsLoader } from './user';

export default () => ({
  findAuthorsByBookIdsLoader: findAuthorsByBookIdsLoader(),
  findBooksByIdsLoader: findBooksByIdsLoader(),
  findUsersByIdsLoader: findUsersByIdsLoader(),
});