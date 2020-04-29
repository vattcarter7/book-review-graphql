import { googleImageUrl } from '../utils/book';

const SearchBookResult = {
  imageUrl: (parent, args, ctx) => googleImageUrl(args.size, parent.id)
};

export default SearchBookResult;
