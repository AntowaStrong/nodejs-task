'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('token', 'type', {
      type: Sequelize.STRING(32),
      allowNull: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('token', 'type', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
}
