sap.ui.define(
  [
    "./BaseController",
    "../model/models",
    "../model/API",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    models,
    API,
    formatter,
    JSONModel,
    MessageBox,
    MessageToast,
  ) {
    "use strict";

    return BaseController.extend(
      "granterre.creazionemassiva.controller.ElabOrdini",
      {
        formatter: formatter,

        onInit: async function () {
          debugger;
          this.setModel(models.odaDocModel(), "odaDocs");
          this.setModel(models.createFilterModel(), "filterModel");
          this.checked;
          this.errors;
          this.file
          this.selectedOda;
          this.progressInterval = 0
          this.progress = 0
          this.getRouter().getRoute("ElabOrdini").attachMatched(this._onRouteMatched, this);
        },
        // eventuale chiamata ultimo log
        _onRouteMatched: async function (oEvent) {
          debugger;

        },
        //gestione download/upload tracciato
        DownloadExcel: function (oEvent) {
          debugger;
          let sExcelFilePath = "public/TracciatoCaricamentoOda.xlsx";
          let link = document.createElement("a");
          link.href = sExcelFilePath;
          link.download = "TracciatoCaricamentoOda.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        handleChangeFile: async function (oEvent) {
          debugger
          var oModel = this.getOwnerComponent().getModel();
          let oFileUploader = oEvent.getSource().getParent().getAggregation("content")[2];

          this.file = oEvent.getParameter("files")[0];
          oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
            name: "SLUG",
            value: this.file.name
          }));
          oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
            name: "Content-Type",
            value: this.file.type
          }));
          oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
            name: "x-csrf-token",
            value: oModel.getSecurityToken()
          }));

        },
        handleUploadPress: async function (oEvent) {
          let oFileUploader = this.byId("fileUploader")
          let oHeaders = oFileUploader.getHeaderParameters()
          let that = this

          if (!oFileUploader.getValue()) {
            MessageBox.error("Allegare obbligatoriamente un File");
          } else {
            try {
              this.showBusy(0)
              let res = await API.uploadFile(this.file, oHeaders)
              this.hideBusy(0)
              if (res) {
                if (res.all[7].children[1].innerHTML === 'File validated. Errors Found') {
                  MessageBox.warning("File Caricato. Sono presenti Errori di Compilazione", {
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function (sAction) {
                      that.getErrorlog()
                    }
                  });
                }
                if (res.all[7].children[1].innerHTML === 'Upload file is empty') {
                  MessageBox.error("Il file caricato risulta vuoto");
                }
                if (res.all[7].children[1].innerHTML === 'File uploaded without errors') {
                  that.getModel("filterModel").setProperty("/uploaded", true)
                  MessageBox.success("File Caricato con successo", {
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function (sAction) {
                      that.getStagingTable()
                    }
                  });
                }
              } else {
                MessageBox.success("File Caricato con successo", {
                  actions: [MessageBox.Action.CLOSE],
                  onClose: function (sAction) {
                    that.getStagingTable()
                  }
                });
              }
            } catch (error) {
              MessageBox.error('Si è verificato un errore durante il caricamento del file');
              this.hideBusy(0)
            }
            // oFileUploader.setValue()
          }
        },
        getErrorlog: async function () {
          debugger
          let oModel = new JSONModel()
          try {
            this.showBusy(0)
            let errorLog = await API.getEntity(this.getOwnerComponent().getModel(), "/UploadOutputSet", "UploadOutputValidation")
            oModel.setData({
              results: errorLog.results.flatMap(element => element.UploadOutputValidation.results)
            })
            this.setModel(oModel, "errorUploadModel")
            this.hideBusy(0)
            this.onOpenDialog("nDialog", "granterre.creazionemassiva.view.Fragments.ErrorTable", this, "errorUploadModel");
          } catch (error) {
            MessageBox.error("Si è verificato un errore durante l'operazione");
          }
        },
        getStagingTable: async function () {
          debugger
          let table = this.byId("tableOda")
          let iconStatus = table.getAggregation("columns")[0].getAggregation("template")
          let oModel = new JSONModel()
          try {
            this.showBusy(0)
            let stagingData = await API.getEntity(this.getOwnerComponent().getModel(), "/UploadOutputSet", "UploadOutputValidation")
            oModel.setData({
              results: stagingData.results
            })
            this.setModel(oModel, "ordiniModel")
            table.setSelectionMode("None")
            this.hideBusy(0)
          } catch (error) {
            MessageBox.error("Si è verificato un errore durante l'operazione");
          }
          table.setVisible(true)
        },
        //fine gestione download/upload tracciato  

        //genera Ordine
        onOdaSelect: function (oEvent) {
          debugger;
          let flag = "process orders";
          this.onOpenProgressDialog(oEvent, flag)
        },
        //genera Ordine + documento
        onOdaMerceSelect: function (oEvent) {
          debugger;
          let flag = "process orders and matdoc";
          this.onOpenProgressDialog(oEvent, flag)
        },
        //eventuale gestione asincrona

          onOpenProgressDialog: function (oEvent, flag) {
            let that = this
            this.pDialog ??= this.loadFragment({ name: "granterre.creazionemassiva.view.Fragments.ElabOrdini.progressDialog" })
            this.pDialog.then((oDialog) => {
              debugger
              let progressBar = new sap.m.ProgressIndicator({
                width: "17rem",
                displayValue: "0%",
                percentValue: 0,
                state: "Information",
              });
              if (!oDialog.getContent().length) {
                oDialog.addContent(progressBar);
              }
              progressBar.setBusy(true)
              oDialog.open()
              that.onCheckProgress(oEvent, flag, progressBar)
            })
          },
          onCheckProgress: async function (oEvent, flag, progressBar) {
            let that = this;
            try{
              const asyncCall = await API.getOutputLogSet(this.getOwnerComponent().getModel(), "/OutputLogSet", this.checked, flag)
              if (asyncCall.success){
                    that.backendProgress(oEvent, flag, progressBar)
                  }           
              }catch (error){
              MessageBox.error(error)
            }        
          },
          backendProgress: async function (oEvent, flag, progressBar) {
            debugger
            try {
              this.progressInterval = setInterval(async () => {
                const progressResponse = await API.getEntity(this.getOwnerComponent().getModel(), "/OutputLogSet", "OutputToBapiret");
                // const totalSteps = progressResponse.results.length;
                // let lengthModelData = this.getView().getModel("ordiniModel").getData().results.length;
          
                if (progressResponse.results.length) {
                  clearInterval(this.progressInterval);
                  progressBar.setBusy(false);
                  progressBar.setDisplayValue("100%");
                  progressBar.setPercentValue(100);
                  this.onCloseProgress(oEvent, progressBar.getParent(), flag);
                  this.progressInterval = 0;
                  this.progress = 0;
                  return;
                }
          
                this.progress++;
                let progressPercentage = Math.floor((this.progress / totalSteps) * 100);
                progressBar.setDisplayValue(progressPercentage + "%");
                progressBar.setPercentValue(progressPercentage);
              }, 20000)
            } catch (error) {
              MessageBox.error("Errore durante il controllo del progresso:", error);
              clearInterval(this.progressInterval);
            }
          },
          onCloseProgress: function (oEvent, dialog, flag) {
            dialog.removeAllContent();
            dialog.close()
            this.showResultsInTable(oEvent, flag);
          },
        //fine gestione asincrona

        //get tabella con o senza errori
        showResultsInTable: async function (oEvent, flag) {
          debugger
          let that = this
          let status = undefined;
          let table = oEvent.getSource().getParent().getParent().getParent().getAggregation("content")
          let header = oEvent.getSource().getParent().getParent().getParent().getAggregation("content").getAggregation("extension")[0].getAggregation("content")[0].getProperty("text")
          let icon = table.getAggregation("columns")[0].getAggregation("template")
          if (flag === "process orders and matdoc") {
            header += " e Documento Materiale";
          }
          try {
            this.showBusy(0)
            let output = await API.getEntity(this.getOwnerComponent().getModel(), "/OutputLogSet", "OutputToBapiret")
            if (output.success) {
              that.getModel("ordiniModel").setData(output)
              let aErrors = output.results.map(result => result.OutputToBapiret.results)
              aErrors.forEach(array => {
                array.shift()
              })
              that.getModel("ordiniModel").getProperty("/results").forEach((element, index) => {
                let errorsForElement = aErrors[index] || [];
                let hasError = errorsForElement.some(element => element.Status === "E");
                let allWarnings = errorsForElement.every(element => element.Status === "W");
                if (hasError) {
                  status = "error";
                } else if (allWarnings) {
                  status = "warning";
                } else {
                  status = "success";
                }
                that.getModel("ordiniModel").setProperty("/results/" + index + "/status", status);
                icon.setColor(formatter.iconColor(status))
              });

            }
            this.hideBusy(0)
            table.setVisible(true)
            if (this.checked === 'X') {
              MessageToast.show("Funz. eseguita in modalità Test")
            } else {
              if(status === "error"){
                MessageBox.error("Ricompilare correttamente il foglio excel e riprovare")
              }
              
              if(status === "success"){
                MessageBox.success("Ordini processati correttamente")
              }
              //nascondere o mostrare checkbox a seconda del risultato:

              // e crea ordine tutti verdi message.box("Ordini processati correttamente")
              //si può andare in selezione (table.setSelectionMode("MultiToggle"))  per creare documento materiale se la colonna 
              //  documento materiale è vuota 
            }

          } catch (error) {
            console.log(error)
          }
          // if (flag === 2) {
          //   let dataToCheck = this.getModel("odaDocs").getContext("/dati").getObject();
          //   dataToCheck.forEach((element) => {
          //     if (element.color === "red") {
          //       this.errors = true;
          //     }
          //   });
          //   if (this.checked) {
          //     if (this.errors) {
          //       MessageToast.show("Sono presenti Errori in fase di Simulazione");
          //     }
          //   } else {
          //     this.onSaveOda();
          //   }
          //   let table = oEvent.getSource().getParent().getParent().getParent().getAggregation("content");
          //   let header = table.getHeaderText();
          //   table.setHeaderText((header += " e Documento Materiale"));
          //   table.setVisible(true);
          // } else {
          //   let dataToCheck = this.getModel("odaDocs").getContext("/dati").getObject();
          //   dataToCheck.forEach((element) => {
          //     if (element.color === "red") {
          //       this.errors = true;
          //     }
          //   });
          //   if (this.checked) {
          //     if (this.errors) {
          //       MessageToast.show("Sono presenti Errori in fase di Simulazione");
          //     }
          //   } else {
          //     this.onSaveOda();
          //   }
          //   this.byId("tableOda").setVisible(true);
          // }
        },
        // onSaveOda: function () {
        //   if (this.errors) {
        //     MessageBox.error("Sono presenti Errori, Elaborazione non eseguita");
        //   }
        // },
        //visualizzazione dialog errori x riga
        onIconPress: function (oEvent) {
          debugger;
          let errors = oEvent.getSource().getBindingContext("ordiniModel").getObject().OutputToBapiret
          let errorModel = new JSONModel(errors.results);
          this.setModel(errorModel, "errorModel");
          if (errors) {
            this.onOpenDialog("mDialog", "granterre.creazionemassiva.view.Fragments.ElabOrdini.SemaforoDialog", this, "errorModel");
            // this.pDialog ??= this.loadFragment({ name: "granterre.creazionemassiva.view.Fragments.ElabOrdini.SemaforoDialog"})
            // this.pDialog.then((oDialog)=>oDialog.open())
          }
        },

        // selezione degli ordini per cui ripetere elaborazione doc materiale
        onSelectOda: function (oEvent) {
          debugger;
          let selectedRows = oEvent.getSource().getSelectedIndices();
          this.selectedOda = [];
          selectedRows.forEach((row) => {
            let oDa = oEvent.getSource().getContextByIndex(row).getObject().Ebeln
            this.selectedOda.push(oDa);
          });
        },

        //navigation
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
