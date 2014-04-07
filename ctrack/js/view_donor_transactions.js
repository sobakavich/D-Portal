// Copyright (c) 2014 International Aid Transparency Initiative (IATI)
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT


var view_donor_transactions=exports;
exports.name="donor_transactions";

var ctrack=require("./ctrack.js")
var views=require("./views.js")

var refry=require("../../dstore/js/refry.js")
var iati_codes=require("../../dstore/json/iati_codes.json")
var crs_year=require("../../dstore/json/crs_2012.json")

var commafy=function(s) { return (""+s).replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
		return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,"); }) };

// the chunk names this view will fill with new data
view_donor_transactions.chunks=[
	"donor_transactions_datas",
];

//
// display the view
//
view_donor_transactions.view=function()
{
	view_donor_transactions.chunks.forEach(function(n){ctrack.chunk(n,"{spinner_in_table_row}");});
	ctrack.setcrumb(2);
	ctrack.change_hash();

	var year=ctrack.hash.year || 2012;
	var funder=ctrack.hash.funder || "gb";
	
	var args={};
	
	args.plate="{donor_transactions_data}";
	args.chunk="donor_transactions_datas";
	
	args.q={
		"year":year,
		"funder":funder,
	};
	args.q["trans_day_gteq"]=year+"-01-01";
	args.q["trans_day_lt"]=(parseInt(year)+1)+"-01-01";
				
	args.callback=function(data){
						
		ctrack.chunk("alerts","");
		if( iati_codes.crs_no_iati[funder] )
		{
			ctrack.chunk("alerts","{alert_no_iati}");
		}

		ctrack.chunk("donor",iati_codes.funder_names[funder] || iati_codes.country[funder] || funder );
		ctrack.chunk("year",year);
	};
	
	views.list_transactions.ajax(args);
};
