const Review = {
  book: (parent, args, ctx) => {
    const { loaders } = ctx;
    const { findBooksByIdsLoader } = loaders;
    return findBooksByIdsLoader.load(parent.bookId);
  },
  reviewer: (parent, args, ctx) => {
    const { loaders } = ctx;
    const { findUsersByIdsLoader } = loaders;
    return findUsersByIdsLoader.load(parent.userId);
  }
};

export default Review;
