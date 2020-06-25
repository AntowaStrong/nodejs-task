'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('file', 
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        type: Sequelize.STRING,
        size: Sequelize.STRING,
        extension: Sequelize.STRING,
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
    await queryInterface.dropTable('file')
  }
}