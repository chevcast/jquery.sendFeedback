//    Licensed to the Apache Software Foundation (ASF) under one
//    or more contributor license agreements.  See the NOTICE file
//    distributed with this work for additional information
//    regarding copyright ownership.  The ASF licenses this file
//    to you under the Apache License, Version 2.0 (the
//    "License"); you may not use this file except in compliance
//    with the License.  You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing,
//    software distributed under the License is distributed on an
//    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//    KIND, either express or implied.  See the License for the
//    specific language governing permissions and limitations
//    under the License.

(function ($) {
    $.sendFeedback = function (options) {
        var settings = $.extend({
            instructionText: 'Use Your Mouse to Highlight Areas on the Page',
            instructionTextColor: '#f00',
            instructionBackgroundColor: '#fff',
            instructionTextSize: '40px',
            overlayColor: '#000',
            overlayOpacity: '.25',
            overlayZIndex: '9000000',
            highlightBorderColor: '#f00',
            highlightBorderWidth: '3px',
            highlightBorderStyle: 'solid',
            highlightBorderRadius: '5px',
            formTitle: 'Send Feedback',
            formText: 'Your feedback is very useful to us when resolving problems. Please be very detailed in your description.',
            formTextColor: '#000',
            formBackgroundColor: '#fff',
            formBorderColor: '#000',
            formBorderWidth: '1px',
            formBorderStyle: 'solid',
            subjectText: 'Subject',
            detailsText: 'Details'
        }, options);

        var $feedbackContainer = $('<div></div>').appendTo('body');

        var $feedbackHighlights = $('<div></div>').appendTo('body');

        var $feedbackOverlay = $('<div></div>')
        .css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: settings.overlayColor,
            opacity: settings.overlayOpacity,
            left: '0',
            top: '0',
            zIndex: settings.overlayZIndex,
            textAlign: 'center'
        })
        .appendTo($feedbackHighlights);

        var $feedbackInstructions = $('<div></div>').css({
            position: 'absolute',
            width: '100%',
            left: '0',
            top: '35%',
            zIndex: settings.overlayZIndex - 1,
            textAlign: 'center',
            fontSize: settings.instructionTextSize,
            fontWeight: 'bold',
            color: settings.instructionTextColor,
            fontFamily: 'Arial',
            backgroundColor: settings.instructionBackgroundColor,
            padding: '10px'
        })
        .text(settings.instructionText)
        .appendTo($feedbackContainer)
        .hide();

        var $feedbackForm = $('<div></div>').css({
            position: 'fixed',
            bottom: '0',
            right: '0',
            width: '275px',
            height: '335px',
            padding: '10px',
            color: settings.formTextColor,
            backgroundColor: settings.formBackgroundColor,
            borderStyle: settings.formBorderStyle,
            borderWidth: settings.formBorderWidth,
            borderColor: settings.formBorderColor,
            borderRadius: '10px 0 0 0',
            zIndex: settings.overlayZIndex + 1
        });
        $('<div></div>').css({
            fontSize: '20px',
            textAlign: 'center',
            marginBottom: '10px'
        })
        .text(settings.formTitle)
        .appendTo($feedbackForm);
        $('<div></div>')
        .css({
            fontSize: '11px',
            marginBottom: '10px'
        })
        .text(settings.formText)
        .appendTo($feedbackForm);
        $('<div></div>')
        .css({
            fontSize: '11px'
        })
        .text(settings.subjectText)
        .appendTo($feedbackForm);
        var $feedbackSubject = $('<input type="text" />').css({
            width: '270px',
            marginBottom: '10px',
            display: 'block'
        })
        .appendTo($feedbackForm);
        $('<div></div>')
        .css({
            fontSize: '11px'
        })
        .text(settings.detailsText)
        .appendTo($feedbackForm);
        var $feedbackDetails = $('<textarea></textarea>').css({
            width: '270px',
            height: '150px',
            marginBottom: '10px',
            display: 'block'
        })
        .appendTo($feedbackForm);
        $('<input type="button" value="Send" />').click(function (e) {
            $feedbackContainer.remove();
            $('*').each(function () {
                if ($(this).attr('style'))
                    $(this).data('oldStyle', $(this).attr('style'));
                else
                    $(this).data('oldStyle', 'none');
                $(this).width($(this).width());
                $(this).height($(this).height());
            });
            var html = '<html>' + $('html').html() + '</html>';
            $('*').each(function () {
                if ($(this).data('oldStyle') != 'none')
                    $(this).attr('style', $(this).data('oldStyle'));
                else
                    $(this).removeAttr('style');
            });
            $feedbackHighlights.remove();
            var feedbackInformation = {
                url: document.URL,
                userAgent: navigator.userAgent,
                subject: $feedbackSubject.val(),
                details: $feedbackDetails.val(),
                html: html
            };
            if (settings.feedbackSent)
                settings.feedbackSent(feedbackInformation);
        })
        .appendTo($feedbackForm);
        $('<input type="button" value="Cancel" />').click(function (e) {
            $feedbackContainer.remove();
            $feedbackHighlights.remove();
        })
        .appendTo($feedbackForm);
        $feedbackForm.appendTo($feedbackContainer);

        var originalCoords = { top: 0, left: 0 };

        var $currentHighlight;

        $feedbackOverlay.bind('mousedown', function (e) {
            $currentHighlight = $('<div></div>').css({
                width: '1px',
                height: '1px',
                borderStyle: settings.highlightBorderStyle,
                borderWidth: settings.highlightBorderWidth,
                borderColor: settings.highlightBorderColor,
                borderRadius: settings.highlightBorderRadius,
                position: 'absolute',
                left: e.pageX,
                top: e.pageY,
                zIndex: settings.overlayZIndex - 1
            })
            .appendTo($feedbackHighlights);
            originalCoords = { top: e.pageY, left: e.pageX };
        });

        $feedbackOverlay.bind('mousemove', function (e) {
            if ($currentHighlight) {
                var newCoords = { top: e.pageY, left: e.pageX };

                if (newCoords.top < originalCoords.top) $currentHighlight.css('top', newCoords.top);
                if (newCoords.left < originalCoords.left) $currentHighlight.css('left', newCoords.left);

                $currentHighlight.height(Math.abs(newCoords.top - originalCoords.top));
                $currentHighlight.width(Math.abs(newCoords.left - originalCoords.left));
            }
        });

        $feedbackOverlay.bind('mouseup', function (e) {
            $currentHighlight = null;
        });

        $feedbackInstructions.fadeIn(500, function () {
            setTimeout(function () {
                $feedbackInstructions.fadeOut(1000);
            }, 2000);
        });

        $feedbackOverlay.height($(document).height());
    }
})(jQuery);