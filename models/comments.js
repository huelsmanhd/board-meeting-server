module.exports = function(sequelize, DataTypes) {
    const Comment = sequelize.define("comments", {
        comment: {
            type: DataTypes.STRING
        },
        owner: {
            type: DataTypes.INTEGER
        },
        eventid: {
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER
            
        }

    })
    return Comment;
}