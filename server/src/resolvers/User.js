import gravatar from 'gravatar';

const User = {
  imageUrl: (parent, args, ctx) =>
    gravatar.url(parent.email, { s: args.size }),
  reviews: (parent, args, ctx) => {
    const { loaders } = ctx;
    const { findReviewsByUserIdsLoader } = loaders;
    return findReviewsByUserIdsLoader.load(parent.id);
  }
};

export default User;
