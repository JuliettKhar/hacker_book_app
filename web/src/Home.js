import React, { Component } from 'react';
import * as R from 'ramda';
import { BookListSection, SORT_BY } from './components/Book';
import Error from './components/Error';
import { RecentReviewSection } from './components/Review';
import fetch from './fetch';

const query = `
fragment Book on Book {
  id
  title
  description
  rating
}
fragment Review on Review {
  id
  title
  rating
  comment
  user {
    name
  }
}
query Home($orderBy: BooksOrderBy!) {
  reviews {
    ...Review
    book {
      ...Book
      imageUrl(size: SMALL)
    }
  }
  books (orderBy: $orderBy) {
    ...Book
    imageUrl
    authors {
      name
    }
  }
}
`;


class Home extends Component {
  state = {
    books: [],
    reviews: [],
    orderBy: R.pipe(
      R.keys,
      R.head,
    )(SORT_BY),
    errors: [],
  };
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    try {
      // eslint-disable-next-line
      const { orderBy } = this.state;
      const variables = { orderBy };

      const res = await fetch({ query, variables })
      const books = R.path(['data', 'books'], res);
      const reviews = R.path(['data', 'reviews'], res);
      const errorList = R.pathOr([], ['errors'], res);
      const errors = R.map(err => err.message, errorList);

      this.setState({
        books,
        reviews,
        errors,
      });
    } catch (err) {
      this.setState({ errors: [err.message] });
    }
  }
  handleOrderBy = async orderBy => {
    this.setState({ orderBy }, () => {
      this.loadData();
    });
  };
  render() {
    return (
      <div className="cf black-80 mv2">
        <Error errors={this.state.errors} />
        <BookListSection {...this.state} handleOrderBy={this.handleOrderBy} />
        <RecentReviewSection {...this.state} />
      </div>
    );
  }
}

export default Home;
