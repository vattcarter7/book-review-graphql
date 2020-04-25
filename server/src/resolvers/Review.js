const Review = {
  book: (parent, args, ctx, info) => {
    const { loaders } = ctx;
    const { findBooksByIdsLoader } = loaders;
    return findBooksByIdsLoader.load(parent.bookId);
  },
  user: (parent, args, ctx, info) => {
    const { loaders } = ctx;
    const { findUsersByIdsLoader } = loaders;
    return findUsersByIdsLoader.load(parent.userId);
  }
};

export default Review;
