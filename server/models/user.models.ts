import { DataTypes, Model, Sequelize } from "sequelize";

import { ModelStatic } from "../utils";

export interface UserAttributes {
  username: string;
  hash: string;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {}

export const userFactory = (sequelize: Sequelize): ModelStatic<UserModel> => {
  return sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      hash: DataTypes.STRING,
    },
    {}
  );
};
