import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BookSearchForm, BookSearchResults } from './components/Book';
import Error from './components/Error';
import fetch from './fetch';
import * as R from 'ramda';

const query = `
fragment SearchBook on SearchBookResult {
  id
  title
  description
  authors
  imageUrl
}
query SearchBook($query: String!) {
  searchBook(query: $query) {
    ...SearchBook
  }
}
`;


class AddBook extends Component {
  state = {
    term: '',
    results: [],
    redirectBookId: null,
    errors: [],
  };
  handleChange = (field, value) => {
    this.setState({ [field]: value });
  };
  search = async e => {
    e.preventDefault();
    // eslint-disable-next-line
    const { term } = this.state;
    try {
      const variables = { query: term };
      const res = await fetch({ query, variables })
      console.log(res)
      const results = R.path(['data', 'searchBook'], res);
      const errorList = R.pathOr([], ['errors'], res);
      const errors = R.map(err => err.message, errorList);

      this.setState({ results, errors });
    } catch (err) {
      this.setState({ errors: [err.message] });
    }
  };
  addBook = async googleBookId => {
    try {
      // TODO: add mutation to add book using graphql
      const redirectBookId = 1;
      const errors = [];
      this.setState({ redirectBookId, errors });
    } catch (err) {
      this.setState({ errors: [err.message] });
    }
  };
  render() {
    const { redirectBookId } = this.state;
    return (
      <div className="cf black-80 mv2">
        {redirectBookId && <Redirect to={`/book/${redirectBookId}`} />}
        <Error errors={this.state.errors} />
        <BookSearchForm
          search={this.search}
          handleChange={this.handleChange}
          term={this.state.term}
        />
        <BookSearchResults
          results={this.state.results}
          addBook={this.addBook}
        />
      </div>
    );
  }
}

export default AddBook;
