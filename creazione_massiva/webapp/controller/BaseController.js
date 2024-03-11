sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
	  "sap/ui/model/Sorter",
    "granterre/creazionemassiva/model/formatter"
  ],
  function (Controller,
	History,
	UIComponent,
	Fragment,
	Spreadsheet,
	Sorter, formatter  ) {
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
        _getDbPromised: function (Entity, Property, aFilters, aSorters, Expands) {
          let model = this.getOwnerComponent().getModel();
          let urlParameters = {};
          if (Expands && Array.isArray(Expands) && Expands.length > 0) {
            urlParameters.$expand = Expands.join(",");
          }
          return new Promise((resolve, reject) => {
            model.read(Entity, {
              filters: aFilters,
              sorters: aSorters,
              urlParameters: urlParameters,
              success: (odata) => {
                let sProp = Property;
                resolve({
                  [sProp]: odata.results,
                  success: true
                });
              },
              error: (err) => {
                reject({ success: false, error: err })
              },
            });
          });
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

        /**
         * Method for navigation to specific view
         * @public
         * @param {string} psTarget Parameter containing the string for the target navigation
         * @param {Object.<string, string>} pmParameters? Parameters for navigation
         * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
         */
        navTo: function (psTarget, pmParameters, pbReplace) {
          this.getRouter().navTo(psTarget, pmParameters, pbReplace);
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
        base64ToBlob: function (base64) {
          base64 = base64.replaceAll("-", "+").replaceAll("_", "/");
          const binaryString = window.atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return new Blob([bytes], {
            type: "application/pdf"
          });
        },
        convertToBase64: function (file) {
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
