module.exports = function(sequelize, DataTypes) {
    const Comment = sequelize.define("comments", {
        username: {
            type: DataTypes.STRING
        },
        comment: {
            type: DataTypes.STRING
        },
        owner: {
            type: DataTypes.INTEGER
        },
        eventId: {
            type: DataTypes.INTEGER
        }

    })
    return Comment;
}