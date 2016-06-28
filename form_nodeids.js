// ==UserScript==
// @name         Show node ids
// @namespace    http://procentive.com
// @version      0.3
// @description  Displays form's node ids and attempts to auto fill forms with those ids
// @author       Paul Lindquist
// @match        http://localhost:8082/trove_eclipse/treatment/edit.jsp*
// @match        https://app.procentive.com/treatment/edit.jsp*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @updateURL		https://github.com/paullindquist/procentive/blob/master/form_nodeids.js?raw=true
// @grant        none
// ==/UserScript==
/* jshint -W097 */

var styles =  '<style type="text/css">' +
'.box {' +
'  position: fixed;' +
'  top: 20px;' +
'  width: 300px;' +
'  margin: 0 auto;' +
'  -moz-box-shadow: 0 0.1em 0.5em rgba(0, 0, 0, 0.3), 0 0.1em 0.2em rgba(0, 0, 0, 0.4);' +
'  -webkit-box-shadow: 0 0.1em 0.5em rgba(0, 0, 0, 0.3), 0 0.1em 0.2em rgba(0, 0, 0, 0.4);' +
'  box-shadow: 0 0.1em 0.5em rgba(0, 0, 0, 0.3), 0 0.1em 0.2em rgba(0, 0, 0, 0.4);' +
'  -moz-border-radius: 0.35em;' +
'  -webkit-border-radius: 0.35em;' +
'  border-radius: 0.35em;' +
'  z-index: 9999' +
'}' +
'.box header,' +
'.box section {' +
'  padding: 0 1em;' +
'}' +
'.box header {' +
'  color: rgba(255, 255, 255, 0.85);' +
'  text-shadow: 0 -0.08em 0 #073d3d;' +
'  -moz-border-radius: 0.35em 0.35em 0 0;' +
'  -webkit-border-radius: 0.35em;' +
'  border-radius: 0.35em 0.35em 0 0;' +
'  border: 1px solid;' +
'  border-color: #199 #0e8282 #0c6b6b;' +
'  background-color: #199;' +
'  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzExOTk5OSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBjNmI2YiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==");' +
'  background-size: 100%;' +
'  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #119999), color-stop(100%, #0c6b6b));' +
'  background-image: -moz-linear-gradient(#119999, #0c6b6b);' +
'  background-image: -webkit-linear-gradient(#119999, #0c6b6b);' +
'  background-image: linear-gradient(#119999, #0c6b6b);' +
'  -moz-box-shadow: 0 0.1em 0.1em rgba(255, 255, 255, 0.3) inset;' +
'  -webkit-box-shadow: 0 0.1em 0.1em rgba(255, 255, 255, 0.3) inset;' +
'  box-shadow: 0 0.1em 0.1em rgba(255, 255, 255, 0.3) inset;' +
'}' +
'.box header h2 {' +
'  font-size: 1em;' +
'  line-height: 1.1;' +
'}' +
'.box section {' +
'  background-color: #fff;' +
'  border: 1px solid;' +
'  border-color: #ccc transparent transparent;' +
'}' +
'.box section p textarea {' +
' margin: 2em; ' +
'}' +
'.box section button {' +
'  margin: 1em; ' +
'}' +
'.box section:last-child {' +
'  -moz-border-radius: 0 0 0.35em 0.35em;' +
'  -webkit-border-radius: 0;' +
'  border-radius: 0 0 0.35em 0.35em;' +
'}' +
'.show-node-id {' +
'  border: solid thin red; ' +
'}' +
'.hide-node-id {' +
' display: none; ' +
'}' +
'</style>';
window.notFound = [];
$(document).ready(function() {
	var clickingDisabled = true;
	var showing = true;

	function handleDisplay(elm, id) {
		elm.toggleClass('show-node-id');
		if (elm.hasClass('show-node-id')) {
			elm.append('<div data-nodeid="' + id + '" style="font-weight:bold;color:blue"><span data-nodeid-after>' + id + '</span><br></div>');
		} else {
			elm.children('*[data-nodeid]').remove();
		}
	}

	$(window.frames[0].document.body).append(styles);
	$(document.getElementsByTagName('frame')[0].contentWindow.document).ready(function() {
		var frameBody = window.frames[0].document.body;
		$(frameBody).prepend(
'	 <aside class="box" data-control="">' +
'		<header>' +
'            <h2>Form nodes</h2>' +
'		</header>' +
'		<section>' +
'			<p>Auto-fill form with node ids<br>' +
'			Add to node id:' +
'			<input id="postfix" value=""><br/>' +
'			<button id="autofill">Auto fill</button>' +
'		</section>' +
'       <section>' +
'            <p>Enter CSV list of ids to highlight<br>' +
'            Ids not found will be shown in the console <button>Show ids</button>' +
'            <textarea id="nodeids"></textarea></p>' +
'        </section>' +
'        <section>' +
'            <p>Turn off/on "Click to show": <button id="disable">Enable</button><br>' +
'            Show/hide all: <button id="hideshow">Hide/Show</button></p>' +
'        </section>' +
'    </aside>');
		$(frameBody).find('[data-control]').draggable();


		$(frameBody).find('#disable').on('click', function(evt) {
			if (clickingDisabled) {
				$(this).text('Disable');
				clickingDisabled = false;
			} else {
				$(this).text('Enable');
				clickingDisabled = true;
			}
		});

		var textar = $(frameBody).find('#nodeids');
		$(textar).parent().find('button').on('click', function() {
			var vals = textar.val().split(',');
			vals.forEach(function(val, index, values) {
				var nodeElm =  $(frameBody).find('*[nodeid="' + val.trim() + '"]');
				if (nodeElm.length > 0) {
					handleDisplay(nodeElm, val);
				} else {
					notFound.push(val.trim());
					console.log("Didn't find: " + val.trim());
				}
			});
		});

		$(frameBody).find('#hideshow').on('click', function(evt) {
			$(frameBody).find('*[data-nodeid]').parent().toggleClass('show-node-id');
			$(frameBody).find('*[data-nodeid]').toggleClass('hide-node-id');
			if (showing) {
				$(this).text('Hide');
				showing = false;
			} else {
				$(this).text('Show');
				showing = true;
			}
		});
		$(frameBody).find('#autofill').on('click', function(evt) {
			var nodeid;
			var theForm = $(frameBody).find('#theform');
			var postfix = $(theForm).find('#postfix').val();
			$(theForm).find('option:last').attr('selected', 'selected');
			$(theForm).find('input[type="checkbox"]').trigger('click');
			$(theForm).find('input[type="radio"]').trigger('click');
			$(theForm).find('input[type="text"], textarea').each(
				function() {
					if ($(this).val().trim().length === 0) {
						nodeid = $(this).closest('[nodeid]').attr('nodeid');
						if (nodeid) {
							$(this).val(nodeid + postfix);
						}
					}
				}
			);
		});
		frameBody.addEventListener('click', function(evt) {
			var idIndex;
			var clickedOnId;
			var frameBody;
			var nodeElm;
			if (!clickingDisabled) {
				clickedOnId = $(evt.target).closest('[nodeid]').attr('nodeid');
				frameBody = $(window.frames[0].document.body);
				nodeElm =  $(frameBody).find('*[nodeid="' + clickedOnId + '"]');
				if (evt.target.nodeName.toLowerCase() !== 'textarea' && evt.target.nodeName.toLowerCase() !== 'button') {
					handleDisplay(nodeElm, clickedOnId);
				}
			}
		});
	});
});
