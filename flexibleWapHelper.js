/*!
 * author:jieyou
 * contacts:百度hi->youyo1122
 * see https://github.com/jieyou/flexibleWapHelper
 */
;(function($){
	var $window = $(window),
		backgroundSizeStr = 'background-size',
		backgroundSizeValStr = '100% 100%',
		backgroundCssObj = {},
		boxFlexFatherStr = 'display',
		boxFlexFatherValStr = 'box',
		boxFlexChildStr = 'box-flex',
		boxFlexCssArr = [],
		boxFlexCssStr

	function widthToheight(e){
		// Zepto returns `100%` for e.$dom.css('width'), so we use e.$dom.offset().width
		// jQuery returns `0` for e.$dom.offset().width, so we use e.$dom.css('width')
		return parseFloat(e.$dom.offset().width||e.$dom.css('width'))/e.originalWidth*e.originalHeight
	}

	function adjustHeight(needAdjustHeightArr){
		var sameKeyHeightCache = {}
		$.each(needAdjustHeightArr,function(i,e){
			var height,
				sameKey = e.sameKey,
				sameKeyCache
			if(sameKey){
				sameKeyCache = sameKeyHeightCache[sameKey]
				if(sameKeyCache && sameKeyCache.originalWidth*e.originalHeight == sameKeyCache.originalHeight*e.originalWidth){
					height = sameKeyCache.height
				}else{
					height = widthToheight(e)
					sameKeyHeightCache[e.sameKey] = {
						height:height,
						originalWidth:e.originalWidth,
						originalHeight:e.originalHeight
					}
				}
			}else{
				height = widthToheight(e)
			}
			e.$dom.css('height',height)
		})
	}
	function setBackgroundCssAndbuildInfoArr($dom,needAdjustHeightArr,noNeedAdjustHeight,sameKey){
		if($dom.css('background-image')){
			$dom.css(backgroundCssObj)
		}
		if(!noNeedAdjustHeight){
			needAdjustHeightArr.push({
				$dom:$dom,
				originalWidth:parseFloat($dom.data('original-width')),
				originalHeight:parseFloat($dom.data('original-height')),
				sameKey:sameKey||null
			})
		}
	}

	backgroundCssObj['-webkit-'+backgroundSizeStr] = backgroundCssObj['-moz-'+backgroundSizeStr] = backgroundCssObj['-ms-'+backgroundSizeStr] = 	backgroundCssObj[backgroundSizeStr] = backgroundSizeValStr

	boxFlexCssArr.push(
		';',boxFlexFatherStr,':',boxFlexFatherValStr,';',
		boxFlexFatherStr,':','-webkit-',boxFlexFatherValStr,';',
		boxFlexFatherStr,':','-moz-',boxFlexFatherValStr,';',
		boxFlexFatherStr,':','-ms-',boxFlexFatherValStr,';'
	)
	boxFlexCssStr = boxFlexCssArr.join('')

	$.fn.fullWidth = function(specifiedHeight){
		var needAdjustHeightArr = [],
			that = this
		this.each(function(i,e){
			setBackgroundCssAndbuildInfoArr(that.eq(i),needAdjustHeightArr,!!specifiedHeight)
		})
		this.css('width','100%')
		if(specifiedHeight){
			this.css('height',specifiedHeight)
		}else{
			if(needAdjustHeightArr.length > 0){
				adjustHeight(needAdjustHeightArr)
				$window.on('resize',function(){
					adjustHeight(needAdjustHeightArr)
				})
			}
		}
		return this
	}

	$.fn.prorate = function(specifiedHeight){
		var $childrens = this.children(),
			needAdjustHeightArr = [],
			that = this
		$childrens.each(function(i,e){
			var $e = $childrens.eq(i),
				flexNum = parseInt($e.data('box-flex')),
				boxFlexChildCssObj
			if(!isNaN(flexNum)){
				flexNum+=''
				boxFlexChildCssObj = {}
				boxFlexChildCssObj['-webkit-'+boxFlexChildStr] = boxFlexChildCssObj['-moz-'+boxFlexChildStr] = boxFlexChildCssObj['-ms-'+boxFlexChildStr] = boxFlexChildCssObj[boxFlexChildStr] = flexNum
				$e.css('display','block').css(boxFlexChildCssObj)
				if(specifiedHeight){
					$e.css('height',specifiedHeight)
				}
				setBackgroundCssAndbuildInfoArr($e,needAdjustHeightArr,!!specifiedHeight,'SK'+flexNum)
			}
		})
		this.each(function(j,k){
			var $k = that.eq(j),
				curStyle = $k.attr('style')
			// all style has the same key -- `display`, so can not use .css({}) directly
			$k.attr('style',curStyle?(curStyle + boxFlexCssStr):boxFlexCssStr)
		})
		if(specifiedHeight){
			this.css('height',specifiedHeight)
		}else{
			if(needAdjustHeightArr.length > 0){
				adjustHeight(needAdjustHeightArr)
				$window.on('resize',function(){
					adjustHeight(needAdjustHeightArr)
				})
			}
		}
		return this
	}
})($)