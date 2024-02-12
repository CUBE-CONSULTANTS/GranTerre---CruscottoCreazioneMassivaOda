sap.ui.define(
  [
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
  function (
    BaseController,
    models,
    Fragment,
    JSONModel,
    MessageBox,
    MessageToast
  ) {
    "use strict";

    return BaseController.extend(
      "granterre.creazionemassiva.controller.ElabOrdini",
      {
        onInit: function () {
          debugger;
          this.setModel(models.odaDocModel(), "odaDocs");
          this.setModel(models.createFilterModel(), "filterModel");
          this.btnGo = this.byId(
            "container-granterre.creazionemassiva---ElabOrdini--filterbar-btnGo"
          );
          this.btnGo.setProperty("text", "Genera OdA");
          this.checked;
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
            this.byId("tableOda").setVisible(true);
            if (error) {
              MessageBox.error("Non è consentita l'Elaborazione con Errori");
            }
          } else {
            this.byId("tableOda").setVisible(true);
            if (error) {
              MessageToast.show("Sono presenti Errori in fase di Simulazione");
            }
          }
        },
        onOdaSelect: function (oEvent) {
          debugger
          let checked = oEvent.getParameter("selected")
          if(checked) {          
            this.getModel("filterModel").setProperty("/crea1",false);
            oEvent.getSource().getParent().getParent().getAggregation("content")[6].getAggregation("content")[1].setSelected(false)          
          }
            this.getModel("filterModel").setProperty("/crea",checked);
        },
        onOdaMerceSelect: function (oEvent) {
          debugger
          let checked = oEvent.getParameter("selected")
          if(checked){
            this.getModel("filterModel").setProperty("/crea",false);  
            oEvent.getSource().getParent().getParent().getAggregation("content")[5].getAggregation("content")[1].setSelected(false)          
          } 
            this.getModel("filterModel").setProperty("/crea",checked);
        },
        onSimulazioneCheck: function (oEvent) {
          debugger;
          this.checked = oEvent.getParameter("selected");
          this.byId("tableOda").setVisible(false);
          if (this.checked) {
            this.btnGo.setProperty("text", "Elabora Simulazione");
          } else {
            this.btnGo.setProperty("text", "Genera OdA");
          }
          this.getModel("filterModel").setProperty("/simulazione", this.checked);
        },
        NavToLaunch: function () {
          this.getRouter().navTo("RouteLaunchTile");
        },
        onIconPress: function (oEvent) {
          debugger;
          let errors = oEvent.getSource().getBindingContext("odaDocs").getObject().errors;
          let errorModel = new JSONModel(errors);
          this.setModel(errorModel, "errorModel");
          if (errors) {
            this.onOpenDialog("mDialog","granterre.creazionemassiva.view.Fragments.ElabOrdini.SemaforoDialog",this,"errorModel");
          }
        },
        DownloadExcel: function (oEvent) {
          debugger;
        },
        handleUploadPress: function (oEvent) {

        },
        handleTypeMissmatch: function (oEvent) {

        },
      }
    );
  }
);
