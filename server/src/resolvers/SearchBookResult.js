import { imageUrl } from '../utils/book';

const SearchBookResult = {
  imageUrl: (parent, args, ctx, info) => imageUrl(args.size, parent.id)
};

export default SearchBookResult;
