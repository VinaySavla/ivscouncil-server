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
        allowNull: false
      },
      AdmissionsNeed:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      FormIsCompletedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parentsFirstName:{
        type: DataTypes.STRING,
        allowNull: false
      },
      parentsLastName: {
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: false,
      },
      City: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      State: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Age: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      YearofHighSchoolGraduation: {
        type: DataTypes.STRING,
        allowNull: false,
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
  