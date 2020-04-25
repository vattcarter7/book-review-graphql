import { imageUrl } from '../utils/book';

const Book = {
  imageUrl: (parent, { size }, ctx, info) => imageUrl(size, parent.googleId),
  authors: (parent, args, ctx, info) => {
    const { loaders } = ctx;
    const { findAuthorsByBookIdsLoader } = loaders;
    return findAuthorsByBookIdsLoader.load(parent.id);
  },
  reviews: (parent, args, ctx, info) => {
    const { loaders } = ctx;
    const { findReviewsByBookIdsLoader } = loaders;
    return findReviewsByBookIdsLoader.load(parent.id);
  }
};

export default Book;
