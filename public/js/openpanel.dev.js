/*!
=====================================

OpenPanel by SONHLAB.com - version 2.1
website: http://sonhlab.com
Documentation: http://docs.sonhlab.com/openpanel-responsive-panel-anywhere/

build - 0006
=====================================
*/
(function($){

	var OpenPanel = function(e, options){
	
		
		//Default settings
		var settings = $.extend({}, $.fn.openpanel.defaults, options);
		
		var $panelid;
		var $pos;
		var $ext;
		var $ajaxtype;
		
		var $winHeight = $(window).height();

		var $maxindex = 0;
		
		var $top;
		
		var $open = 1;
		var $backopen = 0;
		
		var $close;
		
		var $filepath;
		var $paramstring;
		
		
		// Check Station
		if ( ! $('#op-station').length ) {
			$('body').append("<div id='op-station'></div>");
		}
		
		
		// Set Panel Station Height
		$('#op-station').css({'height':$winHeight+'px'});
		
		$('#op-station').find('.op-panel').attr('data-open', 0);
		
		// Panel Scrolling
		$('#op-station').mousewheel(function(event, delta) {
			event.preventDefault();
			this.scrollTop -= (delta * 30);
		});
		
		
		// Set Panel Style
		function setPanelStyle($panelid) {
		
			var $panelHeight;
			var panelObj = {};
			
			// Reset Panel Height
			$('#op-station').find('#'+$panelid).css({'height':'auto'});
			
			// Get the highest z-index of panels
			$("#op-station").find('.op-panel').each(function(){
				var $curindex = parseInt($(this).css("z-index"), 10);
				if( $curindex > $maxindex ) {
					$maxindex = $curindex;
				}
			});
			$maxindex = $maxindex + 1;
			
			$panelHeight = $("#op-station").find('#'+$panelid).height();
			
			if ( $winHeight > $panelHeight ) {
				$panelHeight = $winHeight;
			}

			
			panelObj['height'] = $panelHeight+'px';
			
			panelObj['z-index'] = $maxindex;
			
			// Set style for the opening panel
			if ( $panelid !== undefined ) {
				$('#op-station').find('#'+$panelid).css(panelObj);
			}
			
		}
		
		
		
		
		// Open Panel Function
		function OpenPanelFunc($panelid, $pos, $ext, $ajaxtype) {
			
			if ( !$pos ) {
				$pos = 'none';
			}
			
			// Check Loading Image
			if ( ! $('#op-station').find('#op-loadingholder').length ) {
				$('#op-station').append("<div id='op-loadingholder'><div id='op-loadingicon'></div></div>");
			}
			
			// Show Loading Image
			$('#op-loadingholder').css({'display':'block','z-index':$maxindex});
			
			
			// Load Panel Content
			if ( !$('#'+$panelid).length ) { // Load AJAX Content
				
				// Set Ajax File Path
				if ( $ajaxtype == 'dynamic' ) { // For PHP content
					$filepath = 'content/openpanel/ajaxstation.'+$ext;
					$paramstring = 'panelid='+$panelid;
				}
				else { // For Static HTML content
					$filepath = 'content/openpanel/'+$panelid+'.'+$ext;
					$paramstring = '';
				}
				
				
				// Start AJAX
				$.ajax({
					url: $filepath,
					type:'POST',
					data: $paramstring,
					cache: false,
					success: function(opcontent){
						if (opcontent) {
						
							$('#op-station').append(opcontent);
							if ( $('#op-station').find('#'+$panelid).length > 0 ) {
								
								$('#op-station').css({'display':'block'});
								
								// Set Panel Style
								setPanelStyle($panelid);
								
								// Position Effect
								PostionEffect($pos);

								// Open Panel
								$('#'+$panelid).find('.op-tab').on('click',function(){
									$panelid = $(this).attr('data-panelid');
									
									$pos = $(this).attr('data-pos');
									
									// Get File Extension
									$ext = $(this).attr('data-ext');
									if ( $ext === undefined ) {
										$ext=settings.ext;
										$ajaxtype = 'dynamic';
									}
									else {
										$ajaxtype = 'static';
									}
									

									// Open Panel
									OpenPanelFunc($panelid, $pos, $ext. $ajaxtype);
								});
								
								// Call Close Panel Function
								$('#'+$panelid).find('.op-bt-close').on('click',function() {
									$close = $(this).attr('data-close');
									ClosePanel($close);
								});
								
								// Call Close All Panels Function
								$('#'+$panelid).find('.op-bt-closeall').on('click',function() {
									CloseAllPanels();
								});
				
							}
						}
					},
					error: function(opcontent) {
						// Show Error Warning
						alert('Loading Error: Please check the Panel ID or your Server config.');
						// Hide Loading Image
						$('#op-loadingholder').css({'display':'none'});
					}
				});
				// End AJAX
			}
			else { // Load Inline Content
			
				$('#op-station').css({'display':'block'});
				
				// Set Panel Style
				setPanelStyle($panelid);
				
				// Position Effect
				PostionEffect($pos);
				
			}
			
			

			// Position Effect
			function PostionEffect($pos) {
				var directionObj = {};
				
				// Set Opened Panel Order
				$('#'+$panelid).attr('data-open', $open);
				
				$backopen = $open -1;
				$open++;
				
				$('#op-station').find('.op-panel[data-open="'+$backopen+'"]').css({'position':'fixed'});
				
				
				if ( $pos == 'left' ) {
					directionObj['left'] = '-'+$(window).width()+'px';
					directionObj['top'] = '0px';
					directionObj['display'] = 'block';
					$('#'+$panelid).css(directionObj);
					$('#'+$panelid).animate({'left':'0px'},400,'swing',
					function(){
						// Hide Loading Image
						$('#op-loadingholder').css({'display':'none'});
						
						// Hide Old Panel
						$('#op-station').find('.op-panel[data-open="'+$backopen+'"]').css({'display':'none', 'position':'absolute'});
						
						if ( $open == 2 ) {
							$top = $('html').scrollTop() + $('body').scrollTop();
							$('body').css({'position':'fixed', 'top':'-'+$top+'px'});
						}
						// Hide Page Scroll Bar
						$('body').css({'overflow':'hidden'});
					});
				}
				else if ( $pos == 'right' ) {
					directionObj['left'] = $(window).width()+'px';
					directionObj['top'] = '0px';
					directionObj['display'] = 'block';
					$('#'+$panelid).css(directionObj);
					$('#'+$panelid).animate({'left':'0px'},400,'swing',
					function(){
						// Hide Loading Image
						$('#op-loadingholder').css({'display':'none'});
						
						$('#op-station').find('.op-panel[data-open="'+$backopen+'"]').css({'display':'none', 'position':'absolute'});
						
						if ( $open == 2 ) {
							$top = $('html').scrollTop() + $('body').scrollTop();
							$('body').css({'position':'fixed', 'top':'-'+$top+'px'});
						}
						// Hide Page Scroll Bar
						$('body').css({'overflow':'hidden'});
					});
				}
				else if ( $pos == 'bottom' ) {
					directionObj['top'] = $(window).height()+'px';
					directionObj['display'] = 'block';
					$('#'+$panelid).css(directionObj);
					$('#'+$panelid).animate({'top':'0px'},400,'swing',
					function(){
						// Hide Loading Image
						$('#op-loadingholder').css({'display':'none'});
						
						$('#op-station').find('.op-panel[data-open="'+$backopen+'"]').css({'display':'none', 'position':'absolute'});
						
						if ( $open == 2 ) {
							$top = $('html').scrollTop() + $('body').scrollTop();
							$('body').css({'position':'fixed', 'top':'-'+$top+'px'});
						}
						// Hide Page Scroll Bar
						$('body').css({'overflow':'hidden'});
					});
				}
				
				else if ( $pos == 'top' ) {
					directionObj['top'] = '-'+$(window).height()+'px';
					directionObj['display'] = 'block';
					$('#'+$panelid).css(directionObj);
					$('#'+$panelid).animate({'top':'0px'},400,'swing',
					function(){
						// Hide Loading Image
						$('#op-loadingholder').css({'display':'none'});
						
						$('#op-station').find('.op-panel[data-open="'+$backopen+'"]').css({'display':'none', 'position':'absolute'});
						
						if ( $open == 2 ) {
							$top = $('html').scrollTop() + $('body').scrollTop();
							$('body').css({'position':'fixed', 'top':'-'+$top+'px'});
						}
						// Hide Page Scroll Bar
						$('body').css({'overflow':'hidden'});
					});
				}
				else { // fade effect
					directionObj['top'] = '-2000px';
					directionObj['display'] = 'none';
					$('#'+$panelid).css(directionObj);
					
					$('#'+$panelid).animate({'top':'0px'},10, function() {
						$('#'+$panelid).fadeIn(400, function(){
							// Hide Loading Image
							$('#op-loadingholder').css({'display':'none'});
							
							$('#op-station').find('.op-panel[data-open="'+$backopen+'"]').css({'display':'none', 'position':'absolute'});
							
							if ( $open == 2 ) {
								$top = $('html').scrollTop() + $('body').scrollTop();
								$('body').css({'position':'fixed', 'top':'-'+$top+'px'});
							}
							// Hide Page Scroll Bar
							$('body').css({'overflow':'hidden'});
						});
					});
				}
				
			} // End Position Effect
		
		}
		
		
		
		// Close Panel
		function ClosePanel($close) {
		
			$open--;
			
			if ( $backopen > 0 ) {
				$('#op-station').find('.op-panel[data-open="'+$backopen+'"]').css({'display':'block'});
			}
			$backopen--;

			if ( $open == 1 ) {
				$('body').css({'position':'relative', 'top':0});
				$('html').scrollTop($top);
				$('body').scrollTop($top);
			}
			
			$('#'+$close).fadeOut(400, function(){
			
				$(this).attr('data-open', 0);
					
				if( $('#op-station').find('.op-panel:visible').length == 0 ){
				
					$('#op-station').css({'display':'none'});
						
					// Show Page Scroll Bar
					$('body').css({'overflow':'auto'});
				}
			});
		}
		
		

		// Close All Panels
		function CloseAllPanels() {
			
			$('body').css({'position':'relative', 'top':0});
			$('html').scrollTop($top);
			$('body').scrollTop($top);
				
			$('.op-panel').css({'display':'none'});
			$('#op-station').css({'display':'none'});
				
			// Show Page Scroll Bar
			$('body').css({'overflow':'auto'});
				
			$('#op-station').find('.op-panel').attr('data-open', 0);
			$open = 1;
			
		}
		
		
		// Open Panel
		$('.op-tab').on('click',function(){
			
			$panelid = $(this).attr('data-panelid');
			$pos = $(this).attr('data-pos');
			
			// Get File Extension
			$ext = $(this).attr('data-ext');
			if ( $ext === undefined ) {
				$ext=settings.ext;
				$ajaxtype = 'dynamic';
			}
			else {
				$ajaxtype = 'static';
			}
			
			// Open Panel
			OpenPanelFunc($panelid, $pos, $ext, $ajaxtype);
			
		});
		
		
		
		
		// Call Close Panel Function
		$('#op-station').find('.op-bt-close').on('click',function() {
			$close = $(this).attr('data-close');
			ClosePanel($close);
		});
		
		
		// Close All Panels by Clicking
		$('#op-station').find('.op-bt-closeall').on('click',function() {
			CloseAllPanels();
		});
		
		
		// Close All Panels by ESC key
		if ( settings.enableKeys == true ) {
			$(document).keydown(function(event) {
				if ( event.keyCode == 27 ) {
					CloseAllPanels()
					return false;
				}
			});
		}
		
		
		


		// Auto Open Panel at the First Load
		if ( settings.autoPanel !== undefined ) {
		
			// Panel ID will be opened automatically
			$panelid = settings.autoPanel;
			
			// Get File Extension
			$ext = settings.ext;
			$ajaxtype = 'dynamic';
			
			// Open Panel
			OpenPanelFunc($panelid, $pos, $ext, $ajaxtype);
		}
		
		
		// Resize Window
		function debouncer(func, timeout) {
			var timeoutID, timeout = timeout || 200;
			return function() {
				var scope = this , args = arguments;
				clearTimeout( timeoutID );
				timeoutID = setTimeout( function() {
					func.apply( scope , Array.prototype.slice.call(args));
				}, timeout);
			}
		}
		$(window).resize( debouncer( function () {
		
			var $newPanelHeight;
			
			$winHeight = $(window).height();
			
			// Reset Panel Station Height
			$('#op-station').css({'height':$winHeight+'px'});
			
			// Reset Panel Height
			$('#op-station').find('.op-panel[data-open!="0"]').css({'height':'auto'});
			
			
			var $activepanels = $('#op-station').find('.op-panel[data-open!="0"]').length;
			
			for ( var $j=0; $j<$activepanels; $j++) {
				$newPanelHeight = $('#op-station').find('.op-panel[data-open!="0"]').eq($j).height();
				if ( $winHeight > $newPanelHeight ) {
					$newPanelHeight = $winHeight;
				}
				$('#op-station').find('.op-panel[data-open!="0"]').eq($j).css({'height':$newPanelHeight+'px'});
			}

			
		}));
		// End Resize

	
	};
	
	$.fn.openpanel = function(options) {
	
		return this.each(function(key, value){
			
			// Return early if this element already has a plugin instance
            if ($(this).data('openpanel')) return $(this).data('openpanel');
			
			// Pass options to plugin constructor
			var openpanel = new OpenPanel(this, options);
			
			// Store plugin object in this element's data
            $(this).data('openpanel', openpanel);
		
		});

	};
	
	//Default settings
	$.fn.openpanel.defaults = {
		ext: 'php',
		enableKeys: false
	};	
	
})(jQuery);