sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
  /**
   * provide app-view type models (as in the first "V" in MVVC)
   *
   * @param {typeof sap.ui.model.json.JSONModel} JSONModel
   * @param {typeof sap.ui.Device} Device
   *
   * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
   */
  function (JSONModel, Device) {
    "use strict";

    return {
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },
      odaDocModel: function () {
        let odaDocs = [
          {
            dialog:"ok1",
            color: "red",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZCMX",
            forn: "10001",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "P",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000001",
            pos: "10",
            eMerci: "",
            pos2: "",
            errors: [
              {
                msg: "E",
                descr: "L'ordine d'acquisto contiene ancora posizioni errate"
              },
              {
                msg: "E",
                descr: "Inserire il cd. materiale o il tipo di contabilizzazione"
              },
              {
                msg: "W",
                descr: "La data consegna può essere rispettata?"
              }
            ]
          },
          {
            dialog:"ko",
            color: "green",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZCMX",
            forn: "10002",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "P",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000001",
            pos: "20",
            eMerci: "",
            pos2: "",
          },
          {
            dialog:"ko",
            color: "green",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZTST",
            forn: "10001",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000002",
            pos: "10",
            eMerci: "",
            pos2: "",
          },
          {
            dialog:"ok",
            color: "orange",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZTST",
            forn: "10001",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000002",
            pos: "20",
            eMerci: "",
            pos2: "",
            errors: [
              {
                msg: "W",
                descr: "La data consegna può essere rispettata?"
              }
            ]
          },
        ];

        let odaDoc = new JSONModel({ odaDocs });
        return new JSONModel({ dati: odaDocs });
      },    
      odaDocModel2: function () {
        let odaDocs = [
          {
            dialog:"ko",
            color: "green",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZCMX",
            forn: "10001",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "P",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000001",
            pos: "10",
            eMerci: "50000001",
            pos2: "10",         
          },
          {
            dialog:"ko",
            color: "green",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZCMX",
            forn: "10002",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "P",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000002",
            pos: "10",
            eMerci: "50000002",
            pos2: "10",
          },
          {
            dialog:"ko",
            color: "green",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZTST",
            forn: "10001",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000003",
            pos: "10",
            eMerci: "50000003",
            pos2: "10",
          },
          {
            dialog:"ok",
            color: "orange",
            semaforo: "sap-icon://color-fill",
            tpDoc: "ZTST",
            forn: "10001",
            orgAcq: "ITS0",
            grpAcq: "CUS",
            tpPos: "",
            tpCont: "",
            codMat: "",
            descr: "",
            tBreve: "",
            qta: "",
            um: "",
            prz: "",
            consegna: "",
            ordAcq: "450000003",
            pos: "20",
            eMerci: "50000003",
            pos2: "20",
            errors: [
              {
                msg: "W",
                descr: "La data consegna può essere rispettata?"
              }
            ]
          },
        ];
        let odaDoc = new JSONModel({ odaDocs });
        return new JSONModel({ dati: odaDocs });
      }, 
      createFilterModel: function () {
        let oFilterModel = new JSONModel({
          tipoDocumento: "",
          fornitore: "",
          file: "",
          download: "",
          crea: "",
          crea1: "",
          simulazione: ""
        });
        return oFilterModel;
      },
      createErrorModel: function (){
        let oError = [
            {oda : "450000001"},
            {oda : "450000002"},
            {oda : "450000003"}
          ]
        let errorMod = new JSONModel({ oError });
        return new JSONModel({ dati: oError });  
      }
    };
  }
);
