$.Redactor.prototype.custom = function()
{
  return {
    init: function ()
    {
      var button = this.button.add('custom', 'Custom');
      this.button.addCallback(button, this.custom.testButton);
      this.modal.addCallback('custom', this.custom.load);
    },

    testButton: function(buttonName) {
      console.log(buttonName);
    },

    load: function() {

      var $box = $('<div style="overflow: auto; height: 300px; display: none;" class="redactor-modal-tab" data-title="Choose">');
      this.modal.getModal().append($box);

    }

  };
};
