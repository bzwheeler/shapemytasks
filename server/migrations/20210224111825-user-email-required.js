module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('Users', 'email', {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      }, { transaction });

      await queryInterface.addIndex('Users', ['email'], {
        name: 'users_email',
        unique: true,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('Users', 'email', { transaction });
      await queryInterface.removeIndex('Users', 'users_email', { transaction });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
