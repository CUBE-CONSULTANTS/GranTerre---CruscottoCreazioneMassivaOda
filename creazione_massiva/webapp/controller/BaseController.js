sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
	  "sap/ui/model/Sorter",
    "granterre/creazionemassiva/model/formatter",
	"sap/m/MessageBox"
  ],
  function (Controller,
	History,
	UIComponent,
	Fragment,
	Spreadsheet,
	Sorter,
	formatter,
	MessageBox  ) {
    "use strict";

    return Controller.extend(
      "granterre.creazionemassiva.controller.BaseController",
      {
        formatter: formatter,
        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.core.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },
        onOpenDialog: function (dialName, fragmName, self, ...oModel) {
          let oView = this.getView();
          dialName = self.dialName;
          if (!dialName) {
            dialName = Fragment.load({
              id: oView.getId(),
              name: fragmName,
              controller: self,
            }).then((oValueHelpDialog) => {
              oView.addDependent(oValueHelpDialog);
              oValueHelpDialog.setModel(this.getModel(...oModel));
              return oValueHelpDialog;
            });
            dialName.then(function (oValueHelpDialog) {
              oValueHelpDialog.open();
            });
          } else {
            self.dialName.open();
          }
        },
        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getRouter: function () {
          return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
          debugger;
          const sPreviousHash = History.getInstance().getPreviousHash();

          if (sPreviousHash !== undefined) {
            window.history.back();
          } else {
            this.getRouter().navTo("appHome", {}, true /* no history*/);
          }
        },
        _getColumnsConfig: function (oTable) {
          debugger;
          const aCols = [];

          oTable.getColumns().forEach((el, key) => {
            debugger;
            if (key !== 0) {
              let property = "";
              oTable.getRows().forEach((row, i) => {
                const cell = row.getCells()[key];
                if (
                  cell.getMetadata().getElementName() === "sap.ui.core.Icon"
                ) {
                  property = "note";
                } else if (cell.getBindingInfo("text")) {
                  property = cell.getBindingInfo("text").parts[0].path;
                }
              });
              aCols.push({
                label: el.getLabel().getText(),
                property: property,
                type: String,
              });
            }
          });
          return aCols;
        },

        DownloadTable: function (oEvent) {
          debugger;
          const oTable = oEvent.getSource().getParent().getParent().getAggregation("content");
          const oRowBinding = oTable.getBinding("rows");
          const aCols = this._getColumnsConfig(oTable);
          const oSheet = new Spreadsheet({
            workbook: {
              columns: aCols,
              hierarchyLevel: "Level",
            },
            dataSource: oRowBinding,
            fileName: "Lista OdA Elaborati",
          });

          oSheet.build().finally(function () {
            oSheet.destroy();
          });
        },
        onClose: function (oEvent) {
          oEvent.getSource().getParent().close();
        }, 
        //check simulation
        onSimulazioneCheck: function (oEvent) {
          debugger;
          this.checked = oEvent.getParameter("selected");
          if(this.checked){
            this.checked = "X"
          }else{
            this.checked =""
          }
          this.byId("tableOda") !== undefined ? this.byId("tableOda").setVisible(false) : this.byId("tableMerci").setVisible(false);           
          this.getModel("filterModel").setProperty("/simulazione", this.checked);
        },       
        showBusy: function(delay) {
          // sap.ui.core.BusyIndicator.show(delay || 0);
          sap.ui.core.BusyIndicator.show(delay);
        },
        hideBusy: function(delay) {
          // sap.ui.core.BusyIndicator.hide(delay || 0);
          sap.ui.core.BusyIndicator.hide(delay);
        },
        getBase64: function (file) {
          debugger
          return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = function(e) {
              let base64Data = e.target.result.split(",")[1];
              resolve(base64Data);
            };
            reader.onerror = function(error) {
              reject(error);
            };
            let blob = new Blob([file]);
            reader.readAsDataURL(blob);
          });
        }
      }
    );
  }
);
