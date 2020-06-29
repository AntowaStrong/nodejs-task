'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('token', 'type', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('token', 'type', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  }
}
