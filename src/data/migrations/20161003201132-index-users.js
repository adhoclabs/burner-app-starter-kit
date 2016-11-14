module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addIndex('users', ['token']);
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeIndex('users', ['token']);
  }
};
