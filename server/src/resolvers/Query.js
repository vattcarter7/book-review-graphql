import { allUsers, myProfile } from '../utils/user';
import { allBooks, searchBook } from '../utils/book';
import { allReviews } from '../utils/review';
import { search } from '../utils/search';
import { authorizeTo } from '../utils/auth';
import { ADMIN, USER, MODERATOR } from '../constants/roles';

const Query = {
  users: (parent, args, { request }, info) => {
    authorizeTo(request, [ADMIN]);
    return allUsers(args);
  },
  user: (parent, args, ctx, info) => {
    const { loaders } = ctx;
    const { findReviewsByUserIdsLoader } = loaders;
    return findReviewsByUserIdsLoader.load(args.id);
  },
  me: (parent, args, { request }, info) => {
    const { userId } = authorizeTo(request, [ADMIN, MODERATOR, USER]);
    return myProfile(userId);
  },
  books: (parent, args, ctx, info) => {
    return allBooks(args);
  },
  reviews: (parent, args, ctx, info) => {
    return allReviews(args);
  },
  book: (parent, args, ctx, info) => {
    const { loaders } = ctx;
    const { findBooksByIdsLoader } = loaders;
    return findBooksByIdsLoader.load(args.id);
  },
  searchBook: (parent, args, ctx, info) => {
    const { query } = args;
    return searchBook(query);
  },
  search: (parent, args, ctx, info) => {
    const { query } = args;
    return search(query);
  }
};

export default Query;
