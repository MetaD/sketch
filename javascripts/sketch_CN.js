function drawEllipse(ctx, x, y, w, h) {
	var kappa = .5522848,
	ox = (w / 2) * kappa, // control point offset horizontal
	oy = (h / 2) * kappa, // control point offset vertical
	xe = x + w,           // x-end
	ye = y + h,           // y-end
	xm = x + w / 2,       // x-middle
	ym = y + h / 2;       // y-middle

	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	// ctx.closePath();
	ctx.stroke();
}

function changeSize(cntx, width, changeLine) {
	document.getElementById("n_range").innerHTML = width.toString();
	document.getElementById("rr").value = width.toString();
	if (changeLine) {
		cntx.lineWidth = width;
	}
}

//----------------------------- Dialogs -----------------------------//

//---------------------- User ID Handler ----------------------//

var UserID = "";

function wrong_ID() {
	$("#ID").addClass("ui-state-error");
	$("#validateTips").text("这个ID是无效的，请再次确认或联系我们").addClass("ui-state-highlight");
	setTimeout(function() {
		$("#validateTips").removeClass( "ui-state-highlight", 1500);
	}, 500 );
}

function ID_validation() {
	UserID = $("#ID").val();
	if (UserID == "testtest") {
		return true;
	}
	if (UserID == "PK089-2" || UserID == "PK100-2" || UserID == "PK475-2") {
		return true;
	}
	if (!UserID || UserID.length != 5) {
		console.log("!!1");
		wrong_ID();
		return false;
	}
	UserIdPart1 = UserID.substring(0,2);
	UserIdPart2 = UserID.substring(2,5);
	UserIdNumPart = parseInt(UserIdPart2, 10);
	if (!UserIdNumPart) {
		console.log("!!2");
		wrong_ID();
		return false;
	}
	var usedIDs = []
	if (usedIDs.indexOf(UserIdNumPart) != -1) {
		console.log("!!3");
		wrong_ID();
		return false;
	}
	if (UserIdPart1 === "BJ" &&
		( (UserIdNumPart >= 1 && UserIdNumPart <= 442) || (UserIdNumPart >= 601 && UserIdNumPart <= 827) )) {
		return true;
	}
	else if (UserIdPart1 === "PK") {
		var invalidIDs = [36, 98, 102, 163, 267, 392, 430, 458, 486, 509, 523, 545, 591, 610, 611, 612];
		if (invalidIDs.indexOf(UserIdNumPart) == -1 && UserIdNumPart >= 1 && UserIdNumPart <= 614) {
			return true;
		} else {
			console.log("!!4");
			wrong_ID();
			return false;
		}
	}
	else {
		console.log("!!5");
		wrong_ID();
		return false;
	}
}

$(function() {
	$("#dialog").dialog({
		modal: true,
		resizable: false,
		minWidth: 330,
		closeOnEscape: false,
		dialogClass: "dlg-no-title",
		open: function(event, ui) {
			$(".ui-dialog-titlebar-close").hide();
			$('.ui-widget-overlay').addClass('custom-overlay');
		},
		close: function() {
			$('.ui-widget-overlay').removeClass('custom-overlay');
		},
		buttons: {
			"提交": function cont() {
				if (ID_validation())
					$(this).dialog("close");
			}
		}
	});

	// add button id
	$('.ui-dialog-buttonpane button:contains("提交")').attr("id", "dialog_cont");

	// forbid the default form submit action
	$('form').on('submit', function(event) {
		event.preventDefault();
	});

	// custom form submit action: trigger "continue"
	$('#dialog').keypress(function(e) {
		if (e.keyCode == $.ui.keyCode.ENTER) {
			$("#dialog_cont").trigger("click");
		}
	});
});

//---------------------- End of User ID Handler ----------------------//

$(function() {
	$( "#full_instr" ).dialog({
		modal: true,
		autoOpen: false,
		minWidth: 500,
		open: function() {
			$('.ui-widget-overlay').addClass('custom-overlay');
		},
		close: function() {
			$('.ui-widget-overlay').removeClass('custom-overlay');
		}
	});

	$( "#full_instr_opener" ).click(function() {
		$( "#full_instr" ).dialog( "open" );
	});
});

$(function() {
	$( "#post_submission" ).dialog({
		modal: true,
		autoOpen: false,
		minWidth: 500,
		open: function() {
			$(".ui-dialog-titlebar-close").hide();
			$('.ui-widget-overlay').addClass('custom-overlay');
		},
		close: function() {
			$('.ui-widget-overlay').removeClass('custom-overlay');
		}
	});
});
//-------------------------- End of Dialogs --------------------------//

$(document).ready(function() {
	// hide txt & submitting
	$('#txt').hide();
	$('#submitting').hide();
	// draggable bar
	$('#config').draggable();
	$('#instruction').draggable();
	// create the CANVAS
	var clic=false;
	var x = "";
	var y = "";
	var canvas=document.getElementById("canvas");
	//width and height of the window 100%
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var cntx = canvas.getContext("2d");
	//border of the line -> redondeado
	cntx.lineCap = 'round';
	//bar sized
	$(":input").change(function(){
		$("#n_range").html($("#rr").val());
		var a = $('#n_range').text();
  		cntx.lineWidth = a;
  		tmp_ctx.lineWidth = a;
	});

	function non_circle_click(canvas) {
		clic=true;
		cntx.save();
		x = canvas.pageX-this.offsetLeft;
		y = canvas.pageY-this.offsetTop;
	}
	var mousedownEvent = non_circle_click;

	function switchMousedown(func) {
		canvas.removeEventListener('mousedown', mousedownEvent, false);
		mousedownEvent = func;
		canvas.addEventListener('mousedown', mousedownEvent, false);
	}
	
	$("#canvas").mousemove(function(canvas){
		if(clic==true) {
			cntx.beginPath();
			cntx.moveTo(canvas.pageX-this.offsetLeft,canvas.pageY-this.offsetTop);
			cntx.lineTo(x, y);
			cntx.stroke();
			cntx.closePath();
			x = canvas.pageX-this.offsetLeft;
			y = canvas.pageY-this.offsetTop;
		}
	});

	$(document).mouseup(function(){
	   clic=false;
	});

	$(document).click(function(){
	   clic=false;
	});

	// Creating a temp canvas
	var sketch = document.getElementById('container');
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;

	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var start_mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};

	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	// hide the temp canvas
	$('#tmp_canvas').hide();

	//pencil
	$( "#tools" ).change(function() {
		$('#tmp_canvas').hide();
		$('#txt').hide();
		cntx.strokeStyle = "#000000";	// black
		cntx.fillStyle = "#000000";
		var str = "";
		$( "#tools option:selected" ).each(function() {
			str += $( this ).text();
	    });

		// pencil
	    if (str == '铅笔') {
			changeSize(cntx, 5, true);
			switchMousedown(non_circle_click);
		}


		// eraser
		if (str == '橡皮') {
			changeSize(cntx, 20, true);
			cntx.strokeStyle = "#ffffff";	// white
			cntx.fillStyle = "#ffffff";
			switchMousedown(non_circle_click);
		}


		// text
		if (str == '文字') {
			$('#txt').show();
			changeSize(cntx, 25, false);
			//write
			var texto = document.getElementById('valor_t');

			function text_click(canvas){
				var fnt = "";
				// $( "#text option:selected" ).each(function() {
				//   fnt += $( this ).text();
				// });
				cntx.font = $('#n_range').text()+'px Arial'; //'bold ' + $('#n_range').text()+'px' + ' ' + fnt;
				clic=true;
				cntx.save();
				x = canvas.pageX-this.offsetLeft;
				y = canvas.pageY-this.offsetTop;
				var a = cntx.fillText($(texto).val(),x,y);
				var s = $(texto).val("");
			}
			switchMousedown(text_click);
		}


		// circle
		if (str == '圆') {
			changeSize(cntx, 5, true);

			function circle_click(e) {
				$('#tmp_canvas').show();
				/* Drawing on Paint App */
				tmp_ctx.lineWidth = cntx.lineWidth;
				tmp_ctx.lineJoin = 'round';
				tmp_ctx.lineCap = 'round';
				tmp_ctx.strokeStyle = cntx.strokeStyle;
				tmp_ctx.fillStyle = cntx.fillStyle;

				tmp_canvas.addEventListener('mousemove', onPaint, false);

				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

				start_mouse.x = mouse.x;
				start_mouse.y = mouse.y;

				onPaint();
			}

			switchMousedown(circle_click);

			tmp_canvas.addEventListener('mouseup', function() {
				tmp_canvas.removeEventListener('mousemove', onPaint, false);
				
				// Writing down to real canvas now
				cntx.drawImage(tmp_canvas, 0, 0);
				// Clearing tmp canvas
				tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
				
				$('#tmp_canvas').hide();
			}, false);

			function onPaint() {
				// Tmp canvas is always cleared up before drawing.
				tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
				
				var x = Math.min(mouse.x, start_mouse.x);
				var y = Math.min(mouse.y, start_mouse.y);
				var w = Math.abs(mouse.x - start_mouse.x);
				var h = Math.abs(mouse.y - start_mouse.y);
				
				drawEllipse(tmp_ctx, x, y, w, h);
			}
		}
	}).trigger( "change" );

	// // add color
	// var content = $('#color').val(); 
	// var c = $('#c');
	// c.html($(content));
	// $('#color').on('change', function() {
	// 	cntx.strokeStyle =  (this.value);
	// 	cntx.fillStyle = (this.value);
	// });

	// // background color of the canvas
	// $('#canvas').css('background-image','url("img/bgcanvas.png")');
	// var content = $('#bg_color').val(); 
	// var bgc = $('#bg_c');
	// bgc.html($(content));
	// $('#bg_color').on('change', function() {
	// 	$('#canvas').css('background-image','none');
	// 	$('#canvas').css('background-color',(this.value));
	// });

	//create the image of canvas
	var submit = document.getElementById("submit");
	submit.addEventListener("click",function() {
		$('#submitting').show();
		var dataURL = canvas.toDataURL();	// Default format is png
		// data = data.replace("image/png", "image /octet-stream");
		// document.location.href = data;
		dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
		var SN_Data = Parse.Object.extend("SN_Data");
		var sn_data = new SN_Data();
		var parseFile = new Parse.File(UserID+".png", {base64:dataURL});

		sn_data.set("UserID", UserID);
		sn_data.set("ip", "0");
		sn_data.set("image", parseFile);

		sn_data.save(null, {
			success: function(sn_data) {
				// Execute any logic that should take place after the object is saved.
				$('#submitting').hide();
				$("#post_submission").dialog("open");
			},
			error: function(sn_data, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and message.
				$('#submitting').hide();
				alert('提交出错，请检查您的网络连接后再试一次，若多次失败请联系我们。错误信息: ' + error.message);
			}
		});
	},false);

});
