/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"granterre/creazione_massiva/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
