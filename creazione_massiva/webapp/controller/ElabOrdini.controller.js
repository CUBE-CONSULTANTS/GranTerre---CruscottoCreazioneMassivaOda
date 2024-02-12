sap.ui.define([
  "./BaseController",
  "../model/models",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController,
	models,
	Fragment,
	JSONModel,
	MessageBox) {
      "use strict";

      return BaseController.extend("granterre.creazionemassiva.controller.ElabOrdini", {
          onInit: function () {
            debugger
            this.setModel(models.odaDocModel(), "odaDocs");   
            this.setModel(models.createFilterModel(),"filterModel")   
            this.btnGo = this.byId("container-granterre.creazionemassiva---ElabOrdini--filterbar-btnGo")
            this.btnGo.setProperty("text","Genera OdA")
            this.checked
            let checkModel = new JSONModel({ checked: false });
            this.setModel(checkModel, "checkedModel");
          },
          btnGoSearch: function(){
            debugger   
            let error       
            let dataToCheck =this.getModel("odaDocs").getContext("/dati").getObject()
            if(!this.checked){
              dataToCheck.forEach(element => {
                if(element.color === "red"){
                  error = true
                }
              }); 
            }           
            this.byId("tableOda").setVisible(true)   
            if(error) {
              MessageBox.error("Elaborazione fallita, correggere gli Errori")  
            }  
           },
          onSimulazioneCheck: function (oEvent) { 
            this.checked = oEvent.getParameter("selected")
            this.byId("tableOda").setVisible(false)
            if(this.checked){             
              this.btnGo.setProperty("text","Elabora Simulazione")           
            }else{            
              this.btnGo.setProperty("text","Genera OdA")             
            }
            this.getModel("checkedModel").setProperty("/checked", this.checked);
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
          DownloadExcel:function(oEvent){
            debugger
            
          }
          
      });
  });
