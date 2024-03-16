sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function(
	
	DateFormat
) {
	"use strict";

	return  {
		formatDate: function(date) {
            if (!date) {
                return "";
            }
            var oDateFormat = DateFormat.getDateInstance({pattern: "dd/MM/yyyy"});
            return oDateFormat.format(date);
        },
		iconColor: function(status) {
            switch (status) {
                case "error":
                    return "red";
                case "warning":
                    return "orange";
                case "success":
                    return "green";
                default:
                    return "grey";
            }
        }
	}
});