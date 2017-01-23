Tag = {
	CTLCLS : 'tagctrl',
	TAGCLS : 'tag',
	TAGHOLE : 'taghole',
	attach : function(elm, cb, tags, cond) {
		var fout = false;
		var inp_out = $('<div></div>');
		var inp = $('<input type="text" placeholder="' + 
					((cond&&cond.placeholder) ? cond.placeholder : '') + '">');
		inp_out.append(inp);
		var inpwidth = function(v) {
			var def = (cond&&cond.placeholder) ? cond.placeholder.length : 4;
			var len = (v.length<def) ? def+1 : v.length+1;
			inp.css('width', (len*12) + 'pt');
		};
		var isMax = function() {
			var tags = elm.find('.' + Tag.TAGCLS);
			if (!cond||!cond.max);
			return (tags.length>=cond.max);
		};
		if (tags===undefined) tags = [];
		elm.html('');
		if (!elm.hasClass(Tag.CTLCLS)) {
			elm.addClass(Tag.CTLCLS);
		}
		if (cond!==undefined) {
			elm.on('click', function() {
				if (inp_out.parent().length==0) {
					elm.css('border', '1px solid #eee').append(inp_out);
					inpwidth('');
					inp.on('blur', function(e) {
						fout = true;
						window.setTimeout(function() {
							if (!fout) {
								inp.focus();
								return;
							}
							if (inp.val()!=='') push(e);
							blur(e);
						}, 300);
					}).keydown(function(e){
						if (e.which===8) {
							if (inp.val()==='') pop(e);
						}
						if (isMax()) {
							e.preventDefault(); 
							return false;
						}
						if (e.which===13) {
							if (inp.val()==='') blur(e);
							else push(e);
						}
					}).keypress(function(e){
						inpwidth(inp.val());
						if (cond&&cond.maxlen&&(inp.val().length>=cond.maxlen)) {
							inp.val(inp.val().substr(0,cond.maxlen));
							e.preventDefault(); 
							return false;
						}
					}).keyup(function(e){
						inpwidth(inp.val());
						if (cond&&cond.maxlen&&(inp.val().length>=cond.maxlen)) {
							inp.val(inp.val().substr(0,cond.maxlen));
							e.preventDefault(); 
							return false;
						}
					}).focus();
					tagmode(true);
				}
			}).click(function(e) {
				fout = false;
				e.preventDefault(); 
				return false;
			}).css('border', '1px solid #fff');
			var blur = function(e) {
				elm.css('border', '1px solid #fff');
				inp.val('');
				inp_out.remove();
				tagmode(false);
			};
			var pop = function() {
				var tags = elm.find('.' + Tag.TAGCLS);
				if (tags.length>0) {
					tags[tags.length-1].remove();
				}
			}
			var push = function() {
				inp_out.before(newtag(inp.val(), true));
				inp.val('');
			}
			var tagmode = function(edit) {
				var t = edit ? '×' : '';
				var hole = elm.find('.' + Tag.TAGHOLE);
				for ( var i=0; i<hole.length; i++ ) {
					$(hole[i]).html(t);
				}
			}
		}
		var newtag = function(n,edit) {
			var t = edit ? '×' : '';
			var elm =  $('<div class="' + Tag.TAGCLS + '" n="' + n + '"><div>' 
						+ n + '</div><div class="' + Tag.TAGHOLE + '">' + t + '</div></div>');
			elm.click(function(e) {
				fout = false;
				if (inp_out.parent().length===0) {
					cb($(e.currentTarget).attr('n'));
				} else {
					$(e.currentTarget).remove();
				}
				e.preventDefault(); 
				return false;
			});
			return elm;
		}
		for (var i in tags) {
			if (tags[i]) elm.append(newtag(tags[i]));
		}
		elm[0].tag = function() {
			var o = elm.find('.' + Tag.TAGCLS);
			var ret = [];
			for ( var i=0; i<o.length; i++ ) {
				ret.push($(o[i]).attr('n'));
			}
			return ret;
		};
	}
};
