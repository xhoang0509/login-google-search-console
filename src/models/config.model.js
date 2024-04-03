"use strict";

module.exports = (sequelize, DataTypes) => {
    const configs = sequelize.define(
        `configs`,
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            domain_id: {
                type: DataTypes.INTEGER(11),
            },
            enable: {
                type: DataTypes.INTEGER,
            },
            display_type: {
                type: DataTypes.INTEGER,
            },
            content: {
                type: DataTypes.TEXT,
            },
            theme_id: {
                type: DataTypes.BIGINT,
            },
            page_type: {
                type: DataTypes.STRING(300),
            },
            redirect_type: {
                type: DataTypes.INTEGER,
            },
            redirect_url: {
                type: DataTypes.STRING(300),
            },
            disable_registration_form: {
                type: DataTypes.INTEGER,
            },
            registration_page_message: {
                type: DataTypes.TEXT,
            },
            add_to_cart_selector: {
                type: DataTypes.TEXT,
            },
            upload_timestamp: {
                type: DataTypes.BIGINT,
            },
        },
        {
            tableName: `configs`,
        },
    );

    return configs;
};
