import { allUsers, myProfile, findUserById } from '../utils/user';
import { allBooks, searchBook, findBookById } from '../utils/book';
import { allReviews } from '../utils/review';
import { search } from '../utils/search';
import { authorizeTo } from '../utils/auth';
import { ADMIN, USER, MODERATOR } from '../constants/roles';

const Query = {
  users: (parent, args, { request }) => {
    authorizeTo(request, [ADMIN]);
    return allUsers(args);
  },
  user: (parent, args, ctx) => {
    return findUserById(args.id);
  },
  me: (parent, args, { request }) => {
    const { userId } = authorizeTo(request, [ADMIN, MODERATOR, USER]);
    return myProfile(userId);
  },
  books: (parent, args, ctx) => {
    return allBooks(args);
  },
  reviews: (parent, args, ctx) => {
    return allReviews(args);
  },
  book: (parent, args, ctx) => {
    return findBookById(args.id);
  },
  searchBook: (parent, args, ctx) => {
    const { query } = args;
    return searchBook(query);
  },
  search: (parent, args, ctx) => {
    const { query } = args;
    return search(query);
  }
};

export default Query;
