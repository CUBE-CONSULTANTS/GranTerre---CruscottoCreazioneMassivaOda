/*global QUnit*/

sap.ui.define([
	"granterre/creazione_massiva/controller/LaunchTile.controller"
], function (Controller) {
	"use strict";

	QUnit.module("LaunchTile Controller");

	QUnit.test("I should test the LaunchTile controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
