"use strict";

module.exports = (sequelize, DataTypes) => {
    const shops = sequelize.define(
        `shops`,
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            domain: {
                type: DataTypes.STRING(300),
            },
            token: {
                type: DataTypes.STRING(300),
            },
            country: {
                type: DataTypes.STRING(50),
            },
            plan_id: {
                type: DataTypes.INTEGER,
            },
            plan_code: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            start_trial_date: {
                type: DataTypes.DATE,
            },
            remain_trial_days: {
                type: DataTypes.INTEGER,
            },
            charge_id: {
                type: DataTypes.STRING(300),
            },
            first_subscription: {
                type: DataTypes.INTEGER,
            },
            installed: {
                type: DataTypes.SMALLINT,
            },
            status_passcode_requests: {
                type: DataTypes.INTEGER,
            },
            interval_subscriptions: {
                type: DataTypes.STRING(20),
            },
            email: {
                type: DataTypes.STRING(255),
            },
            customer_email: {
                type: DataTypes.STRING(255),
            },
            app_name: {
                type: DataTypes.STRING(255),
            },
        },
        {
            tableName: `shops`,
        },
    );

    return shops;
};
