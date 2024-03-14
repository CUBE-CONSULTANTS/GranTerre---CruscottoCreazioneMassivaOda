sap.ui.define([
  "./BaseController",
    "../model/models",
    "../model/API",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController,
    models,
    API,
    Fragment,
    JSONModel,
    MessageBox,
    MessageToast) {
      "use strict";

      return BaseController.extend("granterre.creazionemassiva.controller.ElabMerci", {
          onInit: function () {
            debugger
            this.setModel(models.odaDocModel2(), "odaDocs");
            // this.btnGo1 = this.byId("container-granterre.creazionemassiva---ElabMerci--filterbar-btnGo")
            // this.btnGo1.setProperty("text","Esegui")
            // this.byId("container-granterre.creazionemassiva---ElabMerci--filterbar-btnClear").setProperty("text","Resetta Filtri")
            this.checked;
            this.setModel(models.createFilterModel(), "filterModel");
            this.getRouter().getRoute("ElabMerci").attachMatched(this._onRouteMatched, this);
          },
          _onRouteMatched: async function(oEvent) {
            debugger
            this.showBusy(0)
            let aTokens = [];
            let odaModel = new JSONModel()
            let odaData = {};
            let oda = oEvent.getParameter("arguments").selected;
            if(oda){
              let selectedOda = JSON.parse(oda)             
              selectedOda.forEach(function(item,index) {
                let oToken = new sap.m.Token({
                  key: item,
                  text: item
                })
                aTokens.push(oToken)
              });         
              this.byId("idMultiInput").removeAllTokens()
              this.byId("idMultiInput").setTokens(aTokens)
            }      
            this.hideBusy(0)
          },
          onElabMatDoc: async function () {
            debugger;
            let aOda = []
            this.byId("idMultiInput").getTokens().forEach(token=>{aOda.push(token.getProperty("text"))})
            let output = await API.getOutputLogMatDocSet(this.getOwnerComponent().getModel(),"/OutputLogMatDocSet",aOda,this.checked)
            this.byId("tableMerci").setVisible(true);
            // let error;
            // let dataToCheck = this.getModel("odaDocs").getContext("/dati").getObject();
            // dataToCheck.forEach((element) => {
            //   if (element.color === "red") {
            //     error = true;
            //   }
            // });
            // if (!this.checked) {
            //   this.byId("tableMerci").setVisible(true);
            //   if (error) {
            //     MessageBox.error("Non è consentita l'Elaborazione con Errori");
            //   }
            // } else {
            //   this.byId("tableMerci").setVisible(true);
            //   if (error) {
            //     MessageToast.show("Sono presenti Errori in fase di Simulazione");
            //   }
            // }
          },
          onIconPress: function (oEvent) {
            debugger;
            let errors = oEvent.getSource().getBindingContext("odaDocs").getObject().errors;
            let errorModel = new JSONModel(errors);
            this.setModel(errorModel, "errorModel");
            if (errors) {
              this.onOpenDialog("mDialog","granterre.creazionemassiva.view.Fragments.ElabMerci.SemaforoDialog",this,"errorModel");
            }
          },
          NavToLaunch: function () {
            debugger
            if(this.getModel("odaModel") !== undefined){
              this.getModel("odaModel").setProperty("/","")
            } 
            this.byId("tableMerci").setVisible(false)
            this.getRouter().navTo("RouteLaunchTile");
          },
          navToElabOrdine: function () {
            this.getRouter().navTo("ElabOrdini");
          },
      });
  });
