(function ($)
{
    $.sendFeedback = function (options)
    {
        var settings = $.extend({
            instructionText: 'Use Your Mouse to Highlight any Problems.',
            instructionColor: '#f00',
            instructionSize: '40px',
            overlayColor: '#ff0',
            overlayOpacity: '.15',
            overlayZIndex: '9000000',
            highlightBorderColor: '#f00',
            highlightBorderWidth: '3px',
            highlightBorderStyle: 'solid',
            highlightBorderRadius: '5px',
            url: ''
        }, options);


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
        .appendTo('body');

        var $feedbackInstructions = $('<div></div>').css({
            position: 'absolute',
            width: '100%',
            left: '0',
            top: '35%',
            zIndex: settings.overlayZIndex - 1,
            textAlign: 'center',
            fontSize: settings.instructionSize,
            fontWeight: 'bold',
            color: settings.instructionColor,
            fontFamily: 'Arial'
        })
        .text(settings.instructionText)
        .appendTo('body')
        .hide();

        var $feedbackForm = $('<div></div>').css({

        });

        var originalCoords = { top: 0, left: 0 };

        var $currentHighlight;

        $feedbackOverlay.bind('mousedown', function (e)
        {
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
            .appendTo('body');
            originalCoords = { top: e.pageY, left: e.pageX };
        });

        $feedbackOverlay.bind('mousemove', function (e)
        {
            if ($currentHighlight)
            {
                var newCoords = { top: e.pageY, left: e.pageX };

                if (newCoords.top < originalCoords.top) $currentHighlight.css('top', newCoords.top);
                if (newCoords.left < originalCoords.left) $currentHighlight.css('left', newCoords.left);

                $currentHighlight.height(Math.abs(newCoords.top - originalCoords.top));
                $currentHighlight.width(Math.abs(newCoords.left - originalCoords.left));
            }
        });

        $feedbackOverlay.bind('mouseup', function (e)
        {
            $currentHighlight = null;
        });

        $feedbackInstructions.fadeIn(1000, function ()
        {
            setTimeout(function ()
            {
                $feedbackInstructions.fadeOut(1000);
            }, 3000);
        });

        $feedbackOverlay.height($(document).height());
    }
})(jQuery);