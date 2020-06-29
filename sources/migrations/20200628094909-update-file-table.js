'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('file', 'extension', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('file', 'extension', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
}
