sap.ui.define(
  [
    "./BaseController",
    "../model/models",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
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
    MessageToast,
    Spreadsheet
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
          this.byId("container-granterre.creazionemassiva---ElabOrdini--filterbar-btnClear").setProperty("text","Resetta Campi")
          this.checked;
          this.flag
          this.errors
          this.selectedOda
        },
        btnGoSearch: function (oEvent) {
          debugger;
          if(this.flag === undefined) {
            MessageBox.error("Selezionare un'opzione di esecuzione")
          }else{
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
          }
          
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
            this.flag= "sel1"
          }else{
            this.flag= undefined;
          }
            this.getModel("filterModel").setProperty("/crea",checked);
            
        },
        onOdaMerceSelect: function (oEvent) {
          debugger
          let checked = oEvent.getParameter("selected")
          if(checked){
            this.getModel("filterModel").setProperty("/crea",false);  
            oEvent.getSource().getParent().getParent().getAggregation("content")[5].getAggregation("content")[1].setSelected(false)          
            this.flag= "sel2"
          }else{
            this.flag= undefined;
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
          let sExcelFilePath = "public/TemplateTracciato.xlsx"
          let link = document.createElement("a");
          link.href = sExcelFilePath;
          link.download = "TemplateTracciato.xlsx"; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        handleUploadPress: function (oEvent) {
          debugger
          let oView = this.getView()
          let oFileUploader = oEvent.getSource().getParent().getParent().getAggregation("content")[3].getAggregation("content")[1]
          if(!oFileUploader.getValue()){
            MessageBox.error("Allegare obbligatoriamente un File")
          }else if(oFileUploader.getFileType()[0]!== 'csv'){
            MessageBox.error("Allegare File con estensione .csv")
          }else{
            oFileUploader.checkFileReadable().then(function() {
              oView.setBusy(true)
              oFileUploader.upload();
              MessageBox.success("Upload Completato")
              oView.setBusy(false)
            }, function(error) {
              MessageToast.show("The file cannot be read. It may have changed.");
              oView.setBusy(false)
            }).then(function() {
              oFileUploader.clear();
            });
          }

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
        NavToLaunch: function () {
          this.onFilterBarClear()
          this.byId("tableOda").setVisible(false)
          this.getRouter().navTo("RouteLaunchTile");
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
