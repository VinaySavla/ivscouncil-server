module.exports = (sequelize, DataTypes) => {
    const Donation = sequelize.define("Donation", {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Email:{
        type: DataTypes.STRING,
        allowNull: false
      },
      FirstName:{
        type: DataTypes.STRING,
        allowNull: true
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isOnBehalf:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isAnonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isRecurringDonation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      DonationFrequency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      DonationDuration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      DonationAmount: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Donation;
  };
  