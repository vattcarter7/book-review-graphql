import { allUsers } from '../utils/user';
import { allBooks, searchBook } from '../utils/book';
import { allReviews } from '../utils/review';
import { search } from '../utils/search';

const Query = {
  users: (parent, args, ctx, info) => {
    return allUsers(args);
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
