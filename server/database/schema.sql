begin;
create schema br;

create table br.author (
  id                serial primary key,
  name              text,
  tokens            tsvector,
  created_at        timestamp default now()
);

create index author_tokens_idx on br.author using gin(tokens);

comment on table br.author is 'A book author.';
comment on column br.author.id is 'The primary unique identifier for the author.';
comment on column br.author.name is 'The author''s name.';
comment on column br.author.tokens is 'tokens for full text search';
comment on column br.author.created_at is 'The time this author was created.';

create table br.book (
  id                serial primary key,
  google_id         text unique,
  title             text not null,
  subtitle          text,
  description       text,
  page_count        int default 0,
  rating_total      int default 0,
  rating_count      int default 0,
  rating            decimal default 0,
  tokens            tsvector,
  created_at        timestamptz default now()
);

create index book_google_id_idx on br.book(google_id);
create index book_tokens_idx on br.book using gin(tokens);

comment on table br.book is 'A book.';
comment on column br.book.id is 'The primary unique identifier for the book.';
comment on column br.book.title is 'The books title.';
comment on column br.book.subtitle is 'The books subtitle.';
comment on column br.book.description is 'The books description.';
comment on column br.book.page_count is 'The number of pages in the book.';
comment on column br.book.rating_total is 'The total number of all the user reviews for the book. ie user1: 4 star, user2: 5 star, user3: 3 star => review_total = 12 (4 + 5 + 3)';
comment on column br.book.rating_count is 'The count of all the user reviews for the book. ie user1: 4 star, user2: 5 star, user3: 3 star => review_count = 3';
comment on column br.book.rating is 'The average rating for the book';
comment on column br.book.tokens is 'tokens for full text search';
comment on column br.book.created_at is 'The time this book was created.';

create table br.book_author(
  id                serial primary key,
  book_id           int not null references br.book(id),
  author_id         int not null references br.author(id),
  created_at        timestamptz default now()
);

create index book_author_book_id_idx on br.book_author(book_id);
create index book_author_author_id_idx on br.book_author(author_id);

comment on table br.book_author is 'A book author.';
comment on column br.book_author.id is 'The primary unique identifier for the book.';
comment on column br.book_author.book_id is 'The id for the book.';
comment on column br.book_author.author_id is 'The id for the author.';
comment on column br.book_author.created_at is 'The time this book author was created.';

CREATE TABLE br.user(
  id                        SERIAL PRIMARY KEY,
  email                     TEXT UNIQUE NOT NULL check (email ~* '^.+@.+\..+$'),
  password                  VARCHAR(128) NOT NULL,
  name                      VARCHAR(100) NOT NULL,
  gender                    VARCHAR(10),
  user_role                 VARCHAR(50) DEFAULT 'user',
  tokens                    tsvector,
  modified_date             TIMESTAMPTZ,
  active                    BOOLEAN DEFAULT true,
  password_reset_token      VARCHAR(200),
  password_reset_expires    TIMESTAMPTZ,
  created_at                TIMESTAMPTZ DEFAULT now()
);

create index user_tokens_idx on br.user using gin(tokens);

comment on table br.user is 'A book reviewer.';
comment on column br.user.id is 'The primary unique identifier for the user.';
comment on column br.user.email is 'The user''s email.';
comment on column br.user.name is 'The user''s name.';
comment on column br.user.tokens is 'tokens for full text search';
comment on column br.user.created_at is 'The time this user was created.';

create table br.review(
  id                serial primary key,
  user_id           int not null references br.user(id),
  book_id           int not null references br.book(id),
  rating            int not null check(rating >= 1 and rating <= 5),
  title             text,
  comment           text,
  tokens            tsvector,
  created_at        timestamptz default now()
);

create index review_user_id_idx on br.review(user_id);
create index review_book_id_idx on br.review(book_id);
create index review_tokens_idx on br.review using gin(tokens);

comment on table br.review is 'A book review.';
comment on column br.review.user_id is 'The id of the user doing the review';
comment on column br.review.book_id is 'The id of the book being reviewed.';
comment on column br.review.rating is 'The number of stars given 1-5';
comment on column br.review.title is 'The review title left by the user';
comment on column br.review.comment is 'The review comment left by the user';
comment on column br.review.tokens is 'tokens for full text search';
comment on column br.review.created_at is 'The time this review was created.';

create function br.create_book(
  google_book_id        text,
  title                 text, 
  subtitle              text,
  description           text,
  authors               text[],
  page_count            integer
) returns br.book as $$
declare
  book            br.book;
  authors_rows    br.author[];
  author_ids      int[];
  tokens          tsvector;
begin

  select * from br.book where br.book.google_id = google_book_id into book;

  if book.id > 0 then
    return book;
  else
    tokens := to_tsvector(coalesce(title, '') || coalesce(subtitle, '') || coalesce(description, ''));
    insert into br.book(google_id, title, subtitle, description, page_count, tokens)
      values (google_book_id, title, subtitle, description, page_count, tokens) 
      returning * into book;

    with ai as (
      insert into br.author(name, tokens) 
      select name, to_tsvector(name) 
      from
      (select unnest(authors) as name ) as a
        returning id 
    ) 

    insert into br.book_author(book_id, author_id) 
    select book.id, id from ai;

    return book;
  end if;
end;
$$ language plpgsql strict security definer;

commit;