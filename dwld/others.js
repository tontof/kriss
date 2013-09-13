/*
  based on http://userscripts.org/scripts/review/130917 (GPL Licence)

    Copyright (C) 2010 - 2013 Sebastian Luncan
  
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
  
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
  
    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
    
    Website: http://isebaro.com/savetube
    Contact: http://isebaro.com/contact

  Modified by Tontof for KrISS dwld
  http://tontof.net/kriss/dwld
*/

(function() {


// ==========Variables========== //

// Userscript
var userscript = 'SaveTube';

// Page
var page = {win: window, doc: document, body: document.body, url: window.location.href};

// Saver
var saver = {};
var feature = {'definition': true, 'container': true, 'autoget': false};
var option = {'definition': 'HD', 'container': 'MP4', 'autoget': false};

// Links
var website = 'http://isebaro.com/savetube/?ln=en';
var contact = 'http://isebaro.com/contact/?ln=en&sb=savetube';


// ==========Fixes========== //

// Don't run on frames or iframes
if (window.top != window.self)  return;

 
// ==========Functions========== //

function createMyElement (type, content, event, action, target) {
  var obj = page.doc.createElement(type);
  if (content) {
    if (type == 'div') obj.innerHTML = content;
    else if (type == 'option') {
      obj.value = content;
      obj.innerHTML = content;
    }
  }
  if (event == 'change') {
    if (target == 'video') {
      obj.addEventListener ('change', function () {
      saver['videoSave'] = this.value;
      if (feature['autoget']) {
        if (option['autoget']) getMyVideo();
        }
        else {
          modifyMyElement (saver['buttonGet'] , 'div', 'Get', false);
          }
      }, false);
    }
  }
  else if (event == 'click') {
    obj.addEventListener ('click', function () {
      if (action == 'close') {
      removeMyElement(page.body, target);
      }
      else if (action == 'logo') {
      page.win.location.href = website;
      }
      else if (action == 'get') {
      getMyVideo();
      }
      else if (action == 'autoget') {
      option['autoget'] = (option['autoget']) ? false : true;
      if (option['autoget']) {
        styleMyElement (saver['buttonGet'], {display: 'none'});
          styleMyElement (saver['buttonAutoget'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
            getMyVideo();
            }
            else {
              styleMyElement (saver['buttonGet'], {display: 'inline'});
                styleMyElement (saver['buttonAutoget'], {color: '#CCCCCC', textShadow: '0px 0px 0px'});
                }
                setMyOptions ('savetube_autoget', option['autoget']);
      }
      else if (action == 'definition') {
      for (var itemDef = 0; itemDef < option['definitions'].length; itemDef++) {
        if (option['definitions'][itemDef].match(/[A-Z]/g).join('') == option['definition']) {
            var nextDef = (itemDef + 1 < option['definitions'].length) ? itemDef + 1 : 0;
                option['definition'] = option['definitions'][nextDef].match(/[A-Z]/g).join('');
                    break;
                      }
                      }
                      modifyMyElement (saver['buttonDefinition'], 'div', option['definition'], false);
                      setMyOptions ('savetube_definition', option['definition']);
                      modifyMyElement (saver['buttonGet'] , 'div', 'Get', false);
                      selectMyVideo ();
                      if (option['autoget']) getMyVideo();
      }
      else if (action == 'container') {
      for (var itemCont = 0; itemCont < option['containers'].length; itemCont++) {
        if (option['containers'][itemCont] == option['container']) {
            var nextCont = (itemCont + 1 < option['containers'].length) ? itemCont + 1 : 0;
                option['container'] = option['containers'][nextCont];
                    break;
                      }
                      }
                      modifyMyElement (saver['buttonContainer'], 'div', option['container'], false);
                      setMyOptions ('savetube_container', option['container']);
                      modifyMyElement (saver['buttonGet'] , 'div', 'Get', false);
                      selectMyVideo ();
                      if (option['autoget']) getMyVideo();
      }
    }, false);
  }
  return obj;
}

function getMyElement (obj, type, from, value, child, content) {
  var getObj, chObj, coObj;
  var pObj = (!obj) ? page.doc : obj;
  if (type == 'body') getObj = pObj.body;
  else {
    if (from == 'id') getObj = pObj.getElementById(value);
    else if (from == 'class') getObj = pObj.getElementsByClassName(value);
    else if (from == 'tag') getObj = pObj.getElementsByTagName(type);
    else if (from == 'ns') getObj = pObj.getElementsByTagNameNS(value, type);
  }
  chObj = (child >= 0) ? getObj[child] : getObj;
  if (content && chObj) {
    if (type == 'html' || type == 'body' || type == 'div' || type == 'option') coObj = chObj.innerHTML;
    else if (type == 'object') coObj = chObj.data;
    else coObj = chObj.textContent;
    return coObj;
  }
  else {
    return chObj;
  }
}

function modifyMyElement (obj, type, content, clear) {
  if (content) {
    if (type == 'div') obj.innerHTML = content;
    else if (type == 'option') {
      obj.value = content;
      obj.innerHTML = content;
    }
  }
  if (clear) {
    if (obj.hasChildNodes()) {
      while (obj.childNodes.length >= 1) {
        obj.removeChild(obj.firstChild);
      }
    }
  }
}

function styleMyElement (obj, styles) {
  for (var property in styles) {
    if (styles.hasOwnProperty(property)) obj.style[property] = styles[property];
  }
}

function appendMyElement (parent, child) {
  parent.appendChild(child);
}

function removeMyElement (parent, child) {
  parent.removeChild(child);
}

function replaceMyElement (parent, orphan, child) {
  parent.replaceChild(orphan, child);
}

function createMySaver () {
  /* Get My Options */
  getMyOptions ();
  
  /* Saver Settings */
  saver['panelHeight'] = 18;
  saver['panelPadding'] = 2;

  /* The Panel */
  var panelWidth = saver['saverWidth'] - saver['panelPadding'] * 2;
  saver['saverPanel'] = createMyElement ('div', '', '', '', '');
  styleMyElement (saver['saverPanel'], {position: 'relative', width: panelWidth + 'px', height: saver['panelHeight'] + 'px', display: 'block', padding: saver['panelPadding'] + 'px', backgroundColor: '#F4F4F4', fontSize: '10px', textAlign: 'center', zIndex: '99999'});
  appendMyElement (saver['saverSocket'], saver['saverPanel']);

  /* Warnings */
  if (saver['warnMess']) {
    if (saver['warnContent']) showMyMessage (saver['warnMess'], saver['warnContent']);
    else showMyMessage (saver['warnMess']);
    return;
  }
  
  /* Panel Items */
  var panelItemBorder = 1;
  var panelItemHeight = saver['panelHeight'] - panelItemBorder * 2;
  
  /* Panel Logo */
  saver['panelLogo'] = createMyElement ('div', userscript + ':', 'click', 'logo', '');
  styleMyElement (saver['panelLogo'], {height: panelItemHeight + 'px', border: '1px solid #F4F4F4', borderRadius: '3px', padding: '0px', display: 'inline', color: '#336699', fontSize: '10px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
  appendMyElement (saver['saverPanel'], saver['panelLogo']);

  /* Panel Video Menu */
  saver['videoMenu'] = createMyElement ('select', '', 'change', '', 'video');
  styleMyElement (saver['videoMenu'], {width: '200px', height: panelItemHeight + 'px', border: '1px solid #F4F4F4', borderRadius: '3px', padding: '0px', display: 'inline', backgroundColor: '#F4F4F4', color: '#336699', fontSize: '10px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement (saver['saverPanel'], saver['videoMenu'] );

  for (var videoCode in saver['videoList']) {
    saver['videoItem'] = createMyElement ('option', videoCode, '', '', '');
    styleMyElement (saver['videoItem'], {padding: '0px', display: 'block', backgroundColor: '#F4F4F4', color: '#336699', fontSize: '10px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement (saver['videoMenu'], saver['videoItem']);
  }

  /* Panel Get Button */
  saver['buttonGet'] = createMyElement ('div', 'Get', 'click', 'get', '');
  styleMyElement (saver['buttonGet'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C000C0', fontSize: '10px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
  if (option['autoget']) styleMyElement (saver['buttonGet'], {display: 'none'});
  appendMyElement (saver['saverPanel'], saver['buttonGet']);

  /* Panel Autoget Button */
  if (feature['autoget']) {
    saver['buttonAutoget'] = createMyElement ('div', 'Autoget', 'click', 'autoget', '');
    styleMyElement (saver['buttonAutoget'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '10px', cursor: 'pointer'});
    if (option['autoget']) styleMyElement (saver['buttonAutoget'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
    appendMyElement (saver['saverPanel'], saver['buttonAutoget']);
  }

  /* Panel Definition Button */
  if (feature['definition']) {
    saver['buttonDefinition'] = createMyElement ('div', option['definition'], 'click', 'definition', '');
    styleMyElement (saver['buttonDefinition'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '10px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement (saver['saverPanel'], saver['buttonDefinition']);
  }

  /* Panel Container Button */
  if (feature['container']) {
    saver['buttonContainer'] = createMyElement ('div', option['container'], 'click', 'container', '');
    styleMyElement (saver['buttonContainer'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '10px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement (saver['saverPanel'], saver['buttonContainer']);
  }

  /* Select The Video */
  if (feature['definition'] || feature['container']) selectMyVideo ();
 
 /* Get The Video On Autoget */
 if (option['autoget']) getMyVideo();
}

function selectMyVideo () {
  var vdoCont = (option['container'] != 'Any') ? [option['container']] : option['containers'];
  var vdoDef = option['definitions'];
  var vdoList = {};
  for (var vC = 0; vC < vdoCont.length; vC++) {
    if (vdoCont[vC] != 'Any') {
      for (var vD = 0; vD < vdoDef.length; vD++) {
      var format = vdoDef[vD] + ' ' + vdoCont[vC];
      if (!vdoList[vdoDef[vD]]) {
        for (var vL in saver['videoList']) {
            if (vL == format) {
                  vdoList[vdoDef[vD]] = vL;
                        break;
                            }
                              }
                              }
      }
    }
  }
  if (option['definition'] == 'UHD') {
    if (vdoList['Ultra High Definition']) saver['videoSave'] = vdoList['Ultra High Definition'];
    else if (vdoList['Full High Definition']) saver['videoSave'] = vdoList['Full High Definition'];
    else if (vdoList['High Definition']) saver['videoSave'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'FHD') {
    if (vdoList['Full High Definition']) saver['videoSave'] = vdoList['Full High Definition'];
    else if (vdoList['High Definition']) saver['videoSave'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'HD') {
    if (vdoList['High Definition']) saver['videoSave'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'SD') {
    if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'LD') {
    if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'VLD') {
    if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
  }
  saver['videoMenu'].value = saver['videoSave'];
}

function getMyVideo () {
  var vdoURL = saver['videoList'][saver['videoSave']];
  if (saver['videoTitle']) {
    var vdoD = ' (' + saver['videoSave'] + ')';
    vdoD = vdoD.replace(/Ultra High Definition/, 'UHD');
    vdoD = vdoD.replace(/Full High Definition/, 'FHD');
    vdoD = vdoD.replace(/High Definition/, 'HD');
    vdoD = vdoD.replace(/Standard Definition/, 'SD');
    vdoD = vdoD.replace(/Very Low Definition/, 'VLD');
    vdoD = vdoD.replace(/Low Definition/, 'LD');
    vdoD = vdoD.replace(/\sFLV|\sMP4|\sWebM|\s3GP/g, '');
    vdoURL = vdoURL + '&title=' + saver['videoTitle'] + vdoD;
  }
  if (feature['autoget']) page.win.location.href = vdoURL;
  else {
    var vdoLink = 'Get <a href="' + vdoURL + '">Link</a>';
    modifyMyElement (saver['buttonGet'] , 'div', vdoLink, false);
  }
}

function cleanMyContent (content, unesc) {
  var myNewContent = content;
  if (unesc) myNewContent = unescape (myNewContent);
  myNewContent = myNewContent.replace (/\\u0025/g,'%');
  myNewContent = myNewContent.replace (/\\u0026/g,'&');
  myNewContent = myNewContent.replace (/\\/g,'');
  myNewContent = myNewContent.replace (/\n/g,'');
  return myNewContent;
}

function getMyContent (url, pattern, clean) {
  var myPageContent, myVideosParse, myVideosContent;
  var isIE = (navigator.appName.indexOf('Internet Explorer') != -1) ? true : false;
  var getMethod = (url != page.url || isIE) ? 'XHR' : 'DOM';
  if (getMethod == 'DOM') {
    myPageContent = getMyElement ('', 'html', 'tag', '', 0, true);
    if (!myPageContent) myPageContent = getMyElement ('', 'body', '', '', -1, true);
    if (clean) myPageContent = cleanMyContent (myPageContent, true);
    myVideosParse = myPageContent.match (pattern);
    myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    if (myVideosContent) return myVideosContent;
    else getMethod = 'XHR';
  }
  if (getMethod == 'XHR') {
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, false);
    xmlHTTP.send();
    if (pattern == 'XML') {
      myVideosContent = xmlHTTP.responseXML;
    }
    else if (pattern == 'TEXT') {
      myVideosContent = xmlHTTP.responseText;
    }
    else {
      myPageContent = xmlHTTP.responseText;
      if (clean) myPageContent = cleanMyContent (myPageContent, true);
      myVideosParse = myPageContent.match (pattern);
      myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    }
    return myVideosContent;
  }
}

function setMyOptions (key, value) {
  try {
    localStorage.setItem(key, value);
  }
  catch(e) {
    var date = new Date();
    date.setTime(date.getTime() + (356*24*60*60*1000));
    var expires = '; expires=' + date.toGMTString();
    page.doc.cookie = key + '=' + value + expires + '; path=/';
  }
}

function getMyOptions () {
  var stAutoget = 'savetube_autoget';
  var stDefinition = 'savetube_definition';
  var stContainer = 'savetube_container';
  try {
    if (localStorage.getItem(stAutoget)) option['autoget'] = localStorage.getItem(stAutoget);
    if (localStorage.getItem(stDefinition)) option['definition'] = localStorage.getItem(stDefinition);
    if (localStorage.getItem(stContainer)) option['container'] = localStorage.getItem(stContainer);
  }
  catch(e) {
    var cookies = page.doc.cookie.split(';');
    for (var i=0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(stAutoget) == 0) option['autoget'] = cookie.substring(stAutoget.length + 1, cookie.length);
      if (cookie.indexOf(stDefinition) == 0) option['definition'] = cookie.substring(stDefinition.length + 1, cookie.length);
      if (cookie.indexOf(stContainer) == 0) option['container'] = cookie.substring(stContainer.length + 1, cookie.length);
    }
  }
  option['autoget'] = (option['autoget'] == 'true') ? true : false;
}

function showMyMessage (cause, content) {
  var myScriptLogo = createMyElement ('div', userscript, '', '', '');
  styleMyElement (myScriptLogo, {margin: '0px auto', padding: '10px', color: '#666666', fontSize: '24px', textAlign: 'center', textShadow: '#FFFFFF -1px -1px 2px'});
  var myScriptMess = createMyElement ('div', '', '', '', '');
  styleMyElement (myScriptMess, {border: '1px solid #F4F4F4', margin: '5px auto 5px auto', padding: '10px', backgroundColor: '#FFFFFF', color: '#AD0000', textAlign: 'center'});
  if (cause == '!player') {
    var myScriptAlert = createMyElement ('div', '', '', '', '');
    styleMyElement (myScriptAlert, {position: 'absolute', top: '30%', left: '35%', border: '1px solid #F4F4F4', borderRadius: '3px', padding: '10px', backgroundColor: '#F8F8F8', fontSize: '14px', textAlign: 'center', zIndex: '99999'});
    appendMyElement (myScriptAlert, myScriptLogo);
    var myNoPlayerMess = 'Couldn\'t get the player element. Please report it <a href="' + contact + '">here</a>.';
    modifyMyElement (myScriptMess, 'div', myNoPlayerMess, false);
    appendMyElement (myScriptAlert, myScriptMess);
    var myScriptAlertButton = createMyElement ('div', 'OK', 'click', 'close', myScriptAlert);
    styleMyElement (myScriptAlertButton, {width: '100px', border: '3px solid #EEEEEE', borderRadius: '5px', margin: '0px auto', backgroundColor: '#EEEEEE', color: '#666666', fontSize: '18px', textAlign: 'center', textShadow: '#FFFFFF -1px -1px 2px', cursor: 'pointer'});
    appendMyElement (myScriptAlert, myScriptAlertButton);
    appendMyElement (page.body, myScriptAlert);
  }
  else {
    styleMyElement (saver['saverPanel'], {color: '#AD0000'});
    if (cause == '!content') {
      var myNoContentMess = '<b>SaveTube:</b> Couldn\'t get the videos content. Please report it <a href="' + contact + '">here</a>.';
      modifyMyElement (saver['saverPanel'], 'div', myNoContentMess, false);
    }
    else if (cause == '!videos') {
      var myNoVideosMess = '<b>SaveTube:</b> Couldn\'t get any video. Please report it <a href="' + contact + '">here</a>.';
      modifyMyElement (saver['saverPanel'], 'div', myNoVideosMess, false);
    }
    else if (cause == '!support') {
      var myNoSupportMess = '<b>SaveTube:</b> This video uses the RTMP protocol which is not supported.';
      modifyMyElement (saver['saverPanel'], 'div', myNoSupportMess, false);
    }
    else if (cause == 'embed') {
      var myEmbedMess = '<b>SaveTube:</b> This is an embedded video. You can get it <a href="' + content + '">here</a>.';
      modifyMyElement (saver['saverPanel'], 'div', myEmbedMess, false);
    }
  }
}


// ==========Websites========== //

// =====YouTube===== //

if (page.url.indexOf('youtube.com/watch') != -1) {

  /* Get Player Window */
  var ytFeatherBeta;
  var ytPlayerWindow = getMyElement ('', 'div', 'id', 'player', -1, false);
  if (!ytPlayerWindow) {
    ytPlayerWindow = getMyElement ('', 'div', 'id', 'p', -1, false);
    if (ytPlayerWindow) styleMyElement (ytPlayerWindow, {margin: '0px 0px 30px 0px'});
    ytFeatherBeta = true;
  }

  if (!ytPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Video Title */
    if (ytFeatherBeta) {
      var ytVideoTitle = page.doc.title;
    }
    else {
      var ytVideoTitle = getMyContent (page.url, 'meta\\s+itemprop="name"\\s+content="(.*?)"', false);
      if (!ytVideoTitle) ytVideoTitle = getMyContent (page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
      if (!ytVideoTitle) ytVideoTitle = page.doc.title;
    }
    if (ytVideoTitle) {
      ytVideoTitle = ytVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
      ytVideoTitle = ytVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
      ytVideoTitle = ytVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
      ytVideoTitle = ytVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
      ytVideoTitle = ytVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
      ytVideoTitle = ytVideoTitle.replace(/^YouTube\s-\s/, '');
    }

    /* Get Videos Content */
    if (ytFeatherBeta) {
      var ytVideosContent = getMyContent (page.url, 'url_encoded_fmt_stream_map=(.*?)=', false);
      if (ytVideosContent) ytVideosContent = cleanMyContent (ytVideosContent, true);
    }
    else {
      var ytVideosContent = getMyContent (page.url, '"url_encoded_fmt_stream_map":\\s+"(.*?)"', false);
      if (ytVideosContent) ytVideosContent = cleanMyContent (ytVideosContent, false);
    }

    /* Get Videos */
    if (ytVideosContent) {
      ytVideosContent = cleanMyContent (ytVideosContent, false);
      var ytVideoFormats = {
      '5': 'Very Low Definition FLV',
      '17': 'Very Low Definition 3GP',
      '18': 'Low Definition MP4',
      '22': 'High Definition MP4',
      '34': 'Low Definition FLV',
      '35': 'Standard Definition FLV',
      '36': 'Low Definition 3GP',
      '37': 'Full High Definition MP4',
      '38': 'Ultra High Definition MP4',
      '43': 'Low Definition WebM',
      '44': 'Standard Definition WebM',
      '45': 'High Definition WebM',
      '46': 'Full High Definition WebM',
      '82': 'Low Definition 3D MP4',
      '83': 'Standard Definition 3D MP4',
      '84': 'High Definition 3D MP4',
      '85': 'Full High Definition 3D MP4',
      '100': 'Low Definition 3D WebM',
      '101': 'Standard Definition 3D WebM',
      '102': 'High Definition 3D WebM'
      };
      var ytVideoList = {};
      var ytVideoFound = false;
      var ytVideos = ytVideosContent.split(',');
      var ytVideoParse, ytVideoCodeParse, ytVideoCode, myVideoCode, ytVideo;
      for (var i = 0; i < ytVideos.length; i++) {
      if (!ytVideos[i].match(/^url/)) {
        ytVideoParse = ytVideos[i].match(/(.*)(url=.*$)/);
          if (ytVideoParse) ytVideos[i] = ytVideoParse[2] + '&' + ytVideoParse[1];
          }
          ytVideoCodeParse = ytVideos[i].match (/itag=(\d{1,3})/);
          ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
          if (ytVideoCode) {
            myVideoCode = ytVideoFormats[ytVideoCode];
              if (myVideoCode) {
                  ytVideo = ytVideos[i].replace (/url=/, '').replace(/&$/, '').replace(/&itag=\d{1,3}/, '');
                      if (ytVideo.match(/type=.*?&/)) ytVideo = ytVideo.replace(/type=.*?&/, '');
                          else ytVideo = ytVideo.replace(/&type=.*$/, '');
                              if (ytVideo.match(/&sig=/)) ytVideo = ytVideo.replace (/&sig=/, '&signature=');
                                  else {
                                        var ytSig = ytVideo.match(/&s=(.*?)(&|$)/);
                                              if (ytSig) {
                                                 var s = ytSig[1].split('');
                                                     s = s[73] + s.slice(74, 81).reverse().join('') + s[35] + s.slice(59, 73).reverse().join('') +
                                                           s[0] + s.slice(36, 58).reverse().join('') + s[85] + s.slice(1, 35).reverse().join('');
                                                                ytVideo = ytVideo.replace(/&s=.*?(&|$)/, '&signature=' + s + '$1');
                                                                      }
                                                                            else ytVideo = '';
                                                                                }
                                                                                    ytVideo = cleanMyContent (ytVideo, true);
                                                                                        if (ytVideo && ytVideo.indexOf('http') == 0) {
                                                                                              if (!ytVideoFound) ytVideoFound = true;
                                                                                                    ytVideoList[myVideoCode] = ytVideo;
                                                                                                        }
                                                                                                          }
                                                                                                          }
      }
        
      if (ytVideoFound) {
      /* Create Saver */
      var ytDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': ytPlayerWindow, 'videoList': ytVideoList, 'videoSave': ytDefaultVideo, 'videoTitle': ytVideoTitle, 'saverWidth': 640};
      feature['autoget'] = true;
      option['definitions'] = ['Ultra High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4', 'WebM', 'FLV', '3GP', 'Any'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': ytPlayerWindow, 'saverWidth': 640};
      if (ytVideosContent.indexOf('conn=rtmp') != -1) saver['warnMess'] = '!support';
      else saver['warnMess'] = '!videos';
      createMySaver ();
      }
    }
    else {
      var ytVideoAvailable = getMyElement ('', 'div', 'id', 'player-unavailable', -1, false);
      if (ytVideoAvailable && ytVideoAvailable.className.indexOf('hid') == -1) return;
      else {
      saver = {'saverSocket': ytPlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
      createMySaver ();
      }
    }
  }

}

// =====DailyMotion===== //

else if (page.url.indexOf('dailymotion.com/video') != -1) {

  /* Get Player Window */
  var dmPlayerWindow = getMyElement ('', 'div', 'id', 'player_main', -1, false);
  if (!dmPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Restyle Player Window */
    styleMyElement (dmPlayerWindow, {margin: '0px 0px 20px 0px'});

    /* Get Videos Content */
    var dmEmbed = page.url.replace(/\/video\//, "/embed/video/");
    dmVideosContent = getMyContent (dmEmbed, 'info\\s+=\\s+\\{(.*?)\\}', false);

    /* Get Videos */
    if (dmVideosContent) {
      var dmVideoFormats = {'stream_h264_hd1080_url': 'Full High Definition MP4', 'stream_h264_hd_url': 'High Definition MP4',
        'stream_h264_hq_url': 'Standard Definition MP4', 'stream_h264_url': 'Low Definition MP4', 'stream_h264_ld_url': 'Very Low Definition MP4'};
      var dmVideoList = {};
      var dmVideoFound = false;
      var dmVideoParser, dmVideoParse, myVideoCode, dmVideo;
      for (var dmVideoCode in dmVideoFormats) {
      dmVideoParser = '"' + dmVideoCode + '":"(.*?)"';
      dmVideoParse = dmVideosContent.match (dmVideoParser);
      dmVideo = (dmVideoParse) ? dmVideoParse[1] : null;
      if (dmVideo) {
        if (!dmVideoFound) dmVideoFound = true;
          dmVideo = cleanMyContent(dmVideo, true);
            myVideoCode = dmVideoFormats[dmVideoCode];
              if (!dmVideoList[myVideoCode]) dmVideoList[myVideoCode] = dmVideo;
              }
      }
      
      if (dmVideoFound) {
      /* Create Saver */
      var dmDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': dmPlayerWindow, 'videoList': dmVideoList, 'videoSave': dmDefaultVideo, 'saverWidth': 620};
      feature['container'] = false;
      option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': dmPlayerWindow, 'saverWidth': 620, 'warnMess': '!videos'};
      createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': dmPlayerWindow, 'saverWidth': 620, 'warnMess': '!content'};
      createMySaver ();
    }
  }
  
}

// =====Vimeo===== //

else if (page.url.match(/vimeo.com($|\/$|\/\d{1,8})/)) {

  /* Get Player Window */
  var viPlayerWindow = getMyElement ('', 'div', 'class', 'vimeo_holder', 0, false) || null;
  if (!viPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Restyle Player Window */
    styleMyElement (viPlayerWindow, {margin: '0px 0px 20px 0px'});

    /* Get Videos Content */
    var viVideosContent = getMyContent (page.url, 'config:\\{([\\s\\S]*?)\\}\\};', false);

    /* Get Videos */
    if (viVideosContent) {
      var viVideoFormats = {'hd': 'High Definition MP4', 'sd': 'Low Definition MP4', 'mobile': 'Very Low Definition MP4'};
      var viVideoList = {};
      var viVideoFound = false;
      var viVideoSignature, viVideoTimestamp, viVideoID, viVideoQualities, viVideo, myVideoCode;
      viVideoSignature = viVideosContent.match (/"signature":"(.*?)"/);
      viVideoSignature = (viVideoSignature) ? viVideoSignature[1] : null;
      viVideoTimestamp = viVideosContent.match (/"timestamp":(.*?),/);
      viVideoTimestamp = (viVideoTimestamp) ? viVideoTimestamp[1] : null;
      viVideoPlayer = viVideosContent.match (/"player_url":"(.*?)"/);
      viVideoPlayer = (viVideoPlayer) ? viVideoPlayer[1] : null;
      viVideoID = viVideosContent.match (/"video":\{"id":(.*?),/);
      viVideoID = (viVideoID) ? viVideoID[1] : null;
      viVideoQualities = viVideosContent.match (/"qualities":\[(.*?)\]/);
      viVideoQualities = (viVideoQualities) ? viVideoQualities[1] : null;
      if (viVideoSignature && viVideoTimestamp && viVideoID && viVideoPlayer && viVideoQualities) {
      for (var viVideoCode in viVideoFormats) {
        if (viVideoQualities.indexOf(viVideoCode) != -1) {
            if (!viVideoFound) viVideoFound = true;
                viVideo = 'http://' + viVideoPlayer + '/play_redirect?' + 'quality=' + viVideoCode + '&clip_id=' + viVideoID + '&time=' + viVideoTimestamp + '&sig=' + viVideoSignature;
                    myVideoCode = viVideoFormats[viVideoCode];
                        viVideoList[myVideoCode] = viVideo;
                          }
                          }
      }
      
      if (viVideoFound) {
      /* Create Saver */
      var viDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': viPlayerWindow, 'videoList': viVideoList, 'videoSave': viDefaultVideo, 'saverWidth': 960};
      feature['container'] = false;
      option['definitions'] = ['High Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': viPlayerWindow, 'saverWidth': 960, 'warnMess': '!videos'};
      createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': viPlayerWindow, 'saverWidth': 960, 'warnMess': '!content'};
      createMySaver ();
    } 
  }
  
}

// =====MetaCafe===== //

else if (page.url.indexOf('metacafe.com/watch') != -1) {

  /* Get Player Window */
  var mcPlayerWindow = getMyElement ('', 'div', 'id', 'FlashWrap', -1, false);
  if (!mcPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Check Video Availability */
    var mcVideoAvailable = getMyElement ('', 'div', 'id', 'FlashWrap', -1, true);
    if (mcVideoAvailable.indexOf('This Video cannot be played on this device.') != -1) return;
    
    /* Restyle Player Window */
    styleMyElement (mcPlayerWindow, {margin: '0px 0px 30px 0px'});
    
    /* Get Videos Content */
    var mcVideosContent, mcVideoH5;
    var mcFlashVideo = getMyElement (mcPlayerWindow, 'embed', 'tag', '', 0, false) || getMyElement (mcPlayerWindow, 'object', 'tag', '', 0, false);
    if (mcFlashVideo) mcVideosContent = getMyContent (page.url, '"mediaData":"(.*?)"', false);
    else mcVideoH5 = getMyContent (page.url, 'video\\s+src="(.*?)"', false);

    /* Get Videos */
    if (mcVideosContent || mcVideoH5) {
      var mcVideoList = {};
      var mcVideoFound = false;
      if (mcVideosContent) {
      mcVideosContent = cleanMyContent(mcVideosContent, true);
      var mcVideoFormats = {'highDefinitionMP4': 'High Definition MP4', 'MP4': 'Low Definition MP4', 'flv': 'Low Definition FLV'};
      var mcVideoParser, mcVideoParse, myVideoCode, mcVideoPath, mcVideoKey, mcVideo;
      for (var mcVideoCode in mcVideoFormats) {
        mcVideoParser = '"' + mcVideoCode + '":\\{.*?"mediaURL":"(.*?)","access":\\[\\{"key":"(.*?)","value":"(.*?)"\\}\\]\\}';
          mcVideoParse = mcVideosContent.match (mcVideoParser);
            mcVideoPath = (mcVideoParse) ? mcVideoParse[1] : null;
              mcVideoKeyName = (mcVideoParse) ? mcVideoParse[2] : null;
                mcVideoKeyValue = (mcVideoParse) ? mcVideoParse[3] : null;
                  if (mcVideoPath && mcVideoKeyName && mcVideoKeyValue) {
                      if (!mcVideoFound) mcVideoFound = true;
                          myVideoCode = mcVideoFormats[mcVideoCode];
                              mcVideo = mcVideoPath + '?' + mcVideoKeyName + '=' + mcVideoKeyValue;
                                  mcVideoList[myVideoCode] = mcVideo;
                                    }
                                    }
      }
      else {
      mcVideoList['Low Definition MP4'] = mcVideoH5;
      mcVideoFound = true;
      feature['definition'] = false;
      feature['container'] = false;
      }

      if (mcVideoFound) {
      /* Create Saver */
      var mcDefaultVideo = (mcVideoList['Low Definition MP4']) ? 'Low Definition MP4' : 'Low Definition FLV';
      saver = {'saverSocket': mcPlayerWindow, 'videoList': mcVideoList, 'videoSave': mcDefaultVideo, 'saverWidth': 640};
      option['definitions'] = ['High Definition', 'Low Definition'];
      option['containers'] = ['MP4', 'FLV', 'Any'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': mcPlayerWindow, 'saverWidth': 640, 'warnMess': '!videos'};
      createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': mcPlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
      createMySaver ();
    }
  }
  
}

// =====Break===== //

else if (page.url.indexOf('break.com/video') != -1) {

  /* Get Player Window */
  var brPlayerWindow = getMyElement ('', 'div', 'id', 'video-player', -1, false);
  if (!brPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Saver Width */
    var brWindowWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
    var brSaverWidth;
    if (brWindowWidth > 1400) brSaverWidth = 832;
    else brSaverWidth = 592;

    /* Get Video ID */
    var brVideoID = page.url.match(/(\d+)$/);
    brVideoID = (brVideoID) ? brVideoID[1] : null;

    /* Get Videos Content */
    var brHost = page.url.match(/(^.*?break.com)/);
    brHost = (brHost) ? brHost[1] : 'http://www.break.com';
    var brSource = brHost + '/embed/' + brVideoID;
    var brVideosContent = getMyContent (brSource, 'TEXT', false);
 
    /* Get Videos */
    if (brVideosContent) {
      var brVideoList = {};
      var brVideoFormats = {};
      var brVideoFound = false;
      var brVideoPath, brVideoToken, brVideoThumb, brVideo, brCodeCheck, myVideoCode;
      brVideoPath = brVideosContent.match (/"videoUri":\s"(.*?)"/);
      brVideoPath = (brVideoPath) ? brVideoPath[1] : null;
      if (brVideoPath) {
      if (brVideoPath.match(/.wmv$/)) {
        brVideoFormats = {'.flv': 'Low Definition FLV', '.mp4': 'Low Definition MP4'};
          brVideoPath = brVideoPath.replace(/.wmv$/, '');
          }
          else if (brVideoPath.match(/.flv$/)) {
            brVideoFormats = {'6.mp4': 'Very Low Definition MP4', '1.flv': 'Low Definition FLV', '1.mp4': 'Low Definition MP4', '2.mp4': 'Standard Definition MP4', '3.mp4': 'High Definition MP4'};
              brVideoPath = brVideoPath.replace(/1.flv$/, '');
              }
              else if (brVideoPath.match(/.mp4$/)) {
                brVideoFormats = {'240.mp4': 'Very Low Definition MP4', '360.mp4': 'Low Definition MP4', '480.mp4': 'Standard Definition MP4', '720.mp4': 'High Definition MP4',};
                  brVideoPath = brVideoPath.replace(/360.mp4$/, '');
                  }
                  else brVideoPath = null;
      }
      brVideoToken = brVideosContent.match (/"AuthToken":\s"(.*?)"/);
      brVideoToken = (brVideoToken) ? brVideoToken[1] : null;
      if (brVideoPath && brVideoToken) {
      for (var brVideoCode in brVideoFormats) {
        brCodeCheck = brVideoCode.replace(/\.(flv|mp4)$/, '');
          if (brVideosContent.match(brVideoPath + brCodeCheck)) {
              if (!brVideoFound) brVideoFound = true;
                  myVideoCode = brVideoFormats[brVideoCode];
                      brVideo = brVideoPath + brVideoCode + '?' + brVideoToken;
                          brVideoList[myVideoCode] = brVideo;
                            }
                            }
      }
 
      if (brVideoFound) {
      /* Create Saver */
      var brDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': brPlayerWindow, 'videoList': brVideoList, 'videoSave': brDefaultVideo, 'saverWidth': brSaverWidth};
      option['definitions'] = ['Very Low Definition', 'Low Definition', 'Standard Definition', 'High Definition'];
      option['containers'] = ['MP4', 'FLV', 'Any'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': brPlayerWindow, 'saverWidth': brSaverWidth};
      var ytVideoId =  brVideosContent.match (/"youtubeId":\s"(.*?)"/);
      if (ytVideoId) {
        var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId[1];
          saver['warnMess'] = 'embed';
            saver['warnContent'] = ytVideoLink;
            }
            else saver['warnMess'] = '!videos';
            createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': brPlayerWindow, 'saverWidth': brSaverWidth, 'warnMess': '!content'};
      createMySaver ();
    }
  }
  
}

// =====FunnyOrDie===== //

else if (page.url.indexOf('funnyordie.com/videos') != -1) {

  /* Get Player Window */
  var fodPlayerWindow = getMyElement ('', 'div', 'class', 'video_player_box', 0, false);
  if (!fodPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var fodVideosContent = getMyContent (page.url, 'video_tag\\s+=\\s+\\$\\((.*?)\\);', false);

    /* Get Videos */
    if (fodVideosContent) {
      var fodVideoFormats = {'2500': 'High Definition MP4', '1800': 'Standard Definition MP4', '600': 'Low Definition MP4', '110': 'Very Low Definition MP4'};
      var fodVideoList = {};
      var fodVideoFound = false;
      var fodVideoCodes, fodVideoCodesFound, fodVideoSources, fodVideoParser, fodVideoPath, fodVideoSrc, fodVideo, myVideoCode;
      fodVideoCodes = fodVideosContent.match (/v,(.*?),\./);
      fodVideoCodes = (fodVideoCodes) ? fodVideoCodes[1] : '';
      fodVideoCodesFound = (fodVideoCodes) ? true : false;
      fodVideoSources = fodVideosContent.match (/src=".*?"/g);
      if (fodVideoSources) {
      for (var fodV = 0; fodV < fodVideoSources.length; fodV++) {
        fodVideoSrc = fodVideoSources[fodV];
          fodVideoParser = fodVideoSrc.match (/(http.*?)v(\d+)\.mp4/);
            if (!fodVideoPath) fodVideoPath = (fodVideoParser) ? fodVideoParser[1] : null;
              if (!fodVideoCodesFound) {
                  if (fodVideoParser) fodVideoCodes += fodVideoParser[2] + ',';
                    }
                    }
      }
      if (fodVideoCodes && fodVideoPath) {
      for (var fodVideoCode in fodVideoFormats) {
        if (fodVideoCodes.indexOf(fodVideoCode) != -1) {
            if (!fodVideoFound) fodVideoFound = true;
                fodVideo = fodVideoPath + 'v' + fodVideoCode + '.mp4';
                    myVideoCode = fodVideoFormats[fodVideoCode];
                        fodVideoList[myVideoCode] = fodVideo;
                          }
                          }
      }

      if (fodVideoFound) {
      /* Create Saver */
      fodDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': fodPlayerWindow, 'videoList': fodVideoList, 'videoSave': fodDefaultVideo, 'saverWidth': 640};
      feature['container'] = false;
      option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': fodPlayerWindow, 'saverWidth': 640, 'warnMess': '!videos'};
      createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': fodPlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
      createMySaver ();
    } 
  }
  
}

// =====Videojug===== //

else if (page.url.indexOf('videojug.com/film') != -1) {

  /* Get Player Window */
  var vjPlayerWindow = getMyElement ('', 'div', 'id', 'player', -1, false);
  if (!vjPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var vjVideosContent = getMyContent (page.url, 'new\\s+Player\\((.*?)\\)', true);

    /* Get Videos */
    if (vjVideosContent) {
      vjVideosContent = vjVideosContent.replace(/'/g, '').replace(/\s/g, '');
      var vjVideosParts = vjVideosContent.split(',');
      var vjVideoToken = vjVideosParts[3];
      var vjVideoToken2 = vjVideoToken.substring(0,2);
      var vjVideoTitle = vjVideosParts[7];
      var vjVideoFormats = {'VJ480PENG.mp4': 'Standard Definition MP4', 'VJ360PENG.mp4': 'Low Definition MP4', 'PHOENG.mp4': 'Very Low Definition MP4', 'FW8ENG.flv': 'Low Definition FLV', 'FS8ENG.flv': 'Very Low Definition FLV'};
      var vjVideoList = {};
      var vjVideoFound = false;
      var vjVideoPart, vjVideoHost, myVideoCode, vjVideo;
      if (vjVideoToken && vjVideoTitle) {
      vjVideoFound = true;
      vjVideoPart = vjVideoToken2 + '/' + vjVideoToken + '/' + vjVideoTitle;
      for (var vjVideoCode in vjVideoFormats) {
        if (vjVideoCode == 'FS8ENG.flv') vjVideoHost = 'http://content.videojug.com/';
          else vjVideoHost = 'http://content3.videojug.com/';
            vjVideo =  vjVideoHost + vjVideoPart + '__' + vjVideoCode;
              myVideoCode = vjVideoFormats[vjVideoCode];
                vjVideoList[myVideoCode] = vjVideo;
                }
      }
      
      if (vjVideoFound) {
      /* Create Saver */
      var vjDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': vjPlayerWindow, 'videoList': vjVideoList, 'videoSave': vjDefaultVideo, 'saverWidth': 640};
      option['definition'] = 'SD';
      option['definitions'] = ['Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4', 'FLV', 'Any'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': vjPlayerWindow, 'saverWidth': 640, 'warnMess': '!videos'};
      createMySaver ();
      }
    }
    else {
    saver = {'saverSocket': vjPlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
    createMySaver ();
    }
  }
  
}

// =====Mevio===== //

else if (page.url.indexOf('mevio.com') != -1) {

  /* Get Player Window */
  var mePlayerWindow = getMyElement ('', 'div', 'id', 'player-zone', -1, false);
  if (!mePlayerWindow) {
      //showMyMessage ('!player');
  }
  else {
    /* My Saver Socket */
    var meSaverSocket = createMyElement ('div', '', '', '', '');
    styleMyElement (meSaverSocket, {width: '915px', textAlign: 'center', paddingTop: '20px', margin: '0px auto'});
    appendMyElement (mePlayerWindow, meSaverSocket);
    
    /* Get Data Content */
    var meDataContent = getMyContent (page.url, 'args.default_media\\s+=\\s+\\{(.*?)\\};', false);
    meDataContent = cleanMyContent (meDataContent, true);

    /* Get Videos Content */
    var meVideosContent = meDataContent.match(/"media_urls":\{(.*?)\}/);
    meVideosContent = (meVideosContent) ? meVideosContent[1] : null;

    /* Get Videos */
    if (meVideosContent) {
      var meVideoFormats = {'mp4': 'High Definition MP4', 'm4v': 'High Definition M4V',  'mov': 'High Definition MOV', 'h264': 'Low Definition MP4', 'flv': 'Low Definition FLV'};
      var meVideoList = {};
      var meVideoFound = false;
      var meVideoParser, meVideoParse, meVideo, myVideoCode;
      for (var meVideoCode in meVideoFormats) {
      meVideoParser = meVideoCode + '":"(.*?)"';
      meVideoParse = meVideosContent.match (meVideoParser);
      meVideo = (meVideoParse) ? meVideoParse[1] : null;
      if (meVideo) {
        if (!meVideoFound) meVideoFound = true;
          myVideoCode = meVideoFormats[meVideoCode];
            meVideoList[myVideoCode] = meVideo;
            }
      }

      if (meVideoFound) {
      /* Create Saver */
      var meDefaultVideo = 'Low Definition FLV';
      saver = {'saverSocket': meSaverSocket, 'videoList': meVideoList, 'videoSave': meDefaultVideo, 'saverWidth': 915};
      option['definitions'] = ['High Definition', 'Low Definition'];
      option['containers'] = ['MP4', 'M4V', 'MOV', 'FLV', 'Any'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': mePlayerWindow, 'saverWidth': 915, 'warnMess': '!videos'};
      createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': mePlayerWindow, 'saverWidth': 915, 'warnMess': '!content'};
      createMySaver ();
    }
  }
  
}

// =====Blip===== //

else if (page.url.indexOf('blip.tv') != -1) {

  /* Get Page Type */
  var blipPageType = getMyContent (page.url, 'meta.*?property="og:type".*?content="(.*?)"', false);
  if (!blipPageType || blipPageType != 'video.episode') return;
  
  /* Get Player Window */
  var blipSaverWidth;
  var blipPlayerWindow = getMyElement ('', 'div', 'class', 'Theater', 0, false) || getMyElement ('', 'div', 'id', 'ErrorWrap', -1, false);
  if (!blipPlayerWindow) {
    blipPlayerWindow = getMyElement ('', 'div', 'id', 'PlayerEmbed', -1, false);
    blipSaverWidth = 596;
  }
  else {
    blipSaverWidth = 960;
  }  
  if (!blipPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* My Saver Socket */
    var blipSaverSocket = createMyElement ('div', '', '', '', '');
    styleMyElement (blipSaverSocket, {width: blipSaverWidth + 'px', textAlign: 'center', margin: '0px auto'});
    appendMyElement (blipPlayerWindow, blipSaverSocket);

    /* Get Videos Content */
    var blipVideosContent = getMyContent(page.url + '?skin=json', '"additionalMedia":\\[(.*?)\\]', false);

    /* Get Videos */
    if (blipVideosContent) {
      var blipVideoList = {};
      var blipVideoFound = false;
      var blipMimeTypes = {'video/x-m4v': 'M4V', 'video/quicktime': 'MOV', 'video/mp4': 'MP4', 'video/x-flv': 'FLV'};
      var blipVideos = blipVideosContent.split(',{');
      var blipVideoURL, blipVideoMime, blipVideoHeight, blipVideoRole, blipVideoDef, blipVideoCode;
      var blipDefaultVideo = 'Low Definition MP4';
      for (var blipV = 0; blipV < blipVideos.length; blipV++) {
      blipVideoMime = blipVideos[blipV].match(/"primary_mime_type":"(.*?)"/);
      blipVideoMime = (blipVideoMime) ? blipVideoMime[1] : null;
      if (blipMimeTypes[blipVideoMime]) {
        blipVideoURL = blipVideos[blipV].match(/"url":"(.*?)"/);
          blipVideoURL = (blipVideoURL) ? blipVideoURL[1] : null;
            blipVideoHeight = blipVideos[blipV].match(/"media_height":"(.*?)"/);
              blipVideoHeight = (blipVideoHeight) ? blipVideoHeight[1] : null;
                blipVideoRole = blipVideos[blipV].match(/"role":"(.*?)"/);
                  blipVideoRole = (blipVideoRole) ? blipVideoRole[1] : null;
                    if (blipVideoURL && blipVideoHeight && blipVideoRole) {
                        if (!blipVideoFound) blipVideoFound = true;
                            if (blipVideoHeight >= 200 && blipVideoHeight < 400) blipVideoDef = 'Low Definition';
                                else if (blipVideoHeight >= 400 && blipVideoHeight < 700) blipVideoDef = 'Standard Definition';
                                    else if (blipVideoHeight >= 700) blipVideoDef = 'High Definition';
                                        blipVideoCode = blipVideoDef + ' ' + blipMimeTypes[blipVideoMime];
                                            blipVideoList[blipVideoCode] = blipVideoURL;
                                                if (blipVideoRole == 'Source') blipDefaultVideo = blipVideoCode;
                                                  }
                                                  }
      }

      if (blipVideoFound) {
      /* Create Saver */
      saver = {'saverSocket': blipSaverSocket, 'videoList': blipVideoList, 'videoSave': blipDefaultVideo, 'saverWidth': blipSaverWidth};
      option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition'];
      option['containers'] = ['MP4', 'M4V', 'MOV', 'FLV', 'Any'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': blipPlayerWindow, 'saverWidth': blipSaverWidth, 'warnMess': '!videos'};
      createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': blipPlayerWindow, 'saverWidth': blipSaverWidth, 'warnMess': '!content'};
      createMySaver ();
    }
  }
  
}

// =====Veoh===== //

else if (page.url.indexOf('veoh.com/watch') != -1) {

  /* Get Video Availability */
  if (getMyElement ('', 'div', 'class', 'veoh-video-player-error', 0, false)) return;

  /* Get Player Window */
  var vePlayerWindow = getMyElement ('', 'div', 'id', 'videoPlayerContainer', -1, false);
  if (!vePlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var veVideosContent = getMyContent (page.url, '__watch.videoDetailsJSON = \'\\{(.*?)\\}', false);
    veVideosContent = cleanMyContent (veVideosContent, true);
    
    /* Get Videos */
    if (veVideosContent) {
      var veVideoFormats = {'fullPreviewHashLowPath': 'Very Low Definition MP4', 'fullPreviewHashHighPath': 'Low Definition MP4'};
      var veVideoList = {};
      var veVideoFound = false;
      var veVideoParser, veVideoParse, veVideo, myVideoCode;
      for (var veVideoCode in veVideoFormats) {
      veVideoParser = veVideoCode + '":"(.*?)"';
      veVideoParse = veVideosContent.match (veVideoParser);
      veVideo = (veVideoParse) ? veVideoParse[1] : null;
      if (veVideo) {
        if (!veVideoFound) veVideoFound = true;
          myVideoCode = veVideoFormats[veVideoCode];
            veVideoList[myVideoCode] = veVideo;
            }
      }

      if (veVideoFound) {
      /* Create Saver */
      var veDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': vePlayerWindow, 'videoList': veVideoList, 'videoSave': veDefaultVideo, 'saverWidth': 640};
      feature['container'] = false;
      feature['fullsize'] = false;
      option['definition'] = 'LD';
      option['definitions'] = ['Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver ();
      }
      else {
      saver = {'saverSocket': vePlayerWindow, 'saverWidth': 640};
      var veVideoSource = getMyContent(page.url, '"videoContentSource":"(.*?)"', false);
      if (veVideoSource == 'YouTube') var ytVideoId = getMyContent(page.url, '"videoId":"yapi-(.*?)"', false);
      if (ytVideoId) {
        var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId;
          saver['warnMess'] = 'embed';
            saver['warnContent'] = ytVideoLink;
              styleMyElement(vePlayerWindow, {margin: '0px 0px 20px 0px'});
              }
              else saver['warnMess'] = '!videos';       
              createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': vePlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
      createMySaver ();
    }
  }
  
}

// =====Crackle===== //

else if (page.url.indexOf('crackle.com/') != -1) {
  
  /* Get Page Type */
  var crPageType = getMyContent (page.url, 'meta\\s+property="og:type"\\s+content="(.*?)"', false);
  if (!crPageType || crPageType.indexOf('video') == -1) return;
 
  /* Get Player Window */
  var crPlayerWindow = getMyElement ('', 'div', 'class', 'player-stage-area1', 0, false);
  if (!crPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Restyle */
    var crContent = getMyElement ('', 'div', 'id', 'content', -1, false);
    styleMyElement (crContent, {marginTop: '10px'});
    
    /* Get Video ID */
    var crVideoID = getMyContent (page.url, 'StartPlayer\\s+\\((.*?),', false);
    
    /* Get Videos Content */
    var crVideoPath = getMyContent (page.url, 'images-us-am.crackle.com\/(.*?_)tnl', false);
    if (!crVideoPath) {
      var crHost = page.url.match(/(^.*?crackle.com)/);
      crHost = (crHost) ? crHost[1] : 'http://www.crackle.com';
      var crVidWallCache = crHost + '/app/vidwallcache.aspx?flags=-1&fm=' + crVideoID + '&partner=20';
      crVideoPath = getMyContent (crVidWallCache, '\\sp="(.*?)"', false);
    }
    
    /* Get Videos */
    if (crVideoPath) {
      var crVideoList = {};
      var crVideoFormats = {'360p.mp4': 'Low Definition MP4', '480p.mp4': 'Standard Definition MP4'};
      var crVideoThumb, crVideo, myVideoCode;
      for (var crVideoCode in crVideoFormats) {
      crVideo = 'http://media-us-am.crackle.com/' + crVideoPath + crVideoCode;
      myVideoCode = crVideoFormats[crVideoCode];
      crVideoList[myVideoCode] = crVideo;
      }

      /* Create Saver */
      var crDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': crPlayerWindow, 'videoList': crVideoList, 'videoSave': crDefaultVideo, 'saverWidth': 970};
      feature['container'] = false;
      option['definition'] = 'SD';
      option['definitions'] = ['Standard Definition', 'Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver ();
    }
    else {
      saver = {'saverSocket': crPlayerWindow, 'saverWidth': 970, 'warnMess': '!videos'};
      createMySaver ();
    }
    
  }

}

  // KrISS dwld
  function kriss_dwld() {
    var s = '', list = new Array();
    
    for (var key in saver.videoList) {
        list.push(saver.videoList[key]);
        s += list.length +' => ' + key + '\n';
    }
    var r = parseInt(window.prompt(s),10)-1;
    if (r < list.length) {
      window.location.assign(list[r]);
    }
  }

  kriss_dwld();
})();