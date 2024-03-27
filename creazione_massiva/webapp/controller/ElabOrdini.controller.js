sap.ui.define(
  [
    "./BaseController",
    "../model/models",
    "../model/API",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/Dialog"
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
	Dialog,
  ) {
    "use strict";

    return BaseController.extend(
      "granterre.creazionemassiva.controller.ElabOrdini",
      {
        formatter: formatter,

        onInit: async function () {
          // this.setModel(models.odaDocModel(), "odaDocs");
          this.setModel(models.createFilterModel(), "filterModel");
          let oModel = new JSONModel()
          this.setModel(oModel, "ordiniModel")
          this.checked;
          this.file
          this.selectedOda;
          this.firstVisit = true
          this.progressInterval = 0
          this.progress = 0
          this.getRouter().getRoute("ElabOrdini").attachMatched(this._onRouteMatched, this);
        },
        // ultimo log
        _onRouteMatched: function (oEvent) {
          debugger 
          let that = this
          if(this.firstVisit){
            this.firstVisit = false
            let routeMatchedPromise = new Promise(function(resolve, reject) {
              that.getRouter().fireRoutePatternMatched(oEvent);
              resolve();
          });
          routeMatchedPromise.then(function() {
            that.showBusy(0)
            MessageBox.warning("Visualizzare l'esito dell'ultima operazione?", {
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              emphasizedAction: MessageBox.Action.OK,
              onClose: function (sAction,oEvent) {
                if (sAction === MessageBox.Action.OK){          
                    that.showResultsInTable() 
                    that.getModel("filterModel").setProperty("/uploaded", true)
                    that.hideBusy(0)
                }else{
                  that.hideBusy(0)
                }
              }.bind(this) 
             });
            });
          }    
        },
        //gestione download/upload tracciato
        DownloadExcel: function (oEvent) {
          debugger
          let sExcelFilePath = "granterre/creazionemassiva/public/TracciatoCaricamentoOda.xlsx";
          let link = document.createElement("a");
          link.href = sap.ui.require.toUrl(sExcelFilePath);
          link.download = "TracciatoCaricamentoOda.xlsx";
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        handleChangeFile: async function (oEvent) {
          debugger
          this.getModel("filterModel").setProperty("/uploaded", false)
          let table = this.byId("tableOda")
          table !== undefined ?  table.setVisible(false) :  table.setVisible(true)
          let oModel = this.getOwnerComponent().getModel();
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
                  oFileUploader.setValue()
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
              oFileUploader.setValue()
            }         
          }
        },
        getErrorlog: async function () {
          debugger
          let oModel = new JSONModel()
          try {
            this.showBusy(0)
            let errorLog = await API.getExpandedEntity(this.getOwnerComponent().getModel(), "/UploadOutputSet", "UploadOutputValidation")
            oModel.setData({
              results: errorLog.results.flatMap(element => element.UploadOutputValidation.results)
            })
            this.setModel(oModel, "errorUploadModel")
            this.hideBusy(0)
            this.onOpenDialog("nDialog", "granterre.creazionemassiva.view.Fragments.Dialogs.ErrorTable", this, "errorUploadModel");
          } catch (error) {
            MessageBox.error("Si è verificato un errore durante l'operazione");
          }
        },
        getStagingTable: async function () {
          debugger
          let table = this.byId("tableOda")
          let iconStatus = table.getAggregation("columns")[0].getAggregation("template")
          
          try {
            this.showBusy(0)
            let stagingData = await API.getExpandedEntity(this.getOwnerComponent().getModel(), "/UploadOutputSet", "UploadOutputValidation")
            this.getModel("ordiniModel").setData({
              results: stagingData.results
            })
            
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
          let flag = "process orders";
          this.onOpenProgressDialog(oEvent, flag,"/OutputLogSet","OutputToBapiret")
        },
        //genera Ordine + documento
        onOdaMerceSelect: function (oEvent) {
          let flag = "process orders and matdoc";
          this.onOpenProgressDialog(oEvent, flag, "/OutputLogSet","OutputToBapiret")
        },
        //get tabella con o senza errori
        showResultsInTable: async function (oEvent,flag) {
          debugger
          let that = this
          let status = undefined;
          let table = this.byId("tableOda")
          let header = table.getExtension()[0].getAggregation("content")[0].getProperty("text")
          let icon = table.getAggregation("columns")[0].getAggregation("template")
          if(flag){
            if (flag === "process orders and matdoc") {
              header += " e Documento Materiale";
            }
          }        
          try {
            this.showBusy(0)
            let output = await API.getExpandedEntity(this.getOwnerComponent().getModel(), "/OutputLogSet", "OutputToBapiret")
            if (output.success) {
              if(output.results.length >0){
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
                if ((status === "warning" || status === "success") && !element.Mblnr) {
                  table.setSelectionMode("MultiToggle")
                }else{
                  table.setSelectionMode("None")
                }
              })
              }else{
                MessageBox.warning("Processo in corso")
              }
            }
            this.hideBusy(0)
            table.setVisible(true)
            if (this.checked === 'X') {
              if(status === "error"){
                MessageToast.show("Funz. eseguita in modalità Test, sono presenti Errori bloccanti" )
              }
              if(status === "warning"){
                MessageToast.show("Funz. eseguita in modalità Test, sono presenti Errori non bloccanti" )
              }
              if(status === "success"){
                MessageToast.show("Funz. eseguita in modalità Test, non sono presenti Errori" )
              }
            } else {
              if(status === "error"){
                MessageBox.error("Sono presenti Errori, elaborazione non eseguita. Ricompilare correttamente il foglio excel e riprovare")
              }
              if(status === "warning"){
                MessageBox.warning("Ordini processati correttamente, sono presenti Errori non bloccanti" )
              }           
              if(status === "success"){
                MessageBox.success("Ordini processati correttamente")
              }
            }
          } catch (error) {
            console.log(error)
          }     
        },
        //visualizzazione dialog errori x riga
        onIconPress: function (oEvent) {
          this.getElaborationErrors(oEvent,"ordiniModel")
        },
        // selezione degli ordini per cui ripetere elaborazione doc materiale
        onSelectOda: function (oEvent) {
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
          this.getRouter().navTo("ElabMerci", {
            selected: JSON.stringify(this.selectedOda),
          });
        },
      }
    );
  }
);
