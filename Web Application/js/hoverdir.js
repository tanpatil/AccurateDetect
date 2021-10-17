/**
 * jquery.hoverdir.js v1.1.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */

(function(e,t){e.HoverDir=function(t,n){this.$el=e(n);this._init(t)};e.HoverDir.defaults={hoverDelay:0,reverse:false};e.HoverDir.prototype={_init:function(t){this.options=e.extend(true,{},e.HoverDir.defaults,t);this._loadEvents()},_loadEvents:function(){var t=this;this.$el.on("mouseenter.hoverdir, mouseleave.hoverdir",function(n){var r=e(this),i=n.type,s=r.find(".hover"),o=t._getDir(r,{x:n.pageX,y:n.pageY}),u=t._getPosition(o,r);if(i==="mouseenter"){s.css({left:u.from,top:u.to});clearTimeout(t.tmhover);t.tmhover=setTimeout(function(){s.show(0,function(){e(this).stop().animate({top:0,left:0},300)})},t.options.hoverDelay)}else{s.stop().animate({left:u.from,top:u.to},300,function(){s.hide()});clearTimeout(t.tmhover)}})},_getDir:function(e,t){var n=e.width(),r=e.height(),i=(t.x-e.offset().left-n/2)*(n>r?r/n:1),s=(t.y-e.offset().top-r/2)*(r>n?n/r:1),o=Math.round((Math.atan2(s,i)*(180/Math.PI)+180)/90+3)%4;return o},_getPosition:function(e,t){var n,r;switch(e){case 0:if(!this.options.reverse){n=0,r=-t.height()}else{n=0,r=-t.height()}break;case 1:if(!this.options.reverse){n=t.width(),r=0}else{n=-t.width(),r=0}break;case 2:if(!this.options.reverse){n=0,r=t.height()}else{n=0,r=-t.height()}break;case 3:if(!this.options.reverse){n=-t.width(),r=0}else{n=t.width(),r=0}break}return{from:n,to:r}}};var n=function(e){if(this.console){console.error(e)}};e.fn.hoverdir=function(t){if(typeof t==="string"){var r=Array.prototype.slice.call(arguments,1);this.each(function(){var i=e.data(this,"hoverdir");if(!i){n("cannot call methods on hoverdir prior to initialization; "+"attempted to call method '"+t+"'");return}if(!e.isFunction(i[t])||t.charAt(0)==="_"){n("no such method '"+t+"' for hoverdir instance");return}i[t].apply(i,r)})}else{this.each(function(){var n=e.data(this,"hoverdir");if(!n){e.data(this,"hoverdir",new e.HoverDir(t,this))}})}return this}})(jQuery)