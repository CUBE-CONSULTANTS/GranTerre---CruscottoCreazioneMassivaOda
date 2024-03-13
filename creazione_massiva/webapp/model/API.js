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
    uploadFile: function(file, oHeaders) {
      debugger;
      return new Promise((resolve, reject) => {         
          jQuery.ajax({
              type: 'POST',
              url: '/sap/opu/odata/sap/ZMM_PO_MATDOC_CREATE_SRV/UploadDataSet',
              headers: {
                "SLUG": oHeaders[0].getValue(), 
                "x-csrf-token": oHeaders[2].getValue()
              },
              processData : false,
              contentType: oHeaders[1].getValue(),
              data:file,
              success: function(res) {
                console.log("upload Completato");
                  resolve(res);
              },
              error: function(error) {
                  console.log("Si è verificato un errore durante l'upload:", error);
                  reject(error);
              }
          });
      });
    },
    
  };
});