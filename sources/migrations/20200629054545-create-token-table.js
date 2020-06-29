'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('token', 
      {
        id: {   
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uid: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        valid: { 
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 1 
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
         },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        } 
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('token')
  }
}