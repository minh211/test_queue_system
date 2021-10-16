"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("Tickets", {
      fields: ["doctorId"],
      type: "foreign key",
      name: "Tickets_doctorId_fkey",
      references: {
        //Required field
        table: "Doctors",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("Tickets", "Tickets_doctorId_fkey");
  },
};
