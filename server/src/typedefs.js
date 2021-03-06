const typeDefs = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    users: [User]
    user(id: ID!): User
    me: User
    books(orderBy: BooksOrderBy = RATING_DESC): [Book]
    reviews(orderBy: ReviewsOrderBy = ID_DESC): [Review]
    book(id: ID!): Book
    searchBook(query: String!): [SearchBookResult]
    search(query: String!): [SearchResult]
  }

  type Mutation {
    createUser(data: CreateUserInput): AuthPayload
    login(data: LoginUserInput): AuthPayload
    createReview(reviewInput: ReviewInput!): Review
    createBook(googleBookId: ID!): Book
  }

  union SearchResult =  Book | Review | Author | User 

  type SearchBookResult {
    id: ID!
    title: String
    description: String
    authors: [String]
    imageUrl(size: ImageSize = LARGE): String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input ReviewInput {
    bookId: ID!
    rating: Int!
    title: String
    comment: String
  }

  enum ReviewsOrderBy {
    ID
    ID_DESC
  }

  enum BooksOrderBy {
    RATING_DESC
    ID_DESC
  }

  type Review {
    id: ID!
    rating: Int
    title: String
    comment: String
    book: Book
    reviewer: User
  }

  type User {
    id: ID!
    name: String
    email: String
    password: String
    role: Role
    createdAt: String
    imageUrl(size: Int = 50): String
    reviews: [Review]
  }

  enum Role {
    USER
    ADMIN
    MODERATOR
  }

  type Book {
    id: ID!
    title: String!
    description: String!
    imageUrl(size: ImageSize = LARGE): String!
    rating: Float
    subtitle: String
    ratingCount: Int
    authors: [Author]
    reviews: [Review]
  }

  type Author {
    id: ID!
    name: String
  }

  enum ImageSize {
    SMALL
    LARGE
  }
`;

export default typeDefs;
