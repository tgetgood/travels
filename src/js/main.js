'use strict';

/*
 * Intergalactic Travel Prototype.
 * 2014-07-10

 * Copyright Thomas Getgood
`* All rights reserved.
*/

// JS extensions
//====================================================================
 /*
	* object.watch polyfill
	*
	* 2012-04-03
	*
	* By Eli Grey, http://eligrey.com
	* Public Domain.
	* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	*/

// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop, handler) {
			var	oldval = this[prop];
			var newval = oldval;
			var getter = function () {
				return newval;
			};
			var setter = function (val) {
				oldval = newval;
				newval = handler.call(this, prop, oldval, val);
				return newval;
			};
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

// Fake Data
//====================================================================

var delhiFakes = [
	{"id": 1,
	 "name": "India Gate and Rajpath",
	 "description": "India Gate is a memorial raised in honour of the Indian soldiers who died during the Afghan wars and World War I. The cenotaph (or shrine) in the middle is constructed with black marble and depicts a rifle placed on its barrel, crested by a soldier's helmet.",
	"images":[
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/10413852_1440915649520615_401579729_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/10413852_1440915649520615_401579729_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/10413852_1440915649520615_401579729_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/925314_1655808077976793_1833730716_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/925314_1655808077976793_1833730716_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/925314_1655808077976793_1833730716_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10554183_1450892225164089_263938657_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10554183_1450892225164089_263938657_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10554183_1450892225164089_263938657_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10507865_1435186200095558_2020763554_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10507865_1435186200095558_2020763554_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10507865_1435186200095558_2020763554_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10488705_490107687790500_2111000839_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10488705_490107687790500_2111000839_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10488705_490107687790500_2111000839_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/923698_1438699059741632_989549904_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/923698_1438699059741632_989549904_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/923698_1438699059741632_989549904_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10453911_1525378421018409_69573855_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10453911_1525378421018409_69573855_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10453911_1525378421018409_69573855_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/927130_1441864916082093_766144570_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/927130_1441864916082093_766144570_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/927130_1441864916082093_766144570_n.jpg","width":640,"height":640}}] 
	},
	{"id": 2,
	 "name": "Rashtrapati Bhavan",
	 "description": "Built with a mix of European and Mughal/Indian styles, Rashtrapati Bhavan was originally built for the Governor General of India. Inaugurated in 1931 as the Viceregal Lodge, the name was changed in 1959 after India became a republic. Now it is the Presidential Palace of India.",
	"images":[
	{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10471801_360764827411532_1183704838_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10471801_360764827411532_1183704838_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10471801_360764827411532_1183704838_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10540236_788816707824880_1669958834_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10540236_788816707824880_1669958834_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10540236_788816707824880_1669958834_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10499055_688484281189051_931354857_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10499055_688484281189051_931354857_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10499055_688484281189051_931354857_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/914734_302675239919612_2140787216_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/914734_302675239919612_2140787216_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/914734_302675239919612_2140787216_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10375615_1473083696268664_107648572_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10375615_1473083696268664_107648572_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10375615_1473083696268664_107648572_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10414060_1443448815908869_657118072_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10414060_1443448815908869_657118072_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10414060_1443448815908869_657118072_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10424384_1444430999140033_1378195874_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10424384_1444430999140033_1378195874_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10424384_1444430999140033_1378195874_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10401712_735138499861978_1205125954_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10401712_735138499861978_1205125954_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10401712_735138499861978_1205125954_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10387955_780436498657624_1566362724_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10387955_780436498657624_1566362724_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10387955_780436498657624_1566362724_n.jpg","width":640,"height":640}}]},
	{"id":3,
	 "name": "Connaught Place",
	 "description": "Connaught Place is known for its vibrant atmosphere and planned layout. It has been the hot-spot both for the business men as well as tourists both from the country and abroad. The present day Connaught Place plays the role of a welcoming host to the continuous down stepping of huge masses who are attracted to the popular tourist destinations here.",
	"images":[
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10518217_480023288809272_1964106769_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10518217_480023288809272_1964106769_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10518217_480023288809272_1964106769_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/924451_288084841362791_336997579_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/924451_288084841362791_336997579_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/924451_288084841362791_336997579_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10508045_251517158379485_933453337_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10508045_251517158379485_933453337_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10508045_251517158379485_933453337_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499180_300912520083338_1569303035_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499180_300912520083338_1569303035_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499180_300912520083338_1569303035_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10413161_1470363146545091_1014292822_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10413161_1470363146545091_1014292822_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10413161_1470363146545091_1014292822_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/924452_652594264831341_304241917_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/924452_652594264831341_304241917_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/924452_652594264831341_304241917_n.jpg","width":640,"height":640}}]
	},
	{"name": "Lodhi Gardens",
	 "id":4,
	 "description": "Lodhi Gardens, once called Lady Willingdon Park, laid out in 1930 this beautiful park contains 15th and 16th century monuments that are scattered among its well-kept lawns, flowers, shady trees and ponds. During the early morning and evening hours, the sprawling garden is a favourite spot for fitness freaks and those in search of solitude.",
	"images":[
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/925566_1443649592562887_1570896602_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/925566_1443649592562887_1570896602_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/925566_1443649592562887_1570896602_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/929182_799801413387362_965681437_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/929182_799801413387362_965681437_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/929182_799801413387362_965681437_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10502630_1512998688930599_605206178_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10502630_1512998688930599_605206178_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10502630_1512998688930599_605206178_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/1517339_709826942422984_1220794147_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/1517339_709826942422984_1220794147_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/1517339_709826942422984_1220794147_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10431966_1497871460444871_2014958201_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10431966_1497871460444871_2014958201_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10431966_1497871460444871_2014958201_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10349797_665774780187039_1929982876_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10349797_665774780187039_1929982876_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10349797_665774780187039_1929982876_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/924384_1503708776531517_797172993_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/924384_1503708776531517_797172993_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/924384_1503708776531517_797172993_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10454128_1620250754867259_648769767_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10454128_1620250754867259_648769767_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10454128_1620250754867259_648769767_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10413259_1500259710187672_2003943137_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10413259_1500259710187672_2003943137_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10413259_1500259710187672_2003943137_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10424663_645153242242985_880066595_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10424663_645153242242985_880066595_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10424663_645153242242985_880066595_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10249201_687279927998103_1307675353_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10249201_687279927998103_1307675353_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10249201_687279927998103_1307675353_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10424496_794216353931287_2057171827_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10424496_794216353931287_2057171827_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10424496_794216353931287_2057171827_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/925859_1436406329948818_1511826217_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/925859_1436406329948818_1511826217_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/925859_1436406329948818_1511826217_n.jpg","width":612,"height":612}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10387769_886216921394669_1957632839_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10387769_886216921394669_1957632839_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10387769_886216921394669_1957632839_n.jpg","width":640,"height":640}}]
	},
	{"name": "Purana Quila",
	 "id":5,
	 "description": "The Purana Quila (Old Fort) is a very good example of Mughal military architecture. Built by Pandavas, renovated by Humayun, with later modifications by Sher Shah Suri, the Purana Quila is a monument of bold design, which is strong, straightforward, and every inch a fortress. It is different from the well-planned, carefully decorated, and palatial forts of the later Mughal rulers. Purana Quila is also different from the later forts of the Mughals, as it does not have a complex of palaces, administrative, and recreational buildings as is generally found in the forts built later on. The main purpose of this now dilapidated fort was its utility with less emphasis on decoration. The Qal'a-I-Kunha Masjid and the Sher are two important monuments inside the fort. It was made by Aqeel in 1853.",
	"images":[
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10246090_632259353523809_482878483_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10246090_632259353523809_482878483_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10246090_632259353523809_482878483_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10299621_497114457060282_678891909_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10299621_497114457060282_678891909_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10299621_497114457060282_678891909_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10251350_1414164182188275_1487010318_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10251350_1414164182188275_1487010318_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10251350_1414164182188275_1487010318_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10358249_641457075939000_1354548914_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10358249_641457075939000_1354548914_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10358249_641457075939000_1354548914_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/927350_299238013569111_1735262275_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/927350_299238013569111_1735262275_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/927350_299238013569111_1735262275_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10013320_447697385360589_1629024019_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10013320_447697385360589_1629024019_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/10013320_447697385360589_1629024019_n.jpg","width":640,"height":640}}]
	},
	{"name": "Red Fort",
	 "id": 6,
	 "description": "The decision for constructing the Red Fort was made in 1639, when Shah Jahan decided to shift his capital from Agra to Delhi. Within eight years, Shahjahanabad was completed with the Red Fort-Qila-i-Mubarak (fortunate citadel) — Delhi's first fort — ready in all its magnificence to receive the Emperor. This entire architecture is constructed of huge blocks red sandstone. Though much has changed with the large-scale demolitions during the British occupation of the fort, its important structures have survived.On every independence day the Flag of India is hoisted by the Prime Minister of India here.",
	 "images":[
		 {"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10549801_266718710198612_78823987_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10549801_266718710198612_78823987_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10549801_266718710198612_78823987_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/924537_660755510665525_1029330930_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/924537_660755510665525_1029330930_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/924537_660755510665525_1029330930_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10547200_607175899398757_1804230990_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10547200_607175899398757_1804230990_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10547200_607175899398757_1804230990_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10547044_783970208320329_195501957_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10547044_783970208320329_195501957_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfp1/t51.2885-15/10547044_783970208320329_195501957_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10507847_1519581971598731_181796944_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10507847_1519581971598731_181796944_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10507847_1519581971598731_181796944_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/926826_238866642990803_1661938173_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/926826_238866642990803_1661938173_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/926826_238866642990803_1661938173_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10251303_1474928582754226_590997420_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10251303_1474928582754226_590997420_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10251303_1474928582754226_590997420_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10520200_508887189210961_1567632205_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10520200_508887189210961_1567632205_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10520200_508887189210961_1567632205_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10483341_667025973388929_486155390_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10483341_667025973388929_486155390_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10483341_667025973388929_486155390_n.jpg","width":640,"height":640}}]	
	},
	{"name": "Salimgarh Fort",
	 "id": 7,
	 "description": "Salimgarh Fort, which is now part of the Red Fort complex, was constructed on an island of the Yamuna River in 1546. But a gate called the Bahadur Shahi Gate for entry into the Fort from the northern side was constructed only in 1854-55 by Bahadur Shah Zafar, the last Mughal ruler of India. The gate was built in brick masonry with moderate use of red sandstone. The fort was used during the Uprising in 1857 and also as a prison which housed Zebunnisa daughter of Aurangzeb and the British imprisoned the freedom fighters of the INA. The layout of the Red Fort was organized to retain and integrate this site with the Salimgarh Fort through the Bahadur Shah Gate. The fort has been renamed as Swatantrata Senani Smarak and a plaque at the entrance to the fort attests to this.",
	 "images":[
		 {"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/1799656_1419918494925910_1751951788_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/1799656_1419918494925910_1751951788_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/1799656_1419918494925910_1751951788_n.jpg","width":612,"height":612}},
		 {"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/1742768_620534571316778_1262812784_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/1742768_620534571316778_1262812784_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/1742768_620534571316778_1262812784_n.jpg","width":640,"height":640}},
		 {"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/outbound-distilleryimage10/t0.0-17/OBPTH/5d2d0a8c787c11e3abd4129eb955129a_6.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/outbound-distilleryimage10/t0.0-17/OBPTH/5d2d0a8c787c11e3abd4129eb955129a_5.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/outbound-distilleryimage10/t0.0-17/OBPTH/5d2d0a8c787c11e3abd4129eb955129a_7.jpg","width":612,"height":612}}]
	 },
	{"name": "Chandni Chowk",
	 "id": 8,
	 "description": "Chandni Chowk, a main marketplace in Delhi, keeps alive the city's living legacy of Shahjahanabad. Created by Shah Jahan the builder of Taj Mahal, the old city, with the Red Fort as its focal point and Jama Masjid as the praying centre, has a fascinating market called Chandni Chowk. Legend has it that Shah Jahan planned Chandni Chowk so that his daughter could shop for all that she wanted. The market was divided by canals. The canals are now closed, but Chandni Chowk remains Asia's largest wholesale market. Crafts once patronized by the Mughals continue to flourish there. Chowk is one of the oldest and busiest markets in central north Delhi, the Laal Quila (The Red Fort) and Fateh Puri Masjid. With the most famous mosque of Delhi Jama Masjid in the vicinity, along with Sis Ganj Gurudwara, Gauri Shankar Mandir, Jain Mandir and a lot of small temples, the place witnesses a genuine cultural harmony.",
	"images":[
	{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/914765_656940827731026_1620177386_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/914765_656940827731026_1620177386_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xfa1/t51.2885-15/914765_656940827731026_1620177386_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10508076_276383725879760_777280584_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10508076_276383725879760_777280584_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xap1/t51.2885-15/10508076_276383725879760_777280584_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10549597_662279183867149_397529019_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10549597_662279183867149_397529019_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xfp1/t51.2885-15/10549597_662279183867149_397529019_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10499141_803017919742588_1411765596_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10499141_803017919742588_1411765596_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpf1/t51.2885-15/10499141_803017919742588_1411765596_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499065_895645527115747_1110900292_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499065_895645527115747_1110900292_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499065_895645527115747_1110900292_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10467727_628434630586697_1578209651_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10467727_628434630586697_1578209651_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10467727_628434630586697_1578209651_n.jpg","width":640,"height":640}}]
	},
	{"name": "Safdarjung's Tomb",
	 "id": 9,
	 "tags": ["safdarjungstomb"],
	 "description": "The Safdarjung's Tomb is a garden tomb in a marble mausoleum."},
	{"name": "Qutub Minar",
	 "id": 10,
	 "tags": ["qutubminar"],
	 "description": "The Qutub Minar is located in Qutb complex, Mehrauli in South Delhi. It was built by Qutub-ud-din Aibak of the Slave Dynasty, who took possession of Delhi in 1206. It is a fluted red sandstone tower, which tapers up to a height of 72.5 meters and is covered with intricate carvings and verses from the Qur'an. Qutub-ud-din Aibak began constructing this victory tower as a sign of Muslim domination of Delhi and as a minaret for the muezzin to call the faithful to prayer. However, only the first storey was completed by Qutub-ud-din. The other storeys were built by his successor Iltutmish. The two circular storeys in white marble were built by Ferozshah Tughlaq in 1368, replacing the original fourth storey."},
	{"name": "Tughlaqabad",
	 "id": 11,
	 "tags": ["tughlaqabad"],
	 "description": "When Ghazi Malik founded the Tughlaq Dynasty in 1321, he built the strongest fort in Delhi at Tughlaqabad, completed with great speed within four years of his rule. It is said that Ghazi Malik, when only a slave to Mubarak Khilji, had suggested this rocky prominence as an ideal site for a fort. The Khilji Sultan laughed and suggested that the slave build a fort there when he became a Sultan. Ghazi Malik as Ghiyasuddin Tughlaq did just that: Tughlaqabad is Delhi's most colossal and awesome fort even in its ruined state. Within its sky-touching walls, double-storied bastions, and gigantic towers were housed grand palaces, splendid mosques, and audience halls."},
	{"name": "Akshardham Temple",
	 "id": 12,
	 "tags": ["akshardhamtemple"],
	 "description": "Akshardham Temple it is the largest Hindu temple in the world. It was built in 2005. In the sprawling 100-acre (0.40 km2) land rests an intricately carved monument, high-technology exhibitions, an IMAX theatre, a musical fountain, a food court and gardens.[2]"},
	{"name": "Laxminarayan Temple",
	 "id": 13,
	 "tags": ["laxminarayantemple"],
	 "description": "The temple is built in honour of Lakshmi (Hindu goddess of wealth), and her consort Narayana (Vishnu, Preserver in the Trimurti) by B. R. Birla from 1933 and 1939, when it was inaugurated by Mahatma Gandhi. The side temples are dedicated to Shiva, Krishna and Buddha."},
	{"name": "Cathedral Church of Redemption",
	 "id": 14,
	 "tags": ["cathedralchurchofredemption"],
	 "description": "Cathedral Church of Redemption, also known as Viceroy Church. Located east of Parliament House and Rashtrapati Bhavan, which was used by then viceroy of British India."},
	{"name": "Gurdwara Bangla Sahib",
	 "id": 15,
	 "tags": ["gurdwarabanglasahib"],
	 "description": "One of the most prominent and largest Gurdwaras in Delhi, Gurdwara Bangla Sahib is the most visited one in the Delhi. Millions visit this Gurdwara from all over the world and of all religions to offer their prayers at this elegant yet historical Gurdwara in Delhi. The Gurdwara marks the place where the eighth Sikh Guru, Guru Harkrishan lived his last breath serving the helpless population ravaged by smallpox and cholera epidemic.[3] The Gurdwara offers free food (langar) to all visitors and devotees throughout the day."},
	{"name": "ISKCON Temple",
	 "id": 16,
	 "tags": ["ISKCONtemple"],
	 "description": "ISKCON Temple also popularly called as the Hare Krishna temple is a famous Vaishnava temple with deities of Sri Radha Krishna. Located in South Delhi, the construction of the temple began in 1991 and was completed in 1998 under the planning of internationally renowned architect Achyut Kanvinde."},
	{"name": "Jama Masjid",
	 "id": 17,
	 "tags": ["jamamasjid"],
	 "description": "The Masjid-i-Jahan Numa, commonly known as Jama Masjid, is the principal mosque of Old Delhi. Commissioned by the Mughal Emperor Shah Jahan and completed in the year 1656, it is one of the largest and best known mosques in India."},
	{"name": "lotustemple",
	 "id": 18,
	 "tags": ["lotustemple"],
	 "description": "The Lotus Temple is an exceptionally beautiful structure, created by the Bahá'í House of Worship, situated in South Delhi and looks like a white lotus. It was built by the Bahá'í community."},
	{"name": "Kalka Ji Mandir",
	 "id": 19,
	 "tags": ["kalkajimandir"],
	 "description": "Kalka Ji Mandir is a famous Hindu mandir or temple,This temple is situated on Kalkaji Mandir (Delhi Metro station) in the southern part of Delhi, India, in Kalkaji, a locality that has derived its name from this famous temple and is located opposite Nehru Place business centre."},
	{"name": "National Museum, New Delhi",
	 "id": 20,
	 "tags": ["nationalmuseumdelhi"],
	 "description": "The National Museum, New Delhi is one of the largest museums in India. It holds variety of articles ranging from pre-historic era to modern works of art. It is run by the Ministry of Culture, part of the Government of India. The museum is situated on the corner of Janpath and Maulana Azad Road."},
	{"name": "National Rail Museum",
	 "id": 21,
	 "tags": ["nationalrailmuseum", "nationalrailmuseumindia"],
	 "description": "The National Rail Museum is a museum in Chanakyapuri, New Delhi which focuses on the rail heritage of India it opened on the 9 July 1977. It is located in over 10 acres (40,000 m2) of land with both indoor and outdoor exhibits. A toy train offers rides around its site on regular days. The museum houses the world's oldest operational steam locomotive the 1855 built Fairy Queen certified by the Guinness Book of Records."},
	{"name": "Jantar Mantar",
	 "id": 22,
	 "tags": ["jantarmantar"],
	 "description": "The Jantar Mantar consists of 13 architectural astronomy instruments, built by Maharaja Jai Singh II."},
	{"name": "Nizamuddin Dargah",
	 "id": 23,
	 "tags": ["nizamuddindargah"],
	 "description": "Nizamuddin Dargah is the Mausoleum of the famous Sufi Saint Nizamuddin Auliya, Delhi."},
	{"name": "Raj Ghat",
	 "id": 24,
	 "tags": ["rajghat"],
	 "description": "On the bank Yamuna River, which flows past Delhi, there is Raj Ghat, the final resting place of Mahatma Gandhi, the father of the nation. It has become an essential point of call for all visiting dignitaries. Two museums dedicated to Gandhi are situated nearby."},
	{"name": "National Zoological Park",
	 "id": 26,
	 "description": "The National Zoological Park is a 176-acre (71 ha) zoo near the Old Fort in Delhi, India. The zoo is home to about 1350 animals representing almost 130 species of animals and birds from around the world.",
	"images":[
		{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/929126_662733077153866_1755831133_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/929126_662733077153866_1755831133_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/929126_662733077153866_1755831133_n.jpg","width":640,"height":640}},
		{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10424541_503763896390641_28557449_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10424541_503763896390641_28557449_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10424541_503763896390641_28557449_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499066_596914630423002_1608333358_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499066_596914630423002_1608333358_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xpa1/t51.2885-15/10499066_596914630423002_1608333358_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10508037_1486117841625717_265981921_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10508037_1486117841625717_265981921_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-b.cdninstagram.com/hphotos-xap1/t51.2885-15/10508037_1486117841625717_265981921_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10401688_308253792684286_921733798_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10401688_308253792684286_921733798_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpa1/t51.2885-15/10401688_308253792684286_921733798_n.jpg","width":640,"height":640}},
{"low_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10499177_1433226926951700_1291503955_a.jpg","width":306,"height":306},"thumbnail":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10499177_1433226926951700_1291503955_s.jpg","width":150,"height":150},"standard_resolution":{"url":"http://scontent-a.cdninstagram.com/hphotos-xpf1/t51.2885-15/10499177_1433226926951700_1291503955_n.jpg","width":640,"height":640}}]
	}
];

// IG Interaction
//====================================================================

var clientID = "4a6a3fb4b8464bfe9098d1e901d2aa6e"

var appendAuth = function (url) {
	var res = url;
	if (url.indexOf("?") !== -1) {
		res = res + "&";
	}
	else {
		res = res + "?";
	}
		return res + "client_id=" + clientID;
};

var tagInfoURL = function (tag) {
	var baseURL = "https://api.instagram.com/v1/tags/";
	return appendAuth(baseURL + tag);
};

// Currently Set to get 100 results at a time, if IG respects that...
var getTagsURL = function (tag) {
	var url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?count=100";
	return appendAuth(url);
};

var getIG = function (url) {
	return $.ajax(url, {
		type: "GET",
		"method": "GET",
		dataType: "jsonp",
		headers: {"Access-Control-Allow-Origin": "true"}
	});
};				

// Helpers
//====================================================================

function parseUrl( url ) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}

// State...
//====================================================================

var state = {
	location: null,
	mapInit:false,
	map: null,
	accepted: [],
	rejected: [],
	index: 0,
	data: delhiFakes,
	current: {}
};

var maintainQueue = function (state) {
	var sids = _.map(state.accepted, function (x) {
		return x.id;
	}).concat(_.map(state.rejected, function (x) {
		return x.id;
	}));
	
	var queue = _.filter(state.data, function (d) {
		return !_.contains(sids, d.id);
	});

	var index = state.index;
	var len = queue.length;

	while (index < 0) {
		index += len;
	}
	
	index = index % len;
	
	return queue[index];
}	

state.watch("accepted", function(p, o, newval) {
	var s = _.clone(state);

	s.accepted  = newval;
	state.current = maintainQueue(s);

	return newval;
});

state.watch("rejected", function(p, o, newval) {
	var s = _.clone(state);

	s.rejected  = newval;
	state.current = maintainQueue(s);

	return newval;
});

state.watch("index", function(p, o, newval) {
	var s = _.clone(state);

	s.index  = newval;
	state.current = maintainQueue(s);

	return newval;
});

// Main View
// ====================================================================

var hideMulti = function (hash) {
	var view = hash.substring(1);

	$("#main-view").hide();
	$("#more-pictures").hide();
	$("#map-view").hide();
	
 if (view === "thumbs") {
		$("#more-pictures").show();
	}
	else if (view === "map") {
		$("#map-view").show();
		if (!state.mapInit) {
			initMap(state.location);
			state.mapInit = true;
		}
	}
	else {
		$("#main-view").show(); //...
	}
};

var render = function (current) {
	$("#site-name").text(current.name);
	$("#description").text(current.description);
	
	$("#principle-image").attr("src", current.shownImage);
	current.watch("shownImage", function (prop, oldval, newval) {
		$("#principle-image").attr("src", newval);
	});
	
	
	var mp = $("#more-pictures");
	mp.html("");

	for (var i = 0; i < current.images.length; i++) {
		(function (i) {
			mp.append($('<div>').attr('class', "pure-u-1-3 nav-thumb").on("click", function (evt) {
				current.shownImage = current.images[i]["standard_resolution"].url;
				location.hash = "";
			}).append($("<img>").attr("src", current.images[i].thumbnail.url)));
		})(i);
	}
};

var getCurrent = function (c) {
	var current = _.clone(c);
	
//	current.images = [];

	if (current.images && current.images.length > 0 &&
			(current.shownImage === "" || current.shownImage === undefined)) {
		current.shownImage = current.images[0]["standard_resolution"].url;
	}

	// for (var i = 0; i < current.tags.length; i++) {
	// 	getIG(getTagsURL(current.tags[i])).then(function (data) {
	// 		var viable = data.data.filter(function(item) {
	// 			return item.type === "image" && item.location !== null;
	// 		});

	// 		if (current.shownImage === "" && viable.length > 0) {
	// 			current.shownImage = viable[0].images["standard_resolution"].url;
	// 		}

	// 		if (!current.images) {
	// 			// Weirdest bug...
	// 			return;
	// 		}
	// 		current.images = current.images.concat(viable);
	// 	});
	// }
	
	return current;
}


// Global watchers
//====================================================================

window.onhashchange = function (evt) {
	var hash = parseUrl(evt.newURL).hash;
	hideMulti(hash);
}

state.watch("current", function (prop, oldval, newval) {
	if (oldval) {
		oldval.unwatch("images");
		oldval.unwatch("shownImage");
	}
	
	var current = getCurrent(newval);
	
	render(current);

	return current;;
});

// Maps
//====================================================================

var initMap = function(location) {
	if (typeof(google) !== "undefined") {
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({address: location}, function (results, status) {
			var mapOptions = {
				disableDefaultUI: true,
				zoom: 13,
				center: results[0].geometry.location,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			state.map = new google.maps.Map($('#map-canvas')[0],
																			mapOptions);

			google.maps.event.addListenerOnce(map, 'idle', function() {
				google.maps.event.trigger(map, 'resize');
			});
		});
	}
};
	
var addMarker = function(map, location) {	

 	if (!map) {
		// FIXME: Not the worst leak, but terrible practice.
		_.delay(function () {addMarker(state.map, location);}, 2000);
	}
	
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({address: location.name}, function (results, status) {
		if (!results || results.length === 0) {
			return;
		}

		var marker = new google.maps.Marker({
			position: results[0].geometry.location,
			map: map,
			title: location.name
		});
	});
};

// Event Handlers
//====================================================================

var go = function (h) {
	return function() {
		location.hash = h;
	};
};

var goToMap    = go("#map");
var goToThumbs = go("#thumbs");
var goToMain   = go("");

var scrollUp = function () {
	state.index = state.index - 1;
};

var scrollDown = function () {
	state.index = state.index + 1;
};

var reject = function (c) {
	state.rejected = state.rejected.concat([c]);
};

var accept = function (c) {
	state.accepted = state.accepted.concat([c]);
	addMarker(state.map, state.current);
};

// Static Bindings
//====================================================================

var buttonMap = {
	"#map": 	        	goToMap,
	"#image-container": goToThumbs,
	"#back-to-main":    goToMain,

	"#previous":   scrollUp,
	"#next":       scrollDown,
	"#no-button":  function () {reject(state.current);},
	"#yes-button": function () {accept(state.current);}
};

// Apply Bindings
//====================================================================

var attachHandlers = function(map) {
	for (var b in map) {
		if (_.has(map, b)) {
			$(b).on("click", map[b]);
		}
	}
};

attachHandlers(buttonMap);

// Init
// ====================================================================

// Fake search
state.location = "new delhi";

// Fake data retrieval
state.current = delhiFakes[0];

// Set view based on hash
hideMulti(document.location.hash);
