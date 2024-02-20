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
          this.checked;
          this.errors;
          this.selectedOda;
          this.progressInterval
          this.progress = 0
          this.getRouter().getRoute("ElabOrdini").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: async function (oEvent) {
          debugger;
          this.getView().setBusy(true);
          //chiamata ultimo log
          this.getView().setBusy(false);
        },
        // onFilterBarClear:function(){
        //   this.getModel("filterModel").setProperty("/","")
        // },
        onSimulazioneCheck: function (oEvent) {
          debugger;
          this.checked = oEvent.getParameter("selected");
          this.byId("tableOda").setVisible(false);
          this.getModel("filterModel").setProperty("/simulazione",this.checked);
        },
        onOdaSelect: function (oEvent) {
          //genera Ordine + check progresso
          debugger;
          let flag = "1";
          this.onCheckProgress(flag,oEvent);
        },
        onOdaMerceSelect: function (oEvent) {
          //genera Ordine + check progresso e documento
          debugger;
          let flag = "2";
          this.onCheckProgress(flag,oEvent);
        },
        onCheckProgress: async function (flag,oEvent) {
          let aModel;
          let that = this;
          this.onOpenDialog("pDialog","granterre.creazionemassiva.view.Fragments.ElabOrdini.progressDialog",this,"");
          this.progressInterval = setInterval(async () => {
            try {
              // aModel = await that._getDbPromised("/(flag='" + flag + "')")
              await that.simulateBackendProgress(flag,oEvent) 
              console.log("Controllo del progresso...");
            } catch (error) {
              console.error("Errore durante il controllo del progresso:",error);
            }
          }, 5000);
        },
        simulateBackendProgress: async function (flag,oEvent) {
          debugger
          const totalSteps = 10;
          const incrementAmount = 10; 
          const progressPercentage = Math.floor((this.progress / totalSteps) * 100);

          if (this.progress >= totalSteps) {
            clearInterval(this.progressInterval); 
          } else {
            const progressPercentage = Math.min(Math.floor((this.progress / totalSteps) * 100), 100); 
            this.updateProgressDialog(progressPercentage, flag, oEvent); 
            this.progress = Math.min(this.progress + incrementAmount, totalSteps); 
        }
        },
        updateProgressDialog: function (progressPercentage,flag,oEvent) {
          this.getView().byId("progressBar").setPercentValue(progressPercentage)
          if (progressPercentage === '100') {
            this.onCloseProgress(oEvent,flag)
          }
        },
        onCloseProgress:function(oEvent,flag){
          oEvent.getSource().getParent().close()
          this.showResultsInTable(flag);
        },
        showResultsInTable: function (flag) {
          if (flag === 2) {
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
            } else {
              this.onSaveOda();
            }
            let table = oEvent.getSource().getParent().getParent().getParent().getAggregation("content");
            let header = table.getHeaderText();
            table.setHeaderText((header += " e Documento Materiale"));
            table.setVisible(true);
          } else {
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
            } else {
              this.onSaveOda();
            }
            this.byId("tableOda").setVisible(true);
          }
        },
        onIconPress: function (oEvent) {
          debugger;
          let errors = oEvent.getSource().getBindingContext("odaDocs").getObject().errors;
          let errorModel = new JSONModel(errors);
          this.setModel(errorModel, "errorModel");
          if (errors) {
            this.onOpenDialog("mDialog","granterre.creazionemassiva.view.Fragments.ElabOrdini.SemaforoDialog",this,"errorModel");
            // this.pDialog ??= this.loadFragment({ name: "granterre.creazionemassiva.view.Fragments.ElabOrdini.SemaforoDialog"})
            // this.pDialog.then((oDialog)=>oDialog.open())
          }
        },
        DownloadExcel: function (oEvent) {
          debugger;
          let sExcelFilePath = "public/TemplateTracciato.xlsx";
          let link = document.createElement("a");
          link.href = sExcelFilePath;
          link.download = "TemplateTracciato.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        handleUploadPress: function (oEvent) {
          debugger;
          let oView = this.getView();
          let self = this;
          let oFileUploader = oEvent.getSource().getParent().getAggregation("content")[2];
          if (!oFileUploader.getValue()) {
            MessageBox.error("Allegare obbligatoriamente un File");
          } else if (oFileUploader.getFileType()[0] !== "xlsx") {
            MessageBox.error("Allegare File con estensione .xlsx");
          } else {
            oFileUploader.checkFileReadable().then(
              function () {
                oView.setBusy(true);
                self.convertToBase64(oFileUploader.getValue()).then(function (base64Data) {
                    // oModel.create("/EntitySet", base64Data, {
                    //   success: function(data) {
                    //     MessageBox.success("Upload Completato");
                    //     oView.setBusy(false);
                    //   },
                    //   error: function(error) {
                    //     MessageBox.error("Si è verificato un errore durante l'upload: " + error);
                    //     oView.setBusy(false);
                    //   }
                    // });
                    MessageBox.success("Upload Completato");
                    oView.setBusy(false);
                  })
                  .catch(function (error) {
                    MessageToast.show("Impossibile leggere il file. Potrebbe essere cambiato.");
                    oView.setBusy(false);
                  }).finally(function () {
                    oFileUploader.clear();
                  });
              }.bind(this),
              function (error) {
                MessageToast.show("Impossibile leggere il file. Potrebbe essere cambiato.");
                oView.setBusy(false);
              }
            );
          }
        },
        onSelectOda: function (oEvent) {
          debugger;
          let selectedRows = oEvent.getSource().getSelectedContexts("odaDocs");
          this.selectedOda = [];
          selectedRows.forEach((row) => {
            this.selectedOda.push(row.getObject().ordAcq);
          });
        },
        onSaveOda: function () {
          if (this.errors) {
            MessageBox.error("Sono presenti Errori, Elaborazione non eseguita");
          }
        },
        NavToLaunch: function () {
          // this.onFilterBarClear()
          this.byId("tableOda").setVisible(false);
          this.getRouter().navTo("RouteLaunchTile");
        },
        navToElabMerci: function () {
          debugger;
          this.getRouter().navTo("ElabMerci", {
            selected: JSON.stringify(this.selectedOda),
          });
        },
      }
    );
  }
);
