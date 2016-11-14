module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Sessions', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      expires: Sequelize.DATE,
      data: Sequelize.STRING(50000),
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Sessions');
  }
};
