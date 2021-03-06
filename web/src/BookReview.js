import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as R from 'ramda';
import * as EmailValidator from 'email-validator';
import { Book, BookReviewForm } from './components/Book';
import Error from './components/Error';
import fetch from './fetch';

const query = `
  fragment Book on Book {
    id
    title
    description
    imageUrl
    rating
  }
  
  query Book($id: ID!){
    book(id: $id) {
      ...Book
      authors {
        name
      }
    }
  }
`;

const createReviewMutation = `
mutation CreateReview($reviewInput: ReviewInput!){
  createReview(reviewInput: $reviewInput){
    id
  }
}
`;

const isInputValid = reviewInput => {
  const { count, name, email } = reviewInput;
  return count > 0 && count < 6 && name && EmailValidator.validate(email);
};

class BookReview extends Component {
  state = {
    book: null,
    reviewInput: {
      count: 0,
      hoverCount: 0,
      name: '',
      email: '',
      title: '',
      comment: '',
    },
    redirect: false,
    inputValid: false,
    errors: [],
  };
  async componentDidMount() {
    const id = R.path(['props', 'match', 'params', 'id'], this);
    try {
      const variables = { id };
      const res = await fetch({ query, variables })
      const book = R.path(['data', 'book'], res);
      const errorList = R.pathOr([], ['errors'], res);
      const errors = R.map(err => err.message, errorList);

      this.setState({ book, errors });
    } catch (err) {
      this.setState({ errors: [err.message] });
    }
  }
  handleChange = R.curry((field, value) => {
    const { reviewInput } = this.state;
    const updatedReviewInput = R.merge(reviewInput, { [field]: value });
    const inputValid = isInputValid(updatedReviewInput);
    this.setState({ reviewInput: updatedReviewInput, inputValid });
  });
  handleSubmit = async e => {
    e.preventDefault();
    // eslint-disable-next-line
    const { book, reviewInput } = this.state;
    // eslint-disable-next-line
    const { name, count, email, title, comment } = reviewInput;
    try {
      const variables = {
        reviewInput: {
          bookId: book.id,
          rating: count,
          name,
          email,
          title,
          comment
        }
      };
      const res = await fetch({query: createReviewMutation, variables});
      const id = R.path(['data', 'createReview', 'id'], res);
      console.log(id, 'id')
      const errorList = R.pathOr([], ['errors'], res);
      const errors = R.map(err => err.message, errorList);
      this.setState({ redirect: !!id, errors });
    } catch (err) {}
  };
  render() {
    const { book, reviewInput, inputValid, redirect } = this.state;
    if (!book) return null;
    return (
      <div className="cf black-80 mv2">
        {redirect && <Redirect to={`/book/${book.id}`} />}
        <Error errors={this.state.errors} />
        <h1 className="fw4 mt2 mb3 f2">Review</h1>
        <Book book={book} />
        <BookReviewForm
          book={book}
          reviewInput={reviewInput}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          inputValid={inputValid}
        />
      </div>
    );
  }
}

export default BookReview;
