'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'token',
      'belong',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'token',
      'belong'
    )
  }
}
