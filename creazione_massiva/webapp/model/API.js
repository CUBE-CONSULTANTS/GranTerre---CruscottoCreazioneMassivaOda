sap.ui.define([
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
  "use strict";
  return {
    //POST upload
    uploadFile: function (file, oHeaders,oModel) {
      debugger
      return new Promise((resolve, reject) => {
        jQuery.ajax({
          type: 'POST',
          url: oModel.sServiceUrl + "/UploadDataSet",
          headers: {
            "SLUG": oHeaders[0].getValue(),
            "x-csrf-token": oHeaders[2].getValue()
          },
          cache: false,
          processData: false,
          contentType: oHeaders[1].getValue(),
          data: file,
          success: function (res) {
            resolve(res);
          },
          error: function (error) {
            console.log("Si è verificato un errore durante l'upload:", error);
            reject(error);
          }
        });
      });
    },
    getExpandedEntity: function (oModel, Entity, Expands) {
      let urlParameters = {};
      if (Expands && Array.isArray(Expands) && Expands.length > 0) {
        urlParameters.$expand = Expands.join(",");
      } else {
        urlParameters = {
          "$expand": Expands
        }
      }
      return new Promise((resolve, reject) => {
        oModel.read(Entity, {
          urlParameters: urlParameters,
          success: (odata) => {
            resolve({
              "results": odata.results,
              success: true
            });
          },
          error: (err) => {
            reject({ success: false, error: err })
          },
        });
      });
    },
    //get oda
    getOutputLogSet: function (oModel, Entity, check, button) {
      let filters = []
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
    //get documento materiale
    getOutputLogMatDocSet: function (oModel, Entity, oda, check) {
      debugger
      let filters = [];
      if (Array.isArray(oda)) {
        oda.forEach(function (oda) {
          filters.push(new sap.ui.model.Filter("Ebeln", sap.ui.model.FilterOperator.EQ, oda));
        });
      } else {
        filters.push(new sap.ui.model.Filter("Ebeln", sap.ui.model.FilterOperator.EQ, oda));
      }
      if (check === 'X') {
        filters.push(new sap.ui.model.Filter("Simulate", sap.ui.model.FilterOperator.EQ, 'X'));
      }

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
    //matchcode Oda
    matchOda: function (oModel, Entity, oda) {
      debugger
      let filters = [];
      if (Array.isArray(oda)) {
        oda.forEach(function (oda) {
          filters.push(new sap.ui.model.Filter("Ebeln", sap.ui.model.FilterOperator.EQ, oda));
        });
      } else {
        filters.push(new sap.ui.model.Filter("Ebeln", sap.ui.model.FilterOperator.EQ, oda));
      }

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
    // potenziale get ultimo log (servizio)
  };
});