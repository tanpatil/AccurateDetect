(function($) {
	'use strict';


	/**
	 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
	 *
	 * jQuery.browser.mobile will be true if the browser is a mobile device
	 *
	 **/
	(function(a) {
		(jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
	})(navigator.userAgent || navigator.vendor || window.opera);

	(function(a) {
		(jQuery.browser = jQuery.browser || {}).ipad = /ipad/i.test(a);
	})(navigator.userAgent || navigator.vendor || window.opera);


	var mobile = jQuery.browser.mobile;
	var ipad = jQuery.browser.ipad;

	$(window).load(function() {
		sharer.init();
		initSlider();
		blog.init();
		if (mobile) {
			sectionManager.load('#home');
			sectionManager.load('#portfolio-section');
			sectionManager.load('#about-section');
			sectionManager.load('#blog-section');
		}

	});

	$(document).ready(function() {
		if ($('.video-content').length > 0) {
			$('.home .video-content').tubular({videoId: 'AVJpr8SAwyM', mute: true, start: 100});
		}
	});

	var blog = {
		sidebar: true,
		init: function() {
			var that = this;
			if (!mobile && !ipad) {
				if($('#blog-section .section-scroll').length === 0)
					return;
				var niceScroll = $("#blog-section .section-scroll").niceScroll();
				niceScroll.scrollend(function(info) {
					setTimeout(function() {
						if (niceScroll.scrollvaluemax === niceScroll.scroll.y) {
							that.loadMore();
						}
					}, 800);
				});
			}
			if (mobile) {
				$('#blog-section').on('click', '.load-more-text', function() {
					that.loadMore();
				});
			}
			if(ipad) {
				$('#blog-section .section-scroll').on('scroll', function(){
					var scrolled = $('#blog-section .section-scroll').scrollTop();
					var distance = $('#blog-section .container-fluid').height() - $('#blog-section .section-scroll').height();
					if(distance - scrolled <= 0) {
						setTimeout(function() {
							that.loadMore();
						}, 800);
					}
				});
			}
			this.overlay.init();
		},
		checkSidebar: function() {
			if (this.sidebar === true) {
				$('#blog-section .sidebar').removeClass('hidden');
			} else {
				$('#blog-section .sidebar').addClass('hidden');
			}
		},
		load: function() {
			var that = this;
			$.get('blog-content-1.php', function(response) {
				that.add(response);
			}, 'html');

			if (!mobile && !ipad) {
				var niceScroll = $("#blog-section .section-scroll").niceScroll();
				if (niceScroll.scrollvaluemax === 0) {
					that.loadMore();
				}
			}
			return true;
		},
		loadMore: function() {
			var that = this;
			var url = '';
			if ($('#blog-section .blog-content .load-more').length > 0)
				url = $('#blog-section .blog-content .load-more').data('href');

			if (url === '' || url === undefined)
				return false;

			$.get(url + '.php', function(response) {
				that.add(response);
			}, 'html');
			return true;
		},
		add: function(response) {
			$('#blog-section .blog-content .load-more').transition({opacity: 0}, 400, function() {
				$(this).remove();
			});

			$('#blog-section .blog-content').append(response);
			$('#blog-section .blog-content').waitForImages({
				finished: function() {
					$('.blog-content .small-post').each(function(i, el) {
						setTimeout(function() {
							$(el).addClass('is-loaded');

							$(el).children('i').remove();
						}, 200 * i);
					});
				},
				waitForAll: true
			});
			if (!mobile && !ipad) {
				$(".section-scroll").getNiceScroll().resize();
			}
			return true;
		},
		overlay: {
			init: function() {
				var that = this;
				$('body').on('click', '.open-post', function(e) {
					e.preventDefault();
					var postUrl = $(this).attr('href');
					historyApi.push(window.location.href + '&post=' + postUrl, '', postUrl, 'open');
					that.open(postUrl);
					$('html').addClass('mobile-overflow');
				});

				$('.single-post-wrapper').on('click', '.close-button', function(e) {
					e.preventDefault();
					var currentUrl = getUrlVars();
					var newUrl = window.location.href.replace('&post=' + currentUrl['post'], "");
					historyApi.push(newUrl, historyApi.oldState.direction, historyApi.oldState.target, 'move');
					that.close($('.single-post-wrapper'));
					$('html').removeClass('mobile-overflow');
				});

				$('.single-post-wrapper').on('click', 'a', function(e) {
					if ($(this).attr('href') === '#')
						e.preventDefault();
				});

			},
			open: function(postUrl) {

				$.get(postUrl + '.php', function(response) {
					$('.single-post-wrapper .blog-content').html(response);
					$('.single-post-wrapper').show(0, function() {
						$(this).transition({opacity: 1});
						sectionManager.animate($('.single-post-wrapper'));
					});
				});
			},
			close: function(el) {
				$(el).transition({opacity: 0}, function() {
					$(el).hide();
				});
			}
		}
	};

	var portfolio = {
		options: {
			portfolioColumns: 3,
			portfolioRows: 2,
			portfolioMobileColumns: 4,
			container: '.masonry-container'
		},
		run: false,
		init: function() {
			if (this.run === true)
				return;

			this.run = true;
			this.container = document.querySelector(this.options.container);
			this.resize();
			this.msnry = new Masonry(this.container, {
				itemSelector: this.options.container + ' a',
				columnWidth: '.mosaic',
				isResizeBound: false,
				transitionDuration: 0,
				hiddenStyle: '',
				visibleStyle: ''
			});
			this.bindRefresh();
			this.bindChangePortfolio();
			this.overlay.init();


		},
		resize: function() {
			if (!mobile) {
				$(this.container).css('height', '100%');
				// this.width = Math.floor($(this.container).width() / this.options.portfolioColumns);
				// this.height = Math.floor($(this.container).height() / this.options.portfolioRows);
				this.width = 420;
				this.height = 300;
				if (this.height === 0)
					this.height = this.width;
			} else {
				this.width = Math.floor($(this.container).width() / this.options.portfolioMobileColumns);
				this.height = this.width;
			}
			$('.mosaic').width(this.width);
			$('.mosaic').height(this.height);
			return true;
		},
		refresh: function() {
			this.resize();
			this.msnry.layout();
			return true;
		},
		bindRefresh: function() {
			var that = this;
			$(window).on('resize', function() {
				that.refresh();
			});
		},
		bindChangePortfolio: function() {
			var that = this;
			$('#portfolio-section .portfolio-list').on('click', 'a', function(e) {
				e.preventDefault();
				that.changeTo($(this).attr('href'));
				$('#portfolio-section .portfolio-list .portfolio-selected').removeClass('portfolio-selected');
				$(this).addClass('portfolio-selected');
			});

			$('.masonry-container').on('click', 'a.show-more', function(e) {
				e.preventDefault();
				that.changeTo($(this).attr('href'));
				$(this).addClass('portfolio-selected');
			});
		},
		changeTo: function(url) {
			var that = this;
			var removeTime = 50;
			var items = $(this.options.container + ' a');
			var itemsLength = items.length - 1;
			items.each(function(i, el) {
				$(el).delay(removeTime * i).transition({opacity: 0}, function() {
					if (i === itemsLength) {
						that.msnry.remove(that.msnry.getItemElements());
						that.load(url);
					}
				});
			});
			return true;
		},
		add: function(items) {

			$('.masonry-container').append(items);
			this.msnry.addItems(items);
			this.resize();
			$('.masonry-container figure').each(function(i, el) {
				$(el).waitForImages(function() {
					$(this).parent().addClass('is-loaded');
					$(this).parent().find('i').remove();
				}, $.noop, true);
			});
			$('.masonry-container .open-portfolio').each(function() {
				$(this).hoverdir();
			});
			return true;
		},
		load: function(url) {
			if (this.masonry === undefined)
				this.init();
			var that = this;
			if (url === undefined)
				url = 'portfolio-content/portfolio_more_1';
			$.get(url + '.php', function(response) {
				var data = $(response).filter('a.hover-portfolio.mosaic');
				if (portfolio.add(data))
					portfolio.refresh();
			}, 'html');
			return true;
		},
		overlay: {
			carousel: false,
			isLarge: false,
			isAnimating: false,
			init: function() {
				var that = this;
				$('body').on('click', '.open-portfolio', function(e) {
					e.preventDefault();
					var postUrl = $(this).attr('href');
					historyApi.push(window.location.href + '&portfolio=' + postUrl, '', postUrl, 'openPortfolio');
					that.open($(this).attr('href'));
					$('html').addClass('mobile-overflow');
				});

				$('.portfolio-overlay').on('click', '.close-button, .close-overlay', function(e) {
					e.preventDefault();
					var currentUrl = getUrlVars();
					var newUrl = window.location.href.replace('&portfolio=' + currentUrl['portfolio'], "");
					historyApi.push(newUrl, historyApi.oldState.direction, historyApi.oldState.target, 'move');
					that.close();
					$('html').removeClass('mobile-overflow');
				});

				$(".portfolio-overlay").on('click', '.hover-fullscreen, .fullscreen-button', function(e) {
					e.preventDefault();
					that.toggleFullscreen();
				});

				$(".portfolio-overlay").on('click', '.hover-normal-size', function(e) {
					e.preventDefault();
					that.toggleNormal();
				});

			},
			initCarousel: function() {
				var owl = $('#portfolio-images');
				$('.portfolio-content .gallery').css('opacity', 0);
				$('#portfolio-images').imagesLoaded(function(){
					owl.owlCarousel({
						transitionStyle: 'fadeUp',
						slideSpeed: 600,
						paginationSpeed: 400,
						singleItem: true,
						navigation: true,
						responsive: true,
						navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
						afterInit: function() {
							var that = this;
							that.owlControls.prependTo($(".controls"));

								$('#portfolio-images .owl-item img').each(function(i, el) {
									if(el.offsetWidth !== 0)
										$(el).css('margin-left', -(el.offsetWidth / 2))
									if(el.offsetHeight !== 0)
										$(el).css('margin-top', -(el.offsetHeight / 2));
								});
								$('.portfolio-content .gallery').css('opacity', 1);

						},
						afterUpdate: function() {
							$('#portfolio-images .owl-item img').each(function(i, el) {
								if(el.offsetWidth !== 0) {
									$(el).css('margin-left', -(el.offsetWidth / 2));
								}
								if(el.offsetHeight !== 0) {
									$(el).css('margin-top', -(el.offsetHeight / 2));
								}
							});
						}
					});
				});

				$(document.documentElement).on('keyup.portfolio', function(event) {
					// handle cursor keys
					if (event.keyCode === 37) {
						$('#portfolio-images').data('owlCarousel').prev();
					} else if (event.keyCode === 39) {
						$('#portfolio-images').data('owlCarousel').next();
					}
				});	},
					
			open: function(url) {
				var that = this;

				if (url === undefined || url === '')
					return false;

				$.get(url + '.php', function(response) {
					$('.portfolio-overlay').html(response);
					that.initCarousel();
					$('.portfolio-overlay').show(0, function() {
						$(this).transition({x: 0, opacity: 1}).addClass('overlay-active');
					});
				}, 'html');
			},
			close: function() {
				var that = this;
				$('.portfolio-overlay').transition({x: -90, opacity: 0}, function() {
					$(this).removeClass('overlay-active').hide();
					if($('#portfolio-images').data('owlCarousel')) {
						$('#portfolio-images').data('owlCarousel').destroy();
					} 
					$(document.documentElement).off('keyup.portfolio');
					that.isLarge = false; 
					that.isAnimating = false; 
					$(".portfolio-overlay").removeClass('full-image');
					$('.portfolio-overlay').removeClass('large-image');
				});
			},
			toggleFullscreen: function() {
				var that = this;
				if (this.isLarge === false && this.isAnimating === false) {
					this.isAnimating = true;
					$(".portfolio-overlay").addClass('full-image');
					$('.portfolio-overlay .gallery').transition({opacity: 0}, function() {
						$('.portfolio-overlay').addClass('large-image');
						var owl = $('#portfolio-images').data('owlCarousel');
						var current = owl.currentItem;
						owl.reinit();
						owl.jumpTo(current);
						$(this).transition({opacity: 1});
					});
					$(".portfolio-overlay article").transition({x: '-100%'}, function() {
						that.Animating = false;
					});
					$('.controls2').transition({opacity: 0}).removeClass('hidden').transition({opacity: 1});
					$('.hover-fullscreen').addClass('hidden');
					$('.hover-normal-size, .close-overlay').transition({opacity: 0}).removeClass('hidden').transition({opacity: 1}, function() {
						that.isLarge = true;
						that.isAnimating = false;
					});
				}
			},
			toggleNormal: function() {
				var that = this;
				if (this.isLarge === true && this.isAnimating === false) {
//				isAnimating = true;
					$(".portfolio-overlay").removeClass('full-image');
					$('.portfolio-overlay .gallery').transition({opacity: 0}, function() {
						$('.portfolio-overlay').removeClass('large-image');
						var owl = $('#portfolio-images').data('owlCarousel');
						var current = owl.currentItem;
						owl.reinit();
						owl.jumpTo(current);
						$(this).transition({opacity: 1}, function() {
//						isAnimating = false;
						});
					});

					$('.portfolio-overlay article').transition({x: 0});

					$('.controls2').transition({opacity: 0}).addClass('hidden').transition({opacity: 1}, function() {
						that.isLarge = false;
						that.isAnimating = false;

					});
					$('.hover-normal-size, .close-overlay').addClass('hidden');
					$('.hover-fullscreen').removeClass('hidden');
				}
			}
		}
	};

	var sharer = {
		socials: {
			'facebook': 'https://www.facebook.com/sharer/sharer.php?u={url}',
			'twitter': 'https://www.twitter.com/share?text={url}',
			'google+': 'https://plus.google.com/share?url={url}',
			'tumblr': 'http://www.tumblr.com/share/link?url={url}&name={title}&description={desc}',
			'pinterest': 'https://pinterest.com/pin/create/bookmarklet/?media={img}&url={url}&is_video=0&description={title}',
		},
		init: function() {
			var that = this;

			$('body').on('click', 'a.share-content', function(e) {
				e.preventDefault();
				that.open(this.href, $(this).data());
				$('html').addClass('mobile-share-overflow');
			});
			$('.overlay').on('click', '.close-button', function(e) {
				e.preventDefault();
				that.close();
				$('html').removeClass('mobile-share-overflow');
			});

			$('.share-overlay ul').on('click', 'a', function(e) {
				e.preventDefault();
				var winHeight = 300;
				var winWidth = 500;
				var winTop = (screen.height / 2) - (winHeight / 2);
				var winLeft = (screen.width / 2) - (winWidth / 2);
				window.open(this.href, this.title, 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
			});

		},
		open: function(url, data) {
			var title = data.title;
			var desc = data.desc;
			var img = data.img;
			url = url.replace(/.*?:\/\//g, "");
			$('ul.share-type').html("");
			$.each(this.socials, function(key, el) {
				var href = el
						.replace("{url}", encodeURI(url))
						.replace('{title}', title)
						.replace('{desc}', desc)
						.replace('{img}', img);
				$('ul.share-type').append('<li><a href="' + href + '" title="' + key + '">' + key + '</a></li>');
			});
			$('.share-overlay').transition({x: 0, opacity: 0.9}).addClass('overlay-active-share');
		},
		close: function() {
			$('.overlay').transition({x: -90, opacity: 0}, function() {
				$(this).removeClass('overlay-active-share');
			});
		}
	};

	var sectionManager = {
		portfolio: false,
		about: false,
		blog: false,
		home: false,
		load: function(section) {

			if (section === '#home' && this.home === false) {
				this.home = true;
			}

			if (section === '#portfolio-section') {
				if(this.portfolio === false) {
					this.portfolio = true;
					portfolio.load();
				}
				portfolio.refresh();
			}

			if (section === '#about-section' && this.about === false) {
				this.about = true;
				about.init();
				about.load();
			}

			if (section === '#blog-section') {
				if (this.blog === false) {
					this.blog = true;
					blog.load();
				}
			}
			this.animate($(section));
		},
		animate: function(container) {
			$('.home #close-subnav').remove();
			var $obj = container.find('.yo-anim').each(function() {
				var delay = $(this).data('animation-delay');

				if (delay) {
					var $this = $(this);
					setTimeout(function() {
						$this.addClass('yo-anim-start');
					}, delay);
				} else {
					$(this).addClass('yo-anim-start');
				}

			});
			container.find('.full .overlay-image').waitForImages(function() {
				$(this).addClass('is-loaded');
			}, $.noop, true);			
		},
		reset: function(container) {
			container.find('.yo-anim-start').removeClass('yo-anim-start');
		}
	};

	$("a[rel='tooltip']").tooltip();

	var about = {
		init: function() {
			if (mobile)
				return;

			var that = this;
			var owl = $("#team-carousel");
			owl.owlCarousel({
				slideSpeed: 600,
				paginationSpeed: 400,
				mouseDrag: false,
				singleItem: false,
				items: 2,
				lazyLoad: true,
				navigation: true,
				navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
				afterInit: function() {
					this.owlControls.prependTo($(".controls-team"));
				},
				itemsCustom: [
					[0, 1],
					[768, 2],
					[900, 2]
				],
				afterMove: function() {
					that.select();
				}
			});

			var owlData = owl.data('owlCarousel');

			$('#team-carousel').on('click', '.item.active-member', function(e) {
				e.preventDefault();
				owlData.prev();
			});

			$('#team-carousel').on('click', '.item:not(.active-member)', function(e) {
				e.preventDefault();
				owlData.next();
			});

			$(document.documentElement).keyup(function(event) {
				// handle cursor keys
				if ($('#about-section').hasClass('pt-page-current')) {
					if (event.keyCode === 37) {
						owlData.prev();
					} else if (event.keyCode === 39) {
						owlData.next();
					}
				}
			});

		},
		select: function() {
			var owl = $("#team-carousel").data('owlCarousel');
			var currentItem = $('#team-carousel .item').eq(owl.currentItem);
			var prevItem = $('#team-carousel .item').eq(owl.prevItem);
			currentItem.addClass('active-member');
			prevItem.removeClass('active-member');
			$('.team-info-wrapper').transition({opacity: 0, y: -30}, function() {
				$('.team-info-wrapper').html(currentItem.find('.team-info').html()).transition({opacity: 1, y: 0});
			});
		},
		load: function() {
			var url = 'team-content';
			var owl = $("#team-carousel").data('owlCarousel');
			$.get(url + '.php', function(response) {
				if (!mobile)
					owl.addItem(response);
				else {
					$('#team-carousel').html(response);
				}

				$('#team-carousel .item').each(function(i, el) {
					$(el).waitForImages(function() {
						$(this).addClass('is-loaded');
						$(this).children('i').remove();
					}, $.noop, true);
				});
				if (!mobile) {
					var currentItem = $('#team-carousel .item').eq(owl.currentItem);
					$('.team-info-wrapper').html(currentItem.find('.team-info').html());
				}

			}, 'html');
			return true;
		}
	};

	var historyApi = {
		oldState: '',
		push: function(url, direction, target, type) {
			if (mobile)
				return false;
			if (history.state) {
				this.oldState = history.state;
			}
			;
			var stateObj = {url: url, direction: direction, target: target, type: type};
			history.pushState(stateObj, '', stateObj.url);
			$("body").addClass("historypushed");
			this.before = type;
			this.direction = direction;
		},
		changeBeforeState: function(state, direction) {
			if (mobile)
				return false;
			this.before = state;
			this.direction = direction;
		},
		replace: function(url, direction, target, type) {
			if (mobile)
				return false;
			var stateObj = {url: url, direction: direction, target: target, type: type};
			history.replaceState(stateObj, '', stateObj.url);
			this.before = type;
			this.direction = direction;
		},
	};

	// form validation
	var checkEmail = function(email) {
		var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return emailRegex.test(email);
	};

	$(document).on("focus", ".contact-form", function(e) {
		$(this).removeClass('message-error');
	});

	$(document).on("submit", "#contact-form", function(e) {
		e.preventDefault();

		var errors = false;

		var name = $('#form-name');
		var email = $('#form-email');
		var subject = $('#form-subject');
		var text = $('#form-message');

		if (name.val().length === 0) {
			name.addClass('message-error');
			errors = true;
		} else {
			name.removeClass('message-error');
		}

		if (!checkEmail(email.val())) {
			email.addClass('message-error');
			errors = true;
		} else {
			email.removeClass('message-error');
		}

		if (subject.val().length === 0) {
			subject.addClass('message-error');
			errors = true;
		} else {
			subject.removeClass('message-error');
		}

		if (text.val().length === 0) {
			text.addClass('message-error');
			errors = true;
		} else {
			text.removeClass('message-error');
		}

		if (!errors) {
			$.post("contact-send.php", $('#contact-form').serialize(), function(responseData) {
				if (responseData.success) {
					$("#contact-form .message-success").removeClass('hidden');
					setTimeout(function () {
						$("#contact-form .message-success").addClass('hidden');
					}, 3000);
					name.val('');
					email.val('');
					subject.val('');
					text.val('');

					$("#contact-form .buttonform").addClass('transparent');
				} else {
					$.each(responseData.data, function(i, e) {
						$('#' + e.id).addClass('message-error');
					});
				}
			}, 'json');
		}
	});


	$(".single-post-wrapper").on('submit', '#comment-form', function(e) {
		e.preventDefault();
		$('#comment-form .comment-form').removeClass('#comment-form message-error');
		$.post("comment-send.php", $('.comment-form').serialize(), function(data) {
			if (data.status === 'ok') {
				var content = '<div class="comment"><a href="' + data.email + '" class="avatar"><figure><img src="img/2.jpg"/></figure></a><header><h4 class="author-comment pull-left">' + data.author + '</h4><div class="date-comment pull-right">' + data.date + '</div></header><div class="comment-content"><p>' + data.text + '</p></div></div>';
				$("#comment-form .message-success").removeClass('hidden');
				$("#comment-form .buttonform").addClass('transparent');
				$('.comments').prepend(content);
			} else {
				$.each(data.errors, function(i, e) {
					$('.' + i).addClass('message-error');
				});
			}
		}, 'json');
	});


	$(".single-post-wrapper").on('keyup', '.comment-form', function() {
		var that = this;
		if ($(this).val() !== '') {
			$(this).removeClass('message-error');
		} else {
			$(that).addClass('message-error');
		}
	});

	$('.open-submenu').click(function() {
		openSubnav($(this).data('position'));
		$('.pt-page .back-button').show();
	});

	$('.home').on('click', '#close-subnav', function() {
		var direction = $(this).data('direction');
		$('.home #close-subnav').remove();
		$('.home').transition({x: 0, y: 0});
		$('.menu-' + direction + ' .nav-wrapper').transition({opacity: 0});
		$('.home').data('direction', 'center').removeClass('subnav-is-active');
		$('.sub-nav.is-active').transition({opacity: 0}, function() {
			$('.sub-nav.is-active').removeClass('is-active').hide();
		});
	});

	var transforms = {
		'top': {'axis': 'y', 'value': 90},
		'left': {'axis': 'x', 'value': 200},
		'right': {'axis': 'x', 'value': -200},
		'bottom': {'axis': 'y', 'value': -90}};

	function openSubnav(direction) {
		if ($('.home').data('direction') !== direction) {
			if ($('.home').data('direction') !== 'center') {
				// close nav
				$('.home').transition({x: 0, y: 0}).removeClass('subnav-is-active');
				$('.menu-' + direction + ' .nav-wrapper').transition({opacity: 0});
				$('.sub-nav.is-active').transition({opacity: 0}, function() {
					$('.sub-nav.is-active').removeClass('is-active').hide();
				});
			}

			// open menu
			var axis = transforms[direction]['axis'];
			var value = transforms[direction]['value'];

			if (axis === 'x') {
				$('.home').transition({x: value}, function() {
					$('.home').append('<div id="close-subnav" data-direction="' + direction + '" style="position: absolute; left: 0; top: 0; height: 100%; width: 100%; z-index:999; cursor: pointer"></div>');
				});
			}
			else {
				$('.home').transition({y: value}, function() {
					$('.home').append('<div id="close-subnav" data-direction="' + direction + '" style="position: absolute; left: 0; top: 0; height: 100%; width: 100%; z-index:999; cursor: pointer"></div>');
				});
			}
			$('.home').data('direction', direction);
			$('.menu-' + direction + ' .nav-wrapper').delay(400).transition({opacity: 1});
		} else {
			// close nav
			$('.home #close-subnav').remove();
			$('.home').transition({x: 0, y: 0});
			$('.menu-' + direction + ' .nav-wrapper').transition({opacity: 0});
			$('.home').data('direction', 'center').removeClass('subnav-is-active');
			$('.sub-nav.is-active').transition({opacity: 0}, function() {
				$('.sub-nav.is-active').removeClass('is-active').hide();
			});
		}

	}

	function openSubmenu(el) {
		var position = $('.home').data('direction');
		var axis = transforms[position]['axis'];
		var value = transforms[position]['value'] * 2;

		if (!$('.home').hasClass('subnav-is-active')) {
			if (axis === 'x') {
				$('.home').transition({x: value});
				$('.home').addClass('subnav-is-active');
			}
			else {
				$('.home').transition({y: value});
				$('.home').addClass('subnav-is-active');
			}
		}

		if ($('.sub-nav.is-active').length > 0) {
			$('.sub-nav.is-active').transition({opacity: 0}, function() {
				$('.sub-nav.is-active').removeClass('is-active').hide();
				$(el).next($(el).data('target')).addClass('is-active').show(0, function() {
					$(this).transition({opacity: 1});
				});
			});
		} else {
			$(el).next($(el).data('target')).addClass('is-active').show(0, function() {
				$(this).transition({opacity: 1});
			});
		}
	}

	$('body').on('click', '.sub-nav li > a', function(e) {
		e.preventDefault();
		$('.home').data('direction', 'center').removeClass('subnav-is-active');
		$('.nav-wrapper').transition({opacity: 0}, function() {
		});

	});

	$(document).ready(function() {
		if (!mobile) {
			if(!ipad) {
				$('.section-scroll, .full-post').niceScroll({horizrailenabled: false}).resize();
				$('#team .team-info-wrapper').niceScroll({horizrailenabled: false, railalign: "left"}).resize();
			}
		} else {
			$('body').removeClass('yo-anim-enabled');
		}
	});


	$('.reorder a').click(function(e) {
		e.preventDefault();
		if ($('body').hasClass('mobile-nav-show')) {
			$(this).parent().removeClass('flyout-open');
			$('#flyout-container').animate({height: 0}, function() {
				$('#flyout-container .open').css('height', 0).removeClass('open');
				$('#flyout-container .subnav-open').removeClass('subnav-open');
			});

			$('body').removeClass('mobile-nav-show');
		} else {
			$(this).parent().addClass('flyout-open');
			$('#flyout-container').animate({height: $('#flyout-container .flyout-menu > li').height() * $('#flyout-container .flyout-menu > li').length}, function() {
				$('#flyout-container').css('height', 'auto');
			});
			$('body').addClass('mobile-nav-show');
		}
	});

	$('#menu-mobile .menu-item a').on('click', function(e) {
		e.preventDefault();
//	close mobile menu after link

		$(".flyout-menu .open-children").parent().removeClass('subnav-open');
		$('#flyout-container').animate({height: 0}, function() {
			$('#flyout-container .open').css('height', 0).removeClass('open');
			$('body').removeClass('mobile-nav-show');
		});

		$('html, body').animate({
			scrollTop: $($(this).data('target')).offset().top - ($('#menu-mobile').height())
		}, 500);
	});

	$('.flyout-menu .open-children').click(function(e) {
		e.preventDefault();
		var that = this;
		if ($(this).next('.subnav').length > 0) {
			//has submenu
			if ($(this).next('.subnav').hasClass('open')) {

				$(this).parent().removeClass('subnav-open');

				$(this).next('.subnav').animate({height: 0}, function() {
					$(that).next('.open').removeClass('open');
					$(that).next('.subnav').find('.open').css('height', 0).removeClass('open');
					$(that).next('.subnav').find('.subnav-open').removeClass('subnav-open');
				});
			} else {
				$(this).parent().addClass('subnav-open');
				$(this).next('.subnav').animate({height: $(this).next('.subnav').children('li').height() * $(this).next('.subnav').children('li').length}, function() {
					$(that).next('.subnav').css('height', 'auto').addClass('open');
				});
			}
		}
	});

	var PageTransitions = (function() {
		if (mobile)
			return;
		var $main = $('#pt-main'),
				$pages = $main.children('div.pt-page'),
				current = '.pt-page-1',
				endCurrPage = false,
				endNextPage = false,
				animEndEventNames = {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed('animation') ],
				// support css animations
				support = Modernizr.cssanimations;

		function init() {
			$pages.each(function() {
				var $page = $(this);
				$page.data('originalClassList', $page.attr('class'));
			});

			$(current).addClass('pt-page-current');

			$('.blog-without-sidebar').click(function() {
				blog.sidebar = false;
				blog.checkSidebar();
			});

			$('.blog-with-sidebar').click(function() {
				blog.sidebar = true;
				blog.checkSidebar();
			});

			$('.nav-wrapper .dl-submenu li a').click(function(e) {
			console.log(e);
				var that = this;
				e.preventDefault();
				if ($(that).next('ul').length > 0) {
				console.log("inside here");
					//unfold sub menu
					openSubmenu(that);
				} else {
				console.log("inside else");
					if ($(this).data('target') !== undefined) {
					console.log("target undefined");
						historyApi.push(this.href, $('.home').data('direction'), $(this).data('target'), 'move');
						nextPage($('.home').data('direction'), $(this).data('target'));
					} else {
						window.open("http://www.lucy.ws/resume.pdf");
					}
				}
			});

			$('.dl-submenu.section-nav li a').click(function(e) {
				var that = this;
				e.preventDefault();
				if ($(that).next('ul').length > 0) {
					//unfold sub menu
					openSubmenu(that);
				} else {
					if ($(this).data('target') !== undefined) {
						historyApi.push(this.href, $(this).parent().data('position'), $(this).data('target'), 'move');
						nextPage($(this).parent().data('position'), $(this).data('target'));
					}

				}
			});

			$('body').on('click', '.change-section', function(e) {
				e.preventDefault();
				if ($(this).data('target') !== undefined && $(this).data('direction') !== undefined) {
					historyApi.push(this.href, $(this).data('direction'), $(this).data('target'), 'move');
					nextPage($(this).data('direction'), $(this).data('target'));
				}
			});

			$('.pt-page .back-button').click(function(e) {
				e.preventDefault();
				historyApi.push($(this).find('a').attr('href'), $(this).data('back'), $(this).data('target'), 'move');
				nextPage($(this).data('back'), $(this).data('target'));
			});

			var currentUrl = getUrlVars();
			if (currentUrl['p'] !== undefined) {
				if (currentUrl['p'] !== 'home') {
					var url = '#' + currentUrl['p'] + '-section';
					nextPage('right', url);
					historyApi.replace(window.location.href, 'right', url, 'move');
				} else {
					historyApi.replace('index.php?p=home', '', '#home', 'move');
					sectionManager.load('#home');
				}
			} else {
				historyApi.replace('index.php?p=home', '', '#home', 'move');
				sectionManager.load('#home');
			}
			if (currentUrl['post'] !== undefined)
				blog.overlay.open(currentUrl['post']);
			if (currentUrl['portfolio'] !== undefined)
				portfolio.overlay.open(currentUrl['portfolio']);

		}

		function nextPage(animation, target) {
			if (animation === undefined || target === undefined) {
				return false;
			}

			var $currPage = $(current);
			current = target;

			var $nextPage = $(target).addClass('pt-page-current'),
					outClass = '', inClass = '', backClass = '', arrowClass = '', backDirection = '', pageDirection = '';

			switch (animation) {
				case 'right':
					outClass = 'pt-page-moveToLeft';
					inClass = 'pt-page-moveFromRight';
					backClass = 'button-left';
					arrowClass = 'arrow-left';
					backDirection = 'left';
					pageDirection = 'right';
					break;
				case 'left':
					outClass = 'pt-page-moveToRight';
					inClass = 'pt-page-moveFromLeft';
					backClass = 'button-right';
					arrowClass = 'arrow-right';
					backDirection = 'right';
					pageDirection = 'left';
					break;
				case 'bottom':
					outClass = 'pt-page-moveToTop';
					inClass = 'pt-page-moveFromBottom';
					backClass = 'button-top';
					arrowClass = 'arrow-up';
					backDirection = 'top';
					pageDirection = 'bottom';
					break;
				case 'top':
					outClass = 'pt-page-moveToBottom';
					inClass = 'pt-page-moveFromTop';
					backClass = 'button-bottom';
					arrowClass = 'arrow-down';
					backDirection = 'bottom';
					pageDirection = 'top';
					break;
			}

			$nextPage.children('.page-content').removeClass($nextPage.children('.page-content').data('position'));

			$nextPage.find('.back-button').removeClass().addClass('back-button').find('.fa').removeClass().addClass('fa');
			$nextPage.find('.back-button').data('back', backDirection).data('target', '#home').addClass(backClass).find('.fa').addClass(arrowClass);

			$nextPage.children('.page-content').data('position', 'page-' + pageDirection).addClass('page-' + pageDirection);
			$currPage.addClass(outClass).on(animEndEventName, function() {
				$currPage.off(animEndEventName);
				endCurrPage = true;
				if (endNextPage) {
					onEndAnimation($currPage, $nextPage);
				}
			});

			$nextPage.addClass(inClass).on(animEndEventName, function() {
				$nextPage.off(animEndEventName);
				endNextPage = true;
				if (endCurrPage) {
					onEndAnimation($currPage, $nextPage);
				}
			});

			if (!support) {
				onEndAnimation($currPage, $nextPage);
			}
		}

		function onEndAnimation($outpage, $inpage) {
			endCurrPage = false;
			endNextPage = false;
			resetPage($outpage, $inpage);

			sectionManager.load($inpage.selector);
		}

		function resetPage($outpage, $inpage) {
			sectionManager.reset($($outpage.selector));
			$outpage.attr('class', $outpage.data('originalClassList'));
			$outpage.transition({x: 0, y: 0}, 0);
			$inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
		}

		var addEvent = (function() {
			if (document.addEventListener) {
				return function(el, type, fn) {
					if (el && el.nodeName || el === window) {
						el.addEventListener(type, fn, false);
					} else if (el && el.length) {
						for (var i = 0; i < el.length; i++) {
							addEvent(el[i], type, fn);
						}
					}
				};
			} else {
				return function(el, type, fn) {
					if (el && el.nodeName || el === window) {
						el.attachEvent('on' + type, function() {
							return fn.call(el, window.event);
						});
					} else if (el && el.length) {
						for (var i = 0; i < el.length; i++) {
							addEvent(el[i], type, fn);
						}
					}
				};
			}
		})();

		addEvent(window, 'popstate', function(event) {
			if (!$("body").hasClass("historypushed"))
				return;
			var data = event.state;
			if (data === null || data.target === "#home") {
				nextPage($('.pt-page-current .back-button').data('back'), '#home');
				if ((data.type === 'move' || data.type === 'close') && historyApi.before === 'open') {
					blog.overlay.close('.single-post-wrapper');
					historyApi.changeBeforeState(data.type);
				} else if (data.type === 'open' && (historyApi.before === 'move' || historyApi.before === 'close')) {
					blog.overlay.open(data.target);
					historyApi.changeBeforeState(data.type);
				} else if ((data.type === 'move' || data.type === 'closePortfolio') && historyApi.before === 'openPortfolio') {
					portfolio.overlay.close();
					historyApi.changeBeforeState(data.type);
				} else if (data.type === 'openPortfolio' && (historyApi.before === 'move' || historyApi.before === 'closePortfolio')) {
					portfolio.overlay.open(data.target);
					historyApi.changeBeforeState(data.type);
				}
			}
			else {
				if ((data.type === 'move' || data.type === 'close') && historyApi.before === 'open') {
					blog.overlay.close('.single-post-wrapper');
					historyApi.changeBeforeState(data.type);
				} else if (data.type === 'open' && (historyApi.before === 'move' || historyApi.before === 'close')) {
					blog.overlay.open(data.target);
					historyApi.changeBeforeState(data.type);
				} else if (event.state.direction !== 'center' && data.type === 'move' && historyApi.before === 'move') {
					var newDirection = $('.pt-page-current .back-button').data('back');
					if (newDirection === undefined)
						newDirection = event.state.direction;

					nextPage(newDirection, event.state.target);
					historyApi.changeBeforeState(event.state.type, event.state.direction);
				} else if ((data.type === 'move' || data.type === 'closePortfolio') && historyApi.before === 'openPortfolio') {
					portfolio.overlay.close();
					historyApi.changeBeforeState(data.type);
				} else if (data.type === 'openPortfolio' && (historyApi.before === 'move' || historyApi.before === 'closePortfolio')) {
					portfolio.overlay.open(data.target);
					historyApi.changeBeforeState(data.type);
				} else if (data.type === 'close' && historyApi.before === 'move') {
					nextPage('right', event.state.target);
				}
				else {
					historyApi.changeBeforeState(event.state.type);
					nextPage('right', event.state.target);
				}
			}
		});

		init();

		return {init: init};

	})();



	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
			vars[key] = value;
		});
		return vars;
	}

	var sliderInfinite = false;
	function initSlider() {
		$.fn.superslides.fx = $.extend({
			fadeTransition: function(orientation, complete) {

				var that = this,
						$children = that.$container.children(),
						$outgoing = $children.eq(orientation.outgoing_slide),
						$target = $children.eq(orientation.upcoming_slide);

				if (sliderInfinite === false) {
					if (orientation.outgoing_slide > orientation.upcoming_slide)
						return;
				}

				$('.progressbar').animate({height: 2}, {
					duration: that.options.play,
					complete: function() {
						$('.progressbar').css({width: 0, transition: 'none'});
					},
					start: function() {
						$('.progressbar').css({width: '100%', transition: 'width ' + that.options.play + 'ms linear'});
					}
				}
				);

				$target.css({left: this.width, opacity: 1, display: 'block'});
				$('.slides-text li:eq(' + orientation.outgoing_slide + ') .slide-content-wrapper').removeClass('current-slide');
				$('.slides-text li:eq(' + orientation.upcoming_slide + ') .slide-content-wrapper').addClass('current-slide');
				if (orientation.outgoing_slide >= 0) {
					$outgoing.transition({opacity: 0}, that.options.animation_speed, function() {
						if (that.size() > 1) {
							$children.eq(orientation.upcoming_slide).css({zIndex: 2});
							if (orientation.outgoing_slide >= 0) {
								$children.eq(orientation.outgoing_slide).css({opacity: 1, display: 'none', zIndex: 0});
							}
						}
						complete();
					});
				} else {
					$target.css({zIndex: 2});
					complete();
				}
			}

		}, $.fn.superslides.fx);


		var count = $('.slides-container li').length;
		$('#slides').transition({opacity: 0}, 0, function() {
			$('.slides-container li').each(function(i, element) {
				var img = $(element).find('img');
				img.attr({'src': img.data('src')});
				if (!--count) {
					$('.slider-wrapper').imagesLoaded(function() {
						jQuery(window).resize();
						$('.loading-container').transition({opacity: 0}, function() {
							$('#slides').transition({opacity: 1}, 2000);
						});
					});
				}
			});
		});

		$('#slides').superslides({
			animation: 'fadeTransition',
			animation_speed: 2000,
			play: 3000,
			inherit_height_from: '.home',
		});

		$('#arrow-right').click(function(e) {
			e.preventDefault();
			$('#slides').superslides('animate', 'next');
		});
		$('#arrow-left').click(function(e) {
			e.preventDefault();

			$('#slides').superslides('animate', 'prev');
		});
	}


	$('.switcher').click(function(e) {
		$('.switcher-overlay').transition({x: 0, opacity: 0.9}).addClass('overlay-active-share');
		e.preventDefault();

	});


})(jQuery);