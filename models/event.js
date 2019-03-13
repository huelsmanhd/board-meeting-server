module.exports = function(sequelize, DataTypes) {
    const Event = sequelize.define("event", {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lat: {
            type: DataTypes.DECIMAL
        },
        long : {
            type: DataTypes.DECIMAL
        },
        location: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        owner: {
            type: DataTypes.INTEGER
        }

    })
    return Event;
}