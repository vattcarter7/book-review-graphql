import gravatar from 'gravatar';

const User = {
  imageUrl: (parent, args, ctx, info) =>
    gravatar.url(parent.email, { s: args.size }),
  reviews: (parent, args, ctx, info) => {
    const { loaders } = ctx;
    const { findReviewsByUserIdsLoader } = loaders;
    return findReviewsByUserIdsLoader.load(parent.id);
  }
};

export default User;
