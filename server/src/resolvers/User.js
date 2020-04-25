import gravatar from 'gravatar';

const User = {
  imageUrl: (parent, args, ctx, info) =>
    gravatar.url(parent.email, { s: args.size })
};

export default User;
