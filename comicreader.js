//enable audio in the comic
var audio_enabled = true;
//the current language of the comic, will also be used the determine the language when you open the comic
var current_language = "nl";
//to save all the panels that already display their text
var textShown = [];
//mapping between panel and next panel
var nextPanels = {};
//mapping between panels and their audio tag
var audioPanels = {};

//zoom in on a given element of the document
function zoom(location, event) {
	event.stopPropagation();
	$(location).zoomTo();
}

//show all the characters layers from a given panel
//we zoom in on the panel if zoomed out
function showCharacterLayers(panel, event){
	$(panel + ' .character').show();
}

//show all balloon layers of a given panel
function showBalloonLayers(panel){
	$(panel + ' .balloon').show();
}

//show all effect layers of a given panel
function showEffectLayers(panel){
	$(panel + ' .effect').show();
}

//show all text layers of a given panel
function showTextLayers(panel){
	//if text already displayed, check for next panel or finish reading
	//we need to check this because else you actually need to click on the text to move on to the
	//next layer and now you can click anywhere on the panel to move to the next layer.
	//This is because the size of the div element containing text is as big as the text and not
	//as big as the panel (which is something we didn't found a solution for).
	if (textShown.indexOf(panel) > -1) {
		if (panel == lastPanel) {
			completePageRead(event);
		} else {
			showNextPanel(nextPanels[panel]);
		}
	} else {
		//we show the text of the panel in the current lanuage
		$(panel + ' .text_container').show();
		$(panel + ' .text_' + current_language).show();
		textShown.push(panel);
	}
}

//starting playing a given audio element
function playAudio(tag){
	document.getElementById(tag).play();
}

//show the next panel and play any audio if available
function showNextPanel(panel){
	$(panel + " .background").show();
	var background = panel + '_background';
	zoom(background, event);
	//<![CDATA[
	if ((panel in audioPanels) && audio_enabled) {
		playAudio(audioPanels[panel]);
	}
	//]]>
}

//change language of panel
function changeLanguagePanel(panel, language){
	$('div.text_obj > span[xml\\:lang=' + language + ']').show();
	$('div.text_obj > span[xml\\:lang!=' + language + ']').hide();
}

//change language of all panels to a given language
function changeLanguageAllPanels(language){
	if (current_language != language) {
		changeLanguagePanel(".panel", language);
		current_language=language;
	}
}

//when done reading you zoom out to view the full page
function completePageRead(event){
	zoom('body', event);
	textShown = [];
}

//to be used by the window onload function
function start(){
	//we show the first panel
	showNextPanel(firstPanel);
	//we hide all the fallback panels because scripting is enabled
	$(".panel_fallback").hide();
	$(window).click(function(evt) {
		if (evt.target == "[object HTMLHtmlElement]") {
			zoom('body', event);
			isZoomed = false;
		}
	});
}	
