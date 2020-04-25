import { createBook } from '../utils/book';
import { createReview } from '../utils/review';
import { createUser, login } from '../utils/user';

const Mutation = {
  createUser: (parent, args, ctx, info) => {
    const { data } = args;
    return createUser(data);
  },
  login: (parent, args, ctx, info) => {
    const { data } = args;
    return login(data);
  },
  createReview: (parent, args, ctx, info) => {
    const { reviewInput } = args;
    return createReview(reviewInput);
  },
  createBook: (parent, args, ctx, info) => {
    const { googleBookId } = args;
    return createBook(googleBookId);
  }
};

export default Mutation;
