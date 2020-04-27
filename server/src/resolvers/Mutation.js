import { createBook } from '../utils/book';
import { createReview } from '../utils/review';
import { createUser, login } from '../utils/user';
import { authorizeTo } from '../utils/auth';
import { USER } from '../constants/roles';

const Mutation = {
  createUser: (parent, args, ctx) => {
    const { data } = args;
    return createUser(data);
  },
  login: (parent, args, ctx) => {
    const { data } = args;
    return login(data);
  },
  createReview: (parent, args, { request }) => {
    authorizeTo(request, [USER]);
    const { reviewInput } = args;
    return createReview(reviewInput);
  },
  createBook: (parent, args, ctx) => {
    const { googleBookId } = args;
    return createBook(googleBookId);
  }
};

export default Mutation;
