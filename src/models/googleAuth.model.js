"use strict";

module.exports = (sequelize, DataTypes) => {
    const googleAuthModel = sequelize.define(
        `googleAuth`,
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            key: {
                type: DataTypes.STRING,
            },
            access_token: {
                type: DataTypes.STRING,
            },
            refresh_token: {
                type: DataTypes.STRING,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            expiry_date: {
                type: DataTypes.BIGINT,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: `googleAuth`,
        },
    );

    return googleAuthModel;
};
