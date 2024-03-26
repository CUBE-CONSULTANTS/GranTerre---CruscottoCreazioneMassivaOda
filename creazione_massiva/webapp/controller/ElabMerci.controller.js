sap.ui.define([
  "./BaseController",
    "../model/models",
    "../model/API",
    "../model/formatter",
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
    formatter,
    Fragment,
    JSONModel,
    MessageBox,
    MessageToast) {
      "use strict";

      return BaseController.extend("granterre.creazionemassiva.controller.ElabMerci", {
          onInit: function () {
            debugger
            // this.setModel(models.odaDocModel2(), "odaDocs");
            this.checked;
            this.progressInterval = 0
            this.progress = 0
            this.setModel(models.createFilterModel(), "filterModel");
            this.getRouter().getRoute("ElabMerci").attachMatched(this._onRouteMatched, this);
          },
          _onRouteMatched: async function(oEvent) {
            debugger
            this.showBusy(0)
            let aTokens = [];
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
              let oModel = new JSONModel({tokens: aTokens})
              this.setModel(oModel,"tokenModel")
              this.byId("idMultiInput").removeAllTokens()
              this.byId("idMultiInput").setTokens(aTokens)
            }      
            this.hideBusy(0)
          },
          onElabMatDoc: async function (oEvent) {
            debugger;
            let aOda = []
            this.byId("idMultiInput").getTokens().forEach(token=>{aOda.push(token.getProperty("text"))})
            this.onOpenProgressDialog(oEvent, aOda,"/OutputLogMatDocSet", "OutputToBapiret2")
          },
        
          showMerciResultsInTable: async function (oEvent, flag) {
            debugger
            let that = this
            let status = undefined;
            let table = oEvent.getSource().getParent().getParent().getParent().getAggregation("content")
            let icon = table.getAggregation("columns")[0].getAggregation("template")
            let oModel = new JSONModel()
           
            try {
              this.showBusy(0)
              let output = await API.getExpandedEntity(this.getOwnerComponent().getModel(), "/OutputLogMatDocSet", "OutputToBapiret2")
              if (output.success) {
                oModel.setData({
                  results: output.results
                })
                this.setModel(oModel, "emModel")

                let aErrors = output.results.map(result => result.OutputToBapiret2.results)
                
                that.getModel("emModel").getProperty("/results").forEach((element, index) => {
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
                  that.getModel("emModel").setProperty("/results/" + index + "/status", status);
                  icon.setColor(formatter.iconColor(status))
                })
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
                  MessageBox.warning("Documenti Materiale processati correttamente, sono presenti Errori non bloccanti" )
                }           
                if(status === "success"){
                  MessageBox.success("Documenti Materiale processati correttamente")
                }
              }
            } catch (error) {
              console.log(error)
            }     
          },
          onIconPress: function (oEvent) {
            debugger
            this.getElaborationErrors(oEvent,"emModel")
          },
          NavToLaunch: function () {
            debugger
            this.byId("idMultiInput").removeAllTokens()
            this.byId("tableMerci").setVisible(false)
            this.getRouter().navTo("RouteLaunchTile");
          },
          navToElabOrdine: function () {
            this.byId("idMultiInput").removeAllTokens()
            // if(this.getModel("odaModel") !== undefined){
            //   this.getModel("odaModel").setProperty("/","")
            // } 
            this.getRouter().navTo("ElabOrdini");
          },
      });
  });
