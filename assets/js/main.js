/*
	Eventually by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

// UTM 좌표체계와 위도/경도 좌표체계 정의
var utm = "+proj=utm +zone=52 +ellps=GRS80 +units=m +no_defs";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
var polyline;
var marker;
var markerOn = false;
// 기존 입력한 값 불러오기
if(!!window.openDatabase) {
	document.getElementById('pivotCoordinate').value = localStorage.getItem('pivotCoStrg');
	document.getElementById('inputCoordinates').value = localStorage.getItem('inputCoStrg');
}

var checkEng = /[a-zA-Z]/;
var checkNum = /[0-9]/;

function chkUTMCoordinate(coordinate) {
	if(coordinate.length!=12) return false;
	for(let j=0; j<2; ++j) {
		if(!checkEng.test(coordinate[j])) return false;
	}
	for(let j=2; j<12; ++j) {
		if(!checkNum.test(coordinate[j])) return false;	
	}
	return true;
}

function changeUtmUnitEast(coordinate) {
	// charCodeAt -> 해당 index 문자의 아스키코드값
	// substr -> 5개 부분만 잘라서 뒤에 더함
	return parseInt((coordinate.charCodeAt([0])-64) + coordinate.substr(2, 5));	
}

function changeUtmUnitNorth(coordinate) {
	return parseInt((coordinate.charCodeAt([1])-30) + coordinate.substr(7, 5));	
}

(function() {

	"use strict";

	var	$body = document.querySelector('body');

	// Methods/polyfills.

		// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
			!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

		// canUse
			window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

		// window.addEventListener
			(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			window.setTimeout(function() {
				$body.classList.remove('is-preload');
			}, 100);
		});

	// Slideshow Background.
		(function() {

			// Settings.
				var settings = {

					// Images (in the format of 'url': 'alignment').
						images: {
							'images/bg01.jpg': 'center',
							'images/bg02.jpg': 'center',
							'images/bg03.jpg': 'center'
						},

					// Delay.
						delay: 6000

				};

			// Vars.
				var	pos = 0, lastPos = 0,
					$wrapper, $bgs = [], $bg,
					k, v;

			// Create BG wrapper, BGs.
				$wrapper = document.createElement('div');
					$wrapper.id = 'bg';
					$body.appendChild($wrapper);

				for (k in settings.images) {

					// Create BG.
						$bg = document.createElement('div');
							$bg.style.backgroundImage = 'url("' + k + '")';
							$bg.style.backgroundPosition = settings.images[k];
							$wrapper.appendChild($bg);

					// Add it to array.
						$bgs.push($bg);

				}

			// Main loop.
				$bgs[pos].classList.add('visible');
				$bgs[pos].classList.add('top');

				// Bail if we only have a single BG or the client doesn't support transitions.
					if ($bgs.length == 1
					||	!canUse('transition'))
						return;

				window.setInterval(function() {

					lastPos = pos;
					pos++;

					// Wrap to beginning if necessary.
						if (pos >= $bgs.length)
							pos = 0;

					// Swap top images.
						$bgs[lastPos].classList.remove('top');
						$bgs[pos].classList.add('visible');
						$bgs[pos].classList.add('top');

					// Hide last image after a short delay.
						window.setTimeout(function() {
							$bgs[lastPos].classList.remove('visible');
						}, settings.delay / 2);

				}, settings.delay);

		})();

	// Signup Form.
		(function() {

			// Vars.
				var $form = document.querySelectorAll('#signup-form')[0],
					$submit = document.querySelectorAll('#signup-form input[type="submit"]')[0],
					$message;

			// Bail if addEventListener isn't supported.
				if (!('addEventListener' in $form))
					return;

			// Message.
				$message = document.createElement('span');
					$message.classList.add('message');
					$form.appendChild($message);

				$message._show = function(type, text) {
					$message.innerHTML = text;
                                        $message.className = 'message ' + type + ' visible';

					window.setTimeout(function() {
						$message._hide();
					}, 3000);

				};

				$message._hide = function() {
					$message.classList.remove('visible');
				};

				document.getElementById("gogo").onclick = function () {
					if(markerOn) {
						marker.setMap(null); // 삭제
						polyline.setMap(null); //폴리라인 지우기
					}
				
				let pivotCo = document.getElementById('pivotCoordinate').value;
				let inputCo = document.getElementById('inputCoordinates').value;
				
				if(!!window.openDatabase) {
					localStorage.setItem("pivotCoStrg", pivotCo);
					localStorage.setItem("inputCoStrg", inputCo);
				}
				pivotCo = pivotCo.split(' ').join('');
				inputCo = inputCo.split(' ').join('');
				
				if(!chkUTMCoordinate(pivotCo)) {
					$message._show('failure', '기준좌표 확인!');
					return;
				}
				
				if(!chkUTMCoordinate(inputCo)) {
					$message._show('failure', '입력좌표 확인!');
					return;
				}
				
				pivotCo = pivotCo.toUpperCase();
				inputCo = inputCo.toUpperCase();
				
				let tmpDx = changeUtmUnitEast(pivotCo) - changeUtmUnitEast(inputCo);
				let tmpDy = changeUtmUnitNorth(pivotCo) - changeUtmUnitNorth(inputCo);
				let errorValue = Math.round(Math.sqrt(tmpDx*tmpDx + tmpDy*tmpDy));
				
				let inputWsg = proj4(utm, wgs84, [changeUtmUnitEast(inputCo), changeUtmUnitNorth(inputCo)]);
				let pivotWsg = proj4(utm, wgs84, [changeUtmUnitEast(pivotCo), changeUtmUnitNorth(pivotCo)]);
				console.log(inputWsg);
				
				map.setCenter(new naver.maps.LatLng(inputWsg[1], inputWsg[0])); // 맵 중심은 입력좌표로
				
				let polylinePath = [
                                    new naver.maps.LatLng(inputWsg[1], inputWsg[0]),
                                    new naver.maps.LatLng(pivotWsg[1], pivotWsg[0])
				];
					
				//위의 배열을 이용해 라인 그리기
                                polyline = new naver.maps.Polyline({
                                    path: polylinePath,      //선 위치 변수배열
                                    strokeColor: '#FF0000', //선 색 빨강 #빨강,초록,파랑
                                    strokeOpacity: 0.8, //선 투명도 0 ~ 1
                                    strokeWeight: 4,   //선 두께
                                    map: map           //오버레이할 지도
                                });


                                // 배열 마지막 위치를 마크로 표시함
                                marker = new naver.maps.Marker({
                                    position: polylinePath[0], //마크 표시할 위치 배열의 마지막 위치
                                    map: map
                                });
				markerOn = true;
				
				
				document.getElementById("outputValue").innerText = errorValue;
				$message._show('success', '');
			};

		})();

})();
