CKEDITOR.plugins.add( 'html5video', {
    requires: 'widget',
    lang: 'bg,ca,de,en,eu,es,ru,uk,fr,ko,pt,pt-br,pl',
    icons: 'html5video',
    onLoad: function() {
        CKEDITOR.addCss(
            '.ckeditor-html5-video' +
            '{' +
            'max-width: 100%;' +
            'position: relative;' +
            'background: #EEEEEE;' +
            'border: 3px solid #d7dee3;' +
            'margin-bottom: 18px;' +
            'display: inline-block;' +
            '}' +
            '.ckeditor-html5-video video.lazy' +
            '{' +
            'visibility: hidden;' +
            '}' +
            '.ckeditor-html5-video.float-start' +
            '{' +
            'float: left;' +
            'margin-right: 30px;' +
            'display: block;' +
            '}' +
            '.ckeditor-html5-video.float-end' +
            '{' +
            'float: right;' +
            'margin-left: 30px;' +
            'display: block;' +
            '}' +
            '.ckeditor-html5-video.center' +
            '{' +
            'margin-left: auto;' +
            'margin-right: auto;' +
            'display: table;' +
            '}' +
            '.ckeditor-html5-video.fullwidth' +
            '{' +
            'display: block;' +
            '}' +
            '.ckeditor-html5-video:after' +
            '{' +
            'content: "▶";' +
            'position: absolute;' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'font-size: 60px;' +
            'color: gray;' +
            '}' +

            '.ckeditor-html5-video:not(.aspect_ratio_original):before' +
            '{' +
            'content: "";' +
            'display: block;' +
            '}' +
            '.ckeditor-html5-video:not(.aspect_ratio_original) video' +
            '{' +
            'position: absolute;' +
            'top: 0;' +
            'bottom: 0;' +
            'left: 0;' +
            'width: 100%!important;' +
            'height: 100%!important;' +
            '}' +
            '.ckeditor-html5-video.aspect_ratio_16by9:before' +
            '{' +
            'padding-top: 56.25%;' +
            '}' +
            '.ckeditor-html5-video.aspect_ratio_21by9:before' +
            '{' +
            'padding-top: 42.86%;' +
            '}' +
            '.ckeditor-html5-video.aspect_ratio_4by3:before' +
            '{' +
            'padding-top: 75%;' +
            '}' +
            '.ckeditor-html5-video.aspect_ratio_1by1:before' +
            '{' +
            'padding-top: 100%;' +
            '}'
        );
    },
    init: function( editor ) {
        editor.widgets.add( 'html5video', {
            button: editor.lang.html5video.button,
            template: '<div class="ckeditor-html5-video"></div>',
            /*
             * Allowed content rules (http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules):
             *  - div-s with text-align,float,margin-left,margin-right inline style rules and required ckeditor-html5-video class.
             *  - video tags with src, controls, width and height attributes.
             */
            allowedContent: 'div[data-responsive](!ckeditor-html5-video){text-align,float,margin-left,margin-right}; video[src,poster,controls,autoplay,width, height,loop]{max-width,height};',
            requiredContent: 'div(ckeditor-html5-video); video[src];',
            upcast: function( element ) {
                return element.name === 'div' && element.hasClass( 'ckeditor-html5-video' );
            },
            dialog: 'html5video',
            init: function() {
                var src = '';
                var autoplay = '';
                var loop = '';
                var controls = '';
                var align = 'none';
                var width = '';
                var video_aspect_ratio = 'aspect_ratio_original';
                var poster = '';
                var mute = '';

                if( this.element.hasClass( 'float-start' ) ){
                    align = 'float-start';
                } else if( this.element.hasClass( 'float-end' ) ){
                    align = 'float-end';
                } else if( this.element.hasClass( 'center' ) ){
                    align = 'center';
                } else if( this.element.hasClass( 'fullwidth' ) ){
                    align = 'fullwidth';
                }

                if( this.element.hasClass( 'aspect_ratio_16by9' ) ){
                    video_aspect_ratio = 'aspect_ratio_16by9';
                } else if( this.element.hasClass( 'aspect_ratio_4by3' ) ){
                    video_aspect_ratio = 'aspect_ratio_4by3';
                } else if( this.element.hasClass( 'aspect_ratio_21by9' ) ){
                    video_aspect_ratio = 'aspect_ratio_21by9';
                } else if( this.element.hasClass( 'aspect_ratio_1by1' ) ){
                    video_aspect_ratio = 'aspect_ratio_1by1';
                } else if( this.element.hasClass( 'aspect_ratio_original' ) ){
                    video_aspect_ratio = 'aspect_ratio_original';
                }

                if( this.element.hasClass( 'aspect_ratio_original' ) ){
                    // если соотношение сторон "как у видео"
                    if( this.element.hasClass( 'fullwidth' ) ){
                        width = this.element.getChild( 0 ).getStyle( 'width' ); // width: 100%
                    } else {
                        width = this.element.getChild( 0 ).getStyle( 'width' ).replace('px', '');
                    }
                } else {
                    // если соотношение сторон не как у видео, а фиксированное (используется position absolute)
                    if( this.element.hasClass( 'fullwidth' ) ){
                        width = this.element.getStyle( 'width' ); // width: 100%
                    } else {
                        width = this.element.getStyle( 'width' ).replace('px', '');
                    }
                }

                // If there's a child (the video element)
                if ( this.element.getChild( 0 ) ) {
                    // get it's attributes.
                    src = this.element.getChild( 0 ).getAttribute( 'data-src' );
                    autoplay = this.element.getChild(0).getAttribute('autoplay');
                    loop = this.element.getChild( 0 ).getAttribute( 'loop' );
                    advisorytitle = this.element.getChild( 0 ).getAttribute( 'title' );
                    controls = this.element.getChild(0).getAttribute('controls');
                    mute = this.element.getChild(0).getAttribute('muted');
                    poster = this.element.getChild( 0 ).getAttribute( 'data-poster' );
                }

                if ( src ) {
                    this.setData( 'src', src );

                    if ( align ) {
                        this.setData( 'align', align );
                    } else {
                        this.setData( 'align', 'none' );
                    }

                    if ( width ) {
                        this.setData( 'width', width );
                    }
                    
                    if ( video_aspect_ratio ) {
                        this.setData( 'video_aspect_ratio', video_aspect_ratio );
                    }

                    if (autoplay) {
                        this.setData('autoplay', autoplay);
                    }

                    if (loop) {
                        this.setData('loop', loop);
                    }
								
                    if ( advisorytitle ) {
                        this.setData( 'advisorytitle', advisorytitle );
                    }

                    if (controls) {
                        this.setData('controls', controls);
                    }

                    if (mute) {
                        this.setData('mute', mute);
                    }

                    if ( poster ) {
                        this.setData('poster', poster);
                    }
                }
            },
            data: function() {

                // Выравнивание
                this.element.removeClass( 'float-start' );
                this.element.removeClass( 'float-end' );
                this.element.removeClass( 'center' );
                this.element.removeClass( 'fullwidth' );
                this.element.removeClass( 'none' );
                if (this.data.align) this.element.addClass(this.data.align);
                
                // Соотношение сторон видео
                this.element.removeClass( 'aspect_ratio_original' );
                this.element.removeClass( 'aspect_ratio_16by9' );
                this.element.removeClass( 'aspect_ratio_4by3' );
                this.element.removeClass( 'aspect_ratio_21by9' );
                this.element.removeClass( 'aspect_ratio_1by1' );

                // If there is an video source
                if ( this.data.src ) {
                    // and there isn't a child (the video element)
                    if ( !this.element.getChild( 0 ) ) {
                        // Create a new <video> element.
                        var videoElement = new CKEDITOR.dom.element( 'video' );
                        // Set the controls attribute.
                        if (this.data.controls) {
                            videoElement.setAttribute('controls', 'controls');
                        }
                        // Append it to the container of the plugin.
                        this.element.append( videoElement );
                    }
                    this.element.getChild( 0 ).setAttribute( 'data-src', this.data.src );
                    this.element.getChild( 0 ).addClass('lazy');
                    this.element.getChild( 0 ).addClass('img-fluid');

                    // Соотношение сторон видео
                    if (this.data.video_aspect_ratio) this.element.addClass(this.data.video_aspect_ratio);

                    // Максимальная ширина видео
                    if ( this.data.width ) {
                        if( this.element.hasClass( 'aspect_ratio_original' ) ){
                            // если соотношение сторон "как у видео"
                            if( this.element.hasClass( 'fullwidth' ) ){
                                this.element.getChild( 0 ).setStyle( 'width', this.data.width); // width: 100%
                            } else {
                                this.element.getChild( 0 ).setStyle( 'width', this.data.width + 'px' );
                            }
                            this.element.removeStyle( 'width' );
                        } else {
                            // если соотношение сторон не как у видео, а фиксированное (используется position absolute)
                            if( this.element.hasClass( 'fullwidth' ) ){
                                this.element.setStyle( 'width', this.data.width); // width: 100%
                            } else {
                                this.element.setStyle( 'width', this.data.width + 'px' );
                            }
                            this.element.getChild( 0 ).removeStyle( 'width' );
                        }
                    } else {
                        this.element.removeStyle( 'width' );
                        this.element.getChild( 0 ).removeStyle( 'width' );
                    }

                    if (this.data.poster) {
                        this.element.getChild( 0 ).setAttribute('data-poster', this.data.poster);
                    } else {
                        this.element.getChild( 0 ).removeAttribute( 'data-poster' );
                    }
                }

                if ( this.element.getChild( 0 ) ) {

                    if (this.data.autoplay) {
                        this.element.getChild( 0 ).setAttribute( 'autoplay', 'autoplay' );
                        this.element.getChild( 0 ).setAttribute( 'muted', '' );
                        this.element.getChild( 0 ).setAttribute( 'playsinline', '' );
                    } else {
                        this.element.getChild( 0 ).removeAttribute( 'autoplay' );
                        this.element.getChild( 0 ).removeAttribute( 'muted' );
                        this.element.getChild( 0 ).removeAttribute( 'playsinline' );
                    }

                    if (this.data.loop) {
                        this.element.getChild( 0 ).setAttribute( 'loop', 'loop' );
                    } else {
                        this.element.getChild( 0 ).removeAttribute( 'loop' );
                    }

                    if (this.data.mute) {
                        this.element.getChild(0).setAttribute('muted', 'muted');
                    } else {
                        this.element.getChild(0).removeAttribute('muted');
                    }

                    if ( this.data.advisorytitle ) {
                        this.element.getChild( 0 ).setAttribute( 'title', this.data.advisorytitle );
                    } else {
                        this.element.getChild( 0 ).removeAttribute( 'title' );
                    }

                    if (this.data.controls) {
                        this.element.getChild(0).setAttribute('controls', 'controls');
                    } else {
                        this.element.getChild(0).removeAttribute('controls');
                    }
                }
            }
        } );

        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'html5videoGroup' );
            editor.addMenuItem( 'html5videoPropertiesItem', {
                label: editor.lang.html5video.videoProperties,
                icon: 'html5video',
                command: 'html5video',
                group: 'html5videoGroup'
            });

            editor.contextMenu.addListener( function( element ) {
                if ( element &&
                     element.getChild( 0 ) &&
                     element.getChild( 0 ).hasClass &&
                     element.getChild( 0 ).hasClass( 'ckeditor-html5-video' ) ) {
                    return { html5videoPropertiesItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }

        CKEDITOR.dialog.add( 'html5video', this.path + 'dialogs/html5video.js' );
    }
} );
