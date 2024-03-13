sap.ui.define([
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
  "use strict";
  return {
    // Get generale
    _getDbPromised: function (oModel,Entity, Property, aFilters, aSorters, Expands) {     
      let urlParameters = {};
      if (Expands && Array.isArray(Expands) && Expands.length > 0) {
        urlParameters.$expand = Expands.join(",");
      }
      return new Promise((resolve, reject) => {
        oModel.read(Entity, {
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
     //POST upload
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
    //get file upload 
    getUploadDataSet: function (oModel,Entity,file){
      debugger
      let filters = [];
      filters.push(new sap.ui.model.Filter("FileName", sap.ui.model.FilterOperator.EQ, file));
      return new Promise((resolve, reject) => {
        oModel.read(Entity, {
            filters: filters,
            success: (odata) => {
                resolve({
                    "results": odata.results,
                    success: true
                });
            },
            error: (err) => {
                reject({
                    success: false,
                    error: err
                });
            },
        });
      });
    },

    //if errors ->log errori a video 

    // if upload errol log === status ok --->
    // get staging table function: 
    // output tabella dati inseriti da utente, status blank


    //

    // async get Output: action (simulate/oda/oda + mat)
    getOutputLogSet: function(oModel,Entity,check,button){
      debugger
      let filters = [];

      if (button === "process orders" && check === 'X') {
        filters.push(new sap.ui.model.Filter("OrderOnly", sap.ui.model.FilterOperator.EQ, 'X'));
        filters.push(new sap.ui.model.Filter("Simulate", sap.ui.model.FilterOperator.EQ, 'X'));
      } else if (button === "process orders and matdoc" && check === 'X') {
          filters.push(new sap.ui.model.Filter("Ordermatdoc", sap.ui.model.FilterOperator.EQ, 'X'));
          filters.push(new sap.ui.model.Filter("Simulate", sap.ui.model.FilterOperator.EQ, 'X'));
      } else if (button === "process orders") {
          filters.push(new sap.ui.model.Filter("OrderOnly", sap.ui.model.FilterOperator.EQ, 'X'));
      } else if (button === "process orders and matdoc") {
          filters.push(new sap.ui.model.Filter("Ordermatdoc", sap.ui.model.FilterOperator.EQ, 'X'));
      }
      let urlParameters = {
        "$expand": "OutputToBapiret"
      };
      return new Promise((resolve, reject) => {
        oModel.read(Entity, {
            filters: filters,
            urlParameters: urlParameters,
            success: (odata) => {
                resolve({
                    "results": odata.results,
                    success: true
                });
            },
            error: (err) => {
                reject({
                    success: false,
                    error: err
                });
            },
        });
      });
    },
    //potenziale get per fine update tabelle dopo inserimento ordine

    // potenziale get ultimo log
  };
});