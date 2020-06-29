'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', 
      { 
        uid: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        id: {
          type: Sequelize.STRING(322), // https://tools.ietf.org/html/rfc3696 (page 6, section 3)
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(32),
          allowNull: false,
        }
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user')
  }
}