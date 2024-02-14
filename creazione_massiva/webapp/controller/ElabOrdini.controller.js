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
          this.btnGo.setProperty("text", "Esegui");
          this.byId("container-granterre.creazionemassiva---ElabOrdini--filterbar-btnClear").setProperty("text","Resetta Filtri")
          this.checked;
          this.errors
          this.selectedOda
        },
        btnGoSearch: function () {
          debugger;
          this.errors;
          let dataToCheck = this.getModel("odaDocs").getContext("/dati").getObject();
          dataToCheck.forEach((element) => {
            if (element.color === "red") {
              this.errors = true;
            }
          });
          if (this.checked) {
            if (this.errors) {
              MessageToast.show("Sono presenti Errori in fase di Simulazione");
            }
          }else{
            this.onSaveOda()
          }
          this.byId("tableOda").setVisible(true);        
        },
        onFilterBarClear:function(){
          this.getModel("filterModel").setProperty("/","")
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
            this.btnGo.setProperty("text", "Esegui");
          }
          this.getModel("filterModel").setProperty("/simulazione", this.checked);
        },
        NavToLaunch: function () {
          this.onFilterBarClear()
          this.byId("tableOda").setVisible(false)
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
          debugger
          let oFileUploader = oEvent.getSource().getParent().getParent().getAggregation("content")[3].getAggregation("content")[1]
          if (!oFileUploader.getValue()) {
            MessageToast.show("Choose a file first");
            return;
          }
          oFileUploader.checkFileReadable().then(function() {
            oFileUploader.upload();
          }, function(error) {
            MessageToast.show("The file cannot be read. It may have changed.");
          }).then(function() {
            oFileUploader.clear();
          });
        },
        handleTypeMissmatch: function (oEvent) {
          debugger
          let aFileTypes = oEvent.getSource().getFileType();
          aFileTypes.map(function(sType) {
            return "*." + sType;
          });
          MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                      " is not supported. Choose one of the following types: " +
                      aFileTypes.join(", "));
        },
        onSelectOda:function (oEvent) {
          debugger
          let selectedRows = oEvent.getSource().getSelectedContexts("odaDocs")
          this.selectedOda = []; 
          selectedRows.forEach(row => {
            this.selectedOda.push(row.getObject().ordAcq); 
          });
        },
        onSaveOda:function(){
          if(this.errors){
            MessageBox.error("Sono presenti Errori, Elaborazione non eseguita")
          }
        },
        navToElabMerci: function () {
          debugger
          this.getRouter().navTo("ElabMerci", {
            selected: JSON.stringify(this.selectedOda),
          });
        },
      }
    );
  }
);
