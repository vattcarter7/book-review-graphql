import { createBook } from '../utils/book';
import { createReview } from '../utils/review';

const Mutation = {
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