sap.ui.define([
  "./BaseController",
  "../model/models",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Models, Fragment,JSONModel) {
      "use strict";

      return Controller.extend("granterre.creazionemassiva.controller.ElabOrdini", {
          onInit: function () {
            debugger
            this.setModel(Models.odaDocModel(), "odaDocs");         
          },
          NavToLaunch: function ()
          {
            this.getRouter().navTo("RouteLaunchTile")
          },   
          onIconPress: function (oEvent) {
            debugger
            let errors = oEvent.getSource().getBindingContext("odaDocs").getObject().errors
            let errorModel = new JSONModel(errors)
            this.setModel(errorModel, "errorModel")
            if(errors){
              this.onOpenDialog("mDialog","granterre.creazionemassiva.view.Fragments.ElabOrdini.SemaforoDialog",this,"errorModel")
            }                   
          },
          
      });
  });
