module.exports = (sequelize, DataTypes) => {
    const Enquries = sequelize.define("Enquries", {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      FirstName:{
        type: DataTypes.STRING,
        allowNull: true
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Gender:{
        type: DataTypes.STRING,
        allowNull: true
      },
      AdmissionsNeed:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      FormIsCompletedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentsFirstName:{
        type: DataTypes.STRING,
        allowNull: true
      },
      parentsLastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      City: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      State: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Age: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      YearofHighSchoolGraduation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Comments: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Enquries;
  };
  