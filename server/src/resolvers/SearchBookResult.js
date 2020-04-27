import { imageUrl } from '../utils/book';

const SearchBookResult = {
  imageUrl: (parent, args, ctx) => imageUrl(args.size, parent.id)
};

export default SearchBookResult;
