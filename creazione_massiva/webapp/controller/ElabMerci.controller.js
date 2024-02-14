sap.ui.define([
  "./BaseController",
    "../model/models",
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
    Fragment,
    JSONModel,
    MessageBox,
    MessageToast) {
      "use strict";

      return BaseController.extend("granterre.creazionemassiva.controller.ElabMerci", {
          onInit: function () {
            debugger
            this.setModel(models.odaDocModel2(), "odaDocs");
            this.btnGo1 = this.byId("container-granterre.creazionemassiva---ElabMerci--filterbar-btnGo")
            this.btnGo1.setProperty("text","Esegui")
            this.byId("container-granterre.creazionemassiva---ElabMerci--filterbar-btnClear").setProperty("text","Resetta Filtri")
            this.checked;
            this.getRouter().getRoute("ElabMerci").attachMatched(this._onRouteMatched, this);
          },
          _onRouteMatched: async function(oEvent) {
            debugger
            this.getView().setBusy(false)
            let oda = oEvent.getParameter("arguments").selected;
            let selectedOda = JSON.parse(oda)
            let odaData = [];
            selectedOda.forEach(function(item) {
              odaData.push({ "oda": item}); 
            });         
            let odaModel = new JSONModel(odaData);
            this.setModel(odaModel, "odaModel");
            let odaKeys = Object.values(odaModel.getProperty("/"));
            this.getView().byId("odaComboBox").setSelectedKeys(odaKeys)
            this.getView().setBusy(false)
          },
          btnGoSearch: function () {
            debugger;
            let error;
            let dataToCheck = this.getModel("odaDocs").getContext("/dati").getObject();
            dataToCheck.forEach((element) => {
              if (element.color === "red") {
                error = true;
              }
            });
            if (!this.checked) {
              this.byId("tableMerci").setVisible(true);
              if (error) {
                MessageBox.error("Non è consentita l'Elaborazione con Errori");
              }
            } else {
              this.byId("tableMerci").setVisible(true);
              if (error) {
                MessageToast.show("Sono presenti Errori in fase di Simulazione");
              }
            }
          },
          onSimulazioneCheck: function (oEvent) {
            debugger;
            this.checked = oEvent.getParameter("selected");
            this.byId("tableMerci").setVisible(false);           
            this.getModel("filterModel").setProperty("/simulazione", this.checked);
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
            this.byId("tableMerci").setVisible(false)
            this.getRouter().navTo("RouteLaunchTile");
          },
          navToElabOrdine: function () {
            this.getRouter().navTo("ElabOrdini");
          },
      });
  });
