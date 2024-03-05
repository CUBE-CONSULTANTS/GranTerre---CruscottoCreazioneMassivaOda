sap.ui.define([
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
  "use strict";
  return {
    // Get
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
    //POST
    _postExcel: function(entity,base64Data){
      let model = this.getOwnerComponent().getModel();
      let fileBlob = this._base64ToBlob(base64Data)
      let oFormData = new FormData();
      oFormData.append("file", fileBlob)
      model.create(entity, oFormData, {
        headers: {
          'Content-type': 'multipart/form-data'
        },
          success: function(data) {
            MessageBox.success("Upload Completato");
            oView.setBusy(false);
          },
          error: function(error) {
            MessageBox.error("Si è verificato un errore durante l'upload: " + error);
            oView.setBusy(false);
          }
        });
    }
    
  };
});