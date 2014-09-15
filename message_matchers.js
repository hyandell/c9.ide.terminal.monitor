/**
 * Terminal Module for the Cloud9
 *
 * @copyright 2012, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

define(function(require, exports, module) {
    "use strict";
    
    module.exports = function(c9) {
        
        var PORT = c9.port || 8080;
        
        var prefix = '<strong>Cloud9 Help</strong> ';
        var wrongPortIP = "You may be using the wrong PORT & IP for your server application.";
        
        var messages = {
            generic: {
                wrongPortIP: prefix + wrongPortIP + "Try passing $PORT and $IP to properly launch your application. You can find more information <a href='https://docs.c9.io/running_and_debugging_code.html' target='_blank'>in our docs.</a>",
                appRunning: prefix + "Your code is running at <a href='javascript://' data-type='preview'>https://" + c9.hostname + "</a>",
                bindToInternalIP: prefix + wrongPortIP + "Only binding to the internal IP configured in $IP is supported.",
                noLiveReload: prefix + "We currently only support listening on one port. Opening up a second port for live-reloading is currently not possible."
            },
            rails: {
                wrongPortIP: prefix + wrongPortIP + "For rails, use: 'rails s -p $PORT -b $IP'. For Sinatra, use: ruby app.rb -p $PORT -o $IP'."
            },
            node: {
                wrongPortIP: prefix + wrongPortIP + " Use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts or <a href='https://docs.c9.io/running_and_debugging_code.html' target='_blank'>refer to the documentation for more information</a>."
            },
            django: {
                wrongPortIP: prefix + wrongPortIP + " Use './manage.py runserver $IP:$PORT' to run your Django application."
            }
        };
        
        var matchers = [
            {
                // Generic
                pattern: /^(?!reload )server(?: is | )(?:listening|running) (?:at|on)((?!0\.0\.0\.0:8080).)*$/i,
                message: messages.generic.wrongPortIP
            },
            {
                // Generic correct port
                pattern: /^(?!reload )server(?: is | )(?:listening|running) (?:at|on).*?(?=0\.0\.0\.0:8080)/i,
                message: messages.generic.appRunning
            },
            {
                // grunt-serve correct port
                pattern: /Server is running on port (?!8080)/i,
                message: messages.generic.wrongPortIP
            },
            {
                // grunt-serve correct port
                pattern: /Server is running on port 8080/i,
                message: messages.generic.appRunning
            },
            {
                // grunt-reload
                pattern: /^Proxying http:\/\/(?!0\.0\.0\.0:8080)/i,
                message: messages.generic.wrongPortIP
            },
            {
                // grunt-reload
                pattern: /^Proxying http:\/\/(?=0\.0\.0\.0:8080)/i,
                message: messages.generic.appRunning
            },
            {
                // grunt no support for live-reload
                pattern: /^reload server running at http:\/\/.*?:\d{4,5}/i,
                message: messages.generic.noLiveReload
            },
            {
                // Meteor wrong port
                pattern: /(App running at:)((?!0\.0\.0\.0:8080).)*$/,
                message: messages.generic.wrongPortIP
            },
            {
                // Meteor correct port
                pattern: /(App running at:).*?(?=0\.0\.0\.0:8080)/,
                message: messages.generic.appRunning
            },
            {
                // Ionic wrong port
                pattern: /(Running dev server:)((?!\d+\.\d+\.\d+\.\d+:8080).)*$/,
                message: messages.generic.wrongPortIP
            },
            {
                // Ionic correct port
                pattern: /(Running dev server:).*?(?=\d+\.\d+\.\d+\.\d+:8080)/,
                message: messages.generic.appRunning
            },
            {
                // WEBrick correct port
                pattern: /INFO\ \ WEBrick::HTTPServer#start: pid=\d+ port=8080/,
                message: messages.generic.appRunning
            },
            {
                // WEBrick wrong port
                pattern: /INFO\ \ WEBrick::HTTPServer#start: pid=\d+ port=(?!8080)/,
                message: messages.rails.wrongPortIP
            },
            {
                // Rails or Sinatra
                pattern: /WARN {1,2}TCPServer Error: (?:Address already in use|Permission denied) - bind\(2\)/,
                message: messages.rails.wrongPortIP
            },
            {
                // Node app
                pattern: /Error: listen (?:EADDRINUSE|EACCES|EADDRNOTAVAIL)/,
                message: messages.node.wrongPortIP
            },
            {
                // Django correct port
                pattern: /Starting development server at.*?(?=0.0.0.0:8080)/i,
                message: messages.generic.appRunning
            },
            {
                // Django app wrong port
                pattern: /Error: You don't have permission to access that port./,
                message: messages.django.wrongPortIP
            },
            {
                // Django app wrong port
                pattern: /Error: That port is already in use./,
                message: messages.django.wrongPortIP,
                action: {
                    cmd: "kill -9 $(lsof -i:" + PORT + " -t)",
                    label: "Kill processes"
                }
            }
        ];
        return {
            matchers: matchers,
            messages: messages
        };
    };
});
