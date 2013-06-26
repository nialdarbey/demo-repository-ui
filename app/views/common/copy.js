var App = require('app');

require('helpers');

(function () {
    var clip = new ZeroClipboard(), noFlash = false;
    
    clip.on('mousedown', function (client, args) {
        clip.setText($(this).data('text-to-copy'));
        $(this).slideUp();
        $(this).slideDown();
    });
    
    var noFlashHandler = function () {
        //// TODO: Set a global var indicating that flash isn't installed, in order to show it in the About window
        noFlash = true;
    };
    
    clip.on('noflash', noFlashHandler);
    clip.on('wrongflash', noFlashHandler);

    var loadCallback;
    clip.on('load', function () {
        loadCallback = function (copyButton) {
            clip.glue(copyButton);
        };
    });

    App.Copy = App.BaseView.extend({
        templateName: require('templates/common/copy'),
        classNames: [''],
        placeOnLeft: false,
        placeOnRight: true,
        valueToCopy: null,
        dataPlacement: 'right',
        clip: null,
        init: function () {
            this._super();
            this.set('clip', clip);
            this.set('flashPresent', !noFlash);
        },
        setData: function () {
            var el = this.$();
            var copyButton = el.find('a.copy-button');
            copyButton.data('text-to-copy', this.get('valueToCopy'));
        }.observes('valueToCopy'),
        didInsertElement: function () {
            this._super();
            var el = this.$();
            var clip = this.get('clip');
            $('#global-zeroclipboard-html-bridge')
                .attr('rel', 'tooltip')
                .attr('data-placement', this.get('dataPlacement'))
                .attr('data-title', 'Click to copy');
            
            this.setData();

            var copyButton = el.find('a.copy-button');
            
            if (loadCallback) {
                loadCallback(copyButton);
            }
    
        },
        copy: function () {
            if (!this.get('flashPresent')) {
                var el = this.$();
                var inputBox = el.find('input.code-to-copy');
                inputBox.focus();
                
                return;
            }
            // Do nothing :)
        }
    });
}());
