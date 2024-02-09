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
            this.setModel(Models.createFilterModel(),"filterModel")   
            this.btnGo = this.byId("container-granterre.creazionemassiva---ElabOrdini--filterbar-btnGo")
            this.btnGo.setProperty("text","Genera OdA")

            let checkModel = new JSONModel({ checked: false });
            this.setModel(checkModel, "checkedModel");
          },
          btnGoSearch: function(){
            debugger
            this.byId("tableOda").setVisible(true)          
           },
          onSimulazioneCheck: function (oEvent) { 
            let checked = oEvent.getParameter("selected")
            if(checked){
              this.btnGo.setProperty("text","Elabora Simulazione")           
            }else{
              this.btnGo.setProperty("text","Genera OdA")
            }
            this.getModel("checkedModel").setProperty("/checked", checked);
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
