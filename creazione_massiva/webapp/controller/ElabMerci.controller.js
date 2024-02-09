sap.ui.define([
  "./BaseController"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
      "use strict";

      return Controller.extend("granterre.creazionemassiva.controller.ElabMerci", {
          onInit: function () {

          },
          navToElabOrdine: function ()
          {
            this.getRouter().navTo("ElabOrdini")
          },   
          navToElabMerci: function (){
            this.getRouter().navTo("ElabMerci")
          }
      });
  });
