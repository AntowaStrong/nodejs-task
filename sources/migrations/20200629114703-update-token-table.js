'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('token', 'token', {
      type: Sequelize.STRING(32),
      allowNull: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('token', 'token', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
}
