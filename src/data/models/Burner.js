import DataType from 'sequelize';
import Model from '../sequelize';

const Burner = Model.define('Burner', {
  id: {
    type: DataType.STRING,
    primaryKey: true
  },
  userId: {
    type: DataType.INTEGER,
    references: {
      model: 'User',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  createdAt: {
    type: DataType.DATE
  },
  updatedAt: {
    type: DataType.DATE
  }
});

export default Burner;
