import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface UserAttributes {
  username: string;
  hash: string;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {}

type UserStatic = typeof Model & {
  new (values?: never, options?: BuildOptions): UserModel;
};

export const userFactory = (sequelize: Sequelize): UserStatic => {
  return sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      hash: DataTypes.STRING,
    },
    {}
  );
};
