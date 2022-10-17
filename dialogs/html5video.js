CKEDITOR.dialog.add( 'html5video', function( editor ) {
    return {
        title: editor.lang.html5video.title,
        minWidth: 500,
        minHeight: 100,
        contents: [ {
            id: 'html5videoPlugin',
            label: editor.lang.html5video.infoLabel,
            elements: [ 
            {
                type: 'vbox',
                padding: 0,
                children: [
                    {
                    type: 'hbox',
                    widths: [ '365px', '110px' ],
                    align: 'right',
                    children: [ {
                        type: 'text',
                        id: 'url',
                        label: editor.lang.html5video.allowed,
                        required: true,
                        validate: CKEDITOR.dialog.validate.notEmpty( editor.lang.html5video.urlMissing ),
                        setup: function( widget ) {
                            this.setValue( widget.data.src );
                        },
                        commit: function( widget ) {
                            widget.setData( 'src', this.getValue() );
                        }
                    },
                    {
                        type: 'button',
                        id: 'browse',
                        // v-align with the 'txtUrl' field.
                        // TODO: We need something better than a fixed size here.
                        style: 'display:inline-block;margin-top:14px;',
                        align: 'center',
                        label: editor.lang.common.browseServer,
                        hidden: true,
                        filebrowser: 'html5videoPlugin:url'
                    } ]
                } ]
            },
            {
                type: 'vbox',
                padding: 0,
                
                children: [{
                    type: 'hbox',
                    widths: [ '365px', '110px' ],
                    align: 'right',
                    children: [ {
                        type: 'text',
                        id: 'poster',
                        label: editor.lang.html5video.poster,
                        setup: function( widget ) {
                            this.setValue( widget.data.poster );
                        },
                        commit: function( widget ) {
                            widget.setData( 'poster', this.getValue() );
                        }
                    },
                    {
                        type: 'button',
                        id: 'browseposter',
                        // v-align with the 'txtUrl' field.
                        // TODO: We need something better than a fixed size here.
                        style: 'display:inline-block;margin-top:14px;',
                        align: 'center',
                        label: editor.lang.common.browseServer,
                        hidden: true,
                        filebrowser:{action:"Browse",target:"html5videoPlugin:poster",url:editor.config.filebrowserImageBrowseUrl}
                    } ]
                }]
            },
            {
                type : 'hbox',
                widths : [ '15%', '70%' ],
                children :
                    [
                        {
                            type: 'hbox',
                            id: 'size',
                            children: [ {
                                type: 'text',
                                id: 'width',
                                width : '100px',
                                label: 'Максимальная ширина видео',
                                setup: function( widget ) {
                                    if ( widget.data.width ) {
                                        this.setValue( widget.data.width );
                                    }
                                },
                                commit: function( widget ) {
                                    widget.setData( 'width', this.getValue() );
                                }
                            }
                            ]
                        },
                        {
                            type: 'select',
                            id: 'video_aspect_ratio',
                            label: 'Соотношение сторон видео',
                            items: [ [ 'Как у видео (по умолчанию)', 'aspect_ratio_original' ], [ '16:9', 'aspect_ratio_16by9' ], [ '4:3', 'aspect_ratio_4by3' ], [ '21:9', 'aspect_ratio_21by9' ], [ '1:1', 'aspect_ratio_1by1' ] ],
                            'default': 'aspect_ratio_original',
                            onChange : function (api) {
                                html5video_set_width(this, api);
                            },
                            onKeyUp : function (api) {
                                html5video_set_width(this, api);
                            },
                            setup: function( widget ) {
                                if ( widget.data.video_aspect_ratio ) {
                                    this.setValue( widget.data.video_aspect_ratio );
                                }
                                html5video_set_width(this, widget);
                            },
                            commit: function( widget ) {
                                widget.setData( 'video_aspect_ratio', this.getValue() );
                            }
                        }
                    ]
            },
            {
                type: 'hbox',
                id: 'alignment',
                children: [ {
                    type: 'radio',
                    id: 'align',
                    label: editor.lang.common.align,
                    items: [
                        ['По центру', 'center'],
                        ['По левому краю', 'float-start'],
                        ['По правому краю', 'float-end'],
                        ['Нет', 'none'],
                        ['На всю ширину', 'fullwidth']
                    ],
                    'default': 'center',
                    onChange : function (api) {
                        html5video_set_width(this, api);
                    },
                    onKeyUp : function (api) {
                        html5video_set_width(this, api);
                    },
                    setup: function( widget ) {
                        if ( widget.data.align ) {
                            this.setValue( widget.data.align );
                        }
                        html5video_set_width(this, widget);
                    },
                    commit: function( widget ) {
                        widget.setData( 'align', this.getValue() );
                    }
                } ]
            },
            {
                type : 'html',
                html : '<hr>Дополнительно:'
            },
            {
                type: 'checkbox',
                id: 'autoplay',
                label: editor.lang.html5video.autoplay,
                onChange : function (api) {
                    html5video_autoplay(this, api);
                },
                onKeyUp : function (api) {
                    html5video_autoplay(this, api);
                },
                setup: function (widget) {
                    this.setValue(widget.data.autoplay);
                    html5video_autoplay(this, widget);
                },
                commit: function (widget) {
                    widget.setData('autoplay', this.getValue() ? 'true' : '');
                }
            },
            {
                type: 'checkbox',
                id: 'loop',
                label: editor.lang.html5video.loop,
                onChange : function (api) {
                    html5video_loop(this, api);
                },
                onKeyUp : function (api) {
                    html5video_loop(this, api);
                },
                setup: function (widget) {
                    this.setValue(widget.data.loop);
                    html5video_loop(this, widget);
                },
                commit: function (widget) {
                    widget.setData('loop', this.getValue() ? 'true' : '');
                }
            },
            {
                id : 'mute',
                type : 'checkbox',
                label : editor.lang.html5video.mute,
                setup: function (widget) {
                    this.setValue(widget.data.mute);
                },
                commit: function (widget) {
                    widget.setData('mute', this.getValue() ? 'true' : '');
                },
            },
            {
                type: 'checkbox',
                id: 'controls',
                label: editor.lang.html5video.controls,
                setup: function (widget) {
                    this.setValue(widget.data.controls);
                },
                commit: function (widget) {
                    widget.setData('controls', this.getValue() ? 'true' : '');
                }
            },
            {
                type: "text",
                id: 'advisorytitle',
                label: editor.lang.html5video.advisorytitle,
                'default': '',
                setup: function( widget ) {
                    if ( widget.data.advisorytitle ) {
                        this.setValue(widget.data.advisorytitle);
                    }
                },
                commit: function( widget ) {
                    widget.setData( 'advisorytitle', this.getValue() );
                }
            }
            ]
        },
        {
            id: 'Upload',
            hidden: true,
            filebrowser: 'uploadButton',
            label: editor.lang.html5video.upload,
            elements: [ {
                type: 'file',
                id: 'upload',
                label: editor.lang.html5video.btnUpload,
                style: 'height:40px',
                size: 38
            },
            {
                type: 'fileButton',
                id: 'uploadButton',
                filebrowser: 'html5videoPlugin:url',
                label: editor.lang.html5video.btnUpload,
                'for': [ 'Upload', 'upload' ]
            } ]
        },
        ]
    };
} );

// определение ширины в зав-ти от соотношения сторон и выравнивания
function html5video_set_width(el, api) {
    // если выбрано "на всю ширину"
    if (el.getDialog().getContentElement('html5videoPlugin', 'align').getValue() === 'fullwidth') {
        el.getDialog().getContentElement('html5videoPlugin', 'width').disable();
        el.getDialog().getContentElement('html5videoPlugin', 'width').setValue('100%');
    }
    else {
        el.getDialog().getContentElement('html5videoPlugin', 'width').enable();
        // если выбрано соотношение сторон "как у видео"
        if (el.getDialog().getContentElement('html5videoPlugin', 'video_aspect_ratio').getValue() === 'aspect_ratio_original') {
            // если при этом стояла ширина 100%
            if( el.getDialog().getContentElement('html5videoPlugin', 'width').getValue() === '100%' ){
                el.getDialog().getContentElement('html5videoPlugin', 'width').setValue("");
            }
        } else {
            // если ширина пуста или равна 100%
            if( el.getDialog().getContentElement('html5videoPlugin', 'width').getValue() === '' ||  el.getDialog().getContentElement('html5videoPlugin', 'width').getValue() === '100%' ){
                el.getDialog().getContentElement('html5videoPlugin', 'width').setValue(320);
            }
        }
    }
}

// при включении зацикливания - отключать звук и включать и автовоспроизведение
function html5video_loop(el, api) {
    if (el.getValue()) {
        el.getDialog().getContentElement('html5videoPlugin', 'autoplay').setValue(true);
        el.getDialog().getContentElement('html5videoPlugin', 'autoplay').disable();
    } else {
        el.getDialog().getContentElement('html5videoPlugin', 'autoplay').enable();
        if( !el.getDialog().getContentElement('html5videoPlugin', 'autoplay').getValue() ){
            el.getDialog().getContentElement('html5videoPlugin', 'mute').enable();
        }
    }
}

// при включении автовоспроизведения - отключать звук
function html5video_autoplay(el, api) {
    if (el.getValue()) {
        el.getDialog().getContentElement('html5videoPlugin', 'mute').setValue(true);
        el.getDialog().getContentElement('html5videoPlugin', 'mute').disable();
    } else {
        el.getDialog().getContentElement('html5videoPlugin', 'mute').enable();
    }
}
