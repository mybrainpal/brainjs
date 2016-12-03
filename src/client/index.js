/**
 * Proudly created by ohad on 02/12/2016.
 */
'use strict';

window.BrainPal = (function(window, undefined) {
    var BrainPal = {};

    /**
     * Loads external & internal resources for the Pal.
     * @param {Function} cb
     */
    function loadResources(cb) { cb() }

    loadResources(function() {
        console.log('Loading resources...');
        loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js', function() {
            BrainPal.$ = BrainPal.jQuery = jQuery.noConflict(true);
        });
        loadScript('manipulation/manipulate.js', function() {
            BrainPal.Manipulator = new BPManipulator();
        });
        loadScript('collection/collect.js', function() {
            BrainPal.Collector = new BPCollector();
        });
    });

    function loadScript(url, cb) {
        console.log('Loading ' + url);
        var script = document.createElement('script');
        script.async = true;
        script.src = url;
        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
        script.onload = script.onreadystatechange = function() {
            var rdyState = script.readyState;
            if (!rdyState || /complete|loaded/.test(script.readyState)) {
                cb();
                script.onload = null;
                script.onreadystatechange = null;
            }
        };
    }

    return BrainPal;
})(window);