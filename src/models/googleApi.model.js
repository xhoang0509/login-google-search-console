"use strict";

module.exports = (sequelize, DataTypes) => {
    const googleApis = sequelize.define(
        `googleApis`,
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            shop_id: {
                type: DataTypes.BIGINT,
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
            tableName: `googleApis`,
        },
    );

    return googleApis;
};
