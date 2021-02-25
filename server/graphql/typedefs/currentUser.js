const { gql } = require('apollo-server-express');
const { typeDefForModel } = require('../helpers');
const { User } = require('../../app/models');

module.exports = gql`
  ${typeDefForModel(User, 'CurrentUser')}

  extend type Query {
    currentUser: CurrentUser
  }
`;