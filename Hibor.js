{
	"translatorID": "fc456354-78a2-4f38-957c-031f9f288c25",
	"label": "Hibor",
	"creator": "018<lyb018@gmail.com>",
	"target": "http://www\\.hibor\\.com\\.cn/(data|report|newweb|gj\\.htm)",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-09-06 11:28:27"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2021 018<lyb018@gmail.com>

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

function attr(docOrElem, selector, attr, index) {
	var elem = index ? docOrElem.querySelectorAll(selector).item(index) : docOrElem.querySelector(selector);
	return elem ? elem.getAttribute(attr) : null;
}

function text(docOrElem, selector, index) {
	var elem = index ? docOrElem.querySelectorAll(selector).item(index) : docOrElem.querySelector(selector);
	return elem ? elem.innerText : '';
}

function trim(content) {
	return content.replace(/^[\xA0\s]+/gm, '')
		.replace(/[\xA0\s]+$/gm, '')
		.replace(/\n+/g, '\n')
		.replace(/:\n+/g, ': ')
		.replace(/]\n/g, ']')
		.replace(/】\n/g, '】')
		.replace(/\n\/\n/g, '/')
}

// https://aurimasv.github.io/z2csl/typeMap.xml#map-report
function detectType(doc) {
	return 'report';
}

function detectWeb(doc, url) {
	if (url.includes('/gj.html') || url.includes('/newweb/HuiSou/s')) {
		return getSearchResults(url, doc, true) ? 'multiple' : false;
	} else {
		return detectType(doc);
	}
	
	return false;
}

function getSearchResults(url, doc, checkOnly) {
	var items = {};
	var found = false;
	if (url.includes('/gj.html')) {
		var rows = doc.querySelectorAll('.baogao_sousuo_result div.tab_divttl > span > a');
		for (let row of rows) {
			let a = row;
	
			if (checkOnly) return true;
			
			let u = a.href;
	
			let title = ZU.trimInternal(a.textContent);
			
			found = true;
			items[u] = title;
		}
	} else if (url.includes('/newweb/HuiSou/s')) {
		var rows = doc.querySelectorAll('#resultData > div a');
		for (let row of rows) {
			let a = row;
	
			if (checkOnly) return true;
			
			let u = a.href;
	
			let title = ZU.trimInternal(a.textContent);
			
			found = true;
			items[u] = title;
		}
	}
	return found ? items : false;
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		let results = getSearchResults(url, doc, false);
		Zotero.selectItems(results, function (items) {
			if (!items) return;
			ZU.processDocuments(Object.keys(items), scrape);
		});
	} else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {
	var itemType = detectType(doc);
	var item = new Zotero.Item(itemType);

	item.url = url;
	item.title = text(doc, 'div.left-detail > h1');
	item.publisher = text(doc, 'div.left-detail > div.doc-info > div.info-left > span:nth-child(2) > a');
	item.reportType = text(doc, 'div.left-detail > div.doc-info-list > span:nth-child(1) > a');
	item.pages = text(doc, 'div.left-detail > div.doc-info-list > span:nth-child(4) > i').replace(' 页', '');
	item.date = text(doc, 'div.left-detail > div.doc-info > div.info-left > span.article-time').replace('日期：', '');
	var authors = text(doc, 'span.author > a').split('，');
	for (let author of authors) {
		item.creators.push({
			lastName: author,
			creatorType: 'author',
			fieldMode: 1
		});
	}
	item.abstractNote = text(doc, 'div.doc-abstruct > div.abstruct-info')
	
	var element = Object.values(doc.scripts).find(element => element.textContent.includes('downloadUrl'))
	if (element) {
		var pattern = /var downloadUrl = '.+'/
		if (pattern.test(element.textContent)) {
			Z.debug(pattern.exec(element.textContent)[0])
			eval(pattern.exec(element.textContent)[0]);
			if (downloadUrl) {
				item.attachments.push({
					url: 'http://www.hibor.com.cn' + downloadUrl,
					title: 'Full Text PDF',
					mimeType: 'application/pdf'
				});
			}
		}
	}
	item.complete();
}
/** BEGIN TEST CASES **/
var testCases = []
/** END TEST CASES **/
