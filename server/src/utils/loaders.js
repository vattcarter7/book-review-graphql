import { findAuthorsByBookIdsLoader } from './author';
import { findBooksByIdsLoader } from './book';
import { findUsersByIdsLoader } from './user';
import { findReviewsByBookIdsLoader } from './review';

const loaders = () => ({
  findAuthorsByBookIdsLoader: findAuthorsByBookIdsLoader(),
  findBooksByIdsLoader: findBooksByIdsLoader(),
  findUsersByIdsLoader: findUsersByIdsLoader(),
  findReviewsByBookIdsLoader: findReviewsByBookIdsLoader()
});

export default loaders;
