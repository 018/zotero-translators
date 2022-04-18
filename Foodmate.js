{
	"translatorID": "33de8bf8-2215-4ee4-8640-4735aa7c2d67",
	"label": "Foodmate",
	"creator": "018<lyb018@gmail.com>",
	"target": "^http?://([^/]+\\.)?foodmate\\.net/standard/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-03-24 11:32:20"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2020 018<lyb018@gmail.com>
	
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

// eslint-disable-next-line
function attr(docOrElem,selector,attr,index){var elem=index?docOrElem.querySelectorAll(selector).item(index):docOrElem.querySelector(selector);return elem?elem.getAttribute(attr):null;}function text(docOrElem,selector,index){var elem=index?docOrElem.querySelectorAll(selector).item(index):docOrElem.querySelector(selector);return elem?elem.textContent:null;}function trim(content){return content.replace(/^[\xA0\s]+/gm, '').replace(/[\xA0\s]+$/gm, '').replace(/\n+/g, '\n').replace(/:\n+/g, ': ').replace(/]\n/g, ']').replace(/】\n/g, '】').replace(/\n\/\n/g, '/')}

// https://aurimasv.github.io/z2csl/typeMap.xml#map-statute

function detectWeb(doc, url) {
	return 'statute';
}

function doWeb(doc, url) {
	scrapeSpc(doc, url);
}

function scrapeSpc(document, url) {
	if (!url || url.length <= 0) {
		return;
	}
	
	var itemType = detectWeb(document, url);
	var item = new Zotero.Item(itemType);
	item.url = url;

	// 标题
	var title = document.querySelector('div.title2').innerText
	item.title = title;
	// 标准号
	item.code = title.replace(/[^(0-9a-zA-Z \-)]*/g, '').trim();
	// 实施状态
	var src = document.querySelector('table.xztable > tbody > tr:nth-child(2) > td:nth-child(2) > img').src;
	var text = /.+\/(.+)$/.exec(src)[1].replace('.gif', '');
	if (text === 'xxyx') {
		item.extra = '现行有效';
	} else if (text === 'jjss') {
		item.extra = '即将实施';
	} else {
		item.extra = text;
	}
	// 实施日期
	item.dateEnacted = document.querySelector('table.xztable > tbody > tr:nth-child(2) > td:nth-child(4)').innerText;
	// 标准ICS号
	item.publicLawNumber = '';
	// 中标分类号
	item.codeNumber = '';
	// 页数
	item.pages = '';
	// 发布部门
	item.rights = document.querySelector('table.xztable > tbody > tr:nth-child(3) > td:nth-child(2)').innerText;
	item.abstractNote = document.querySelector('body > div:nth-child(8) > div.fl_rb > div:nth-child(4) > div.bznr_box').innerText;
	var a = document.querySelector('div.downk > a.telecom');
	if (a) {
		var pdf = a.href;
		item.attachments.push({
			url: pdf,
			title: 'Full Text PDF',
			mimeType: 'application/pdf'
		});
	}
	item.complete();
}
/** END TEST CASES **/
