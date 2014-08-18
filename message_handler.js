/**
 * Terminal Module for the Cloud9
 *
 * @copyright 2012, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

define(function(require, exports, module) {
    "use strict";
    
    var MessageHandler = function(messageMatchers, messageView) {
        this.messageMatchers = messageMatchers;
        this.messageView = messageView;
    };
    
    var proto = MessageHandler.prototype;

    proto.handleMessage = function(data, referenceNode) {
        this.messageMatchers.forEach(function(trigger) {
            trigger.pattern.test(data) && this.messageView.show(trigger.message, referenceNode);
        }, this);
    };
    
    module.exports = MessageHandler;
});
