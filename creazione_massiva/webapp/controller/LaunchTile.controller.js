sap.ui.define(
  ["./BaseController"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend(
      "granterre.creazionemassiva.controller.LaunchTile",
      {
        onInit: function () {},
        navToElabOrdine: function () {
          debugger
          this.getRouter().navTo("ElabOrdini");
        },
        navToElabMerci: function () {
          this.getRouter().navTo("ElabMerci");
        },
      }
    );
  }
);
