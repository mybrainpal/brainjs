'use strict';

let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?
              function (obj) { return typeof obj; } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol &&
               obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

/**
 * Proudly created by ohad on 01/01/2017.
 */
/* The MIT License (MIT)

 Copyright (c) 2016 Aaron Cordova

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE. */
const _   = require('../../../common/util/wrapper'),
      css = require('./typer.scss');
_.css.load(css);
let styles = css.locals;

module.exports = function (el, speed) {
    let q = []; // The main array to contain all the methods called on typer.

    // List of HTML void elements (http://goo.gl/SWmyS5),
    // used in 'processMsg' & 'processBack'.
    q.voids =
        ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link',
         'meta', 'param', 'source', 'track', 'wbr'];

    // Various checks.
    speed = speed || 70;
    if (getType(el) !== 'String') throw 'typer error: selector provided is not a string.';
    if (!document.styleSheets.length) styleSheets(); // Create a stylesheet if none exist.

    el = document.querySelector(el);

    parentDataNum(); // Assign a random # to the parent el's data attribute.

    // Public methods.
    let typerObj = {
        cursor  : function cursor(cursorObj) {
            // Prevent cursor from being run multiple times.
            if (q.cursorRan) {
                console.log('You can only call ".cursor" once.');
                return this;
            }

            q.cursorRan = true;

            // Prevent errors from no arguments.
            if (cursorObj === undefined) cursorObj = true;

            // No cursor.
            if (cursorObj === false) {
                q.cursor = styles['no-cursor']; // Used as a class.
                return this;
            }

            let classes = [];
            let data    = '[data-typer="' + q.dataNum + '"]';

            // Optional cursor color - https://goo.gl/b4Ckz9
            if (cursorObj.color) {
                addStyle(data + ` .${styles.typer}::after`,
                         'background-color:' + cursorObj.color);
            }

            // Cursor's blinking style - default to soft.
            cursorObj.blink === 'hard' ? classes.push(styles['cursor-hard']) :
            classes.push(styles['cursor-soft']);

            // Cursor: block or line.
            if (cursorObj.block === true) classes.push(styles['cursor-block']);

            q.cursor = classes.join(' '); // Used as a class.

            return this;
        },
        line    : function line(msg, spd, html) {
            msg ? q.push(lineOrContinue('line', msg, spd, html)) : q.push({line: 1});

            // Push the first dominoe on the typing iteration,
            // ensuring public methods will only call 'processq()' once.
            if (!q.typing) {
                q.typing = true;
                processq();
            }

            return this;
        },
        continue: function _continue(msg, spd, html) {
            if (!msg) return this; // Ignore empty continues.
            q.push(lineOrContinue('continue', msg, spd, html));
            return this;
        },
        pause   : function pause(num) {
            // Default to 500ms.
            q.push({pause: num || 500});
            return this;
        },
        emit    : function emit(event, el) {
            if (!el) el = 'body'; // Default to the body.

            // Simple way to throw an error for invalid selectors.
            document.querySelector(el);

            q.push({emit: event, el: el});
            return this;
        },
        listen  : function listen(event, el) {
            if (!el) el = 'body'; // Default to the body.

            // Simple way to throw an error for invalid selectors.
            document.querySelector(el);

            q.push({listen: event, el: el});
            return this;
        },
        back    : function back(chars, spd) {
            q.push({back: chars, speed: spd});
            return this;
        },
        empty   : function empty() {
            q.push({empty: true});
            return this;
        },
        run     : function run(fxn) {
            q.push({run: fxn});
            return this;
        },
        end     : function end(fxn, e) {
            q.push({end: true});

            q.cb = function () {
                // Finalize the the div class names before ending.
                // Because wack IE doesn't support multiple parameters for .remove or .add.
                ['typer', 'cursor-block', 'cursor-soft', 'cursor-hard', 'no-cursor'].forEach(
                    function (name) {
                        q.newDiv.classList.remove(styles[name]);
                    });

                q.newDiv.classList.add(styles['white-space']);
                q.newDiv = '';

                if (fxn && fxn instanceof Function) fxn(el);
                if (fxn && getType(fxn) === 'Boolean' || e) {
                    if (e instanceof Function) e(el);
                    document.body.dispatchEvent(new Event('typerFinished'));
                }
            };

            // A convenient object to warn the user if they
            // try to call any methods after '.end'.
            let catchAll = {
                cursor  : message,
                line    : message,
                continue: message,
                pause   : message,
                emit    : message,
                listen  : message,
                back    : message,
                empty   : message,
                run     : message,
                end     : message
            };

            // Message used by the 'catchAll' object.
            function message() {
                console.log(
                    'WARNING: you tried to call a method after ".end" has already been called.');
                return catchAll;
            }

            return catchAll;
        }
    };

    // Private functions.
    function getType(thing) {
        let type = {}.toString.call(thing);

        return type.split(' ')[1].slice(0, -1);
    }

    function parentDataNum() {
        // Random # function with min & max values.
        // function randomNum(min, max) {
        //   return Math.floor(Math.random() * (max - min + 1) + min);
        // }
        q.dataNum = Math.floor(Math.random() * 999999999 + 1);
        el.setAttribute('data-typer', q.dataNum);
    }

    function styleSheets() {
        // https://goo.gl/b4Ckz9
        // Create the style element.
        let style = document.createElement('style');

        // Webkit hack.
        style.appendChild(document.createTextNode(''));

        // Append the style element to the head.
        document.head.appendChild(style);
    }

    function addStyle(selector, rules) {
        // https://goo.gl/b4Ckz9
        let sheet = document.styleSheets[0];

        if ('insertRule' in sheet) {
            sheet.insertRule(selector + '{' + rules + '}', 1);
        } else {
            sheet.addRule(selector, rules);
        }
    }

    function lineOrContinue(choice, msg, spd, html) {
        //noinspection RedundantConditionalExpressionJS
        let obj = {html: spd === false ? false : html === false ? false : true};

        if (getType(spd) === 'Number') obj.speed = spd;
        if (getType(html) === 'Number') obj.speed = html;
        if (getType(msg) === 'Object') {
            // Prevents a hard dependency on 'el' as the property name.
            let key = Object.keys(msg)[0];
            msg     =
                document.querySelector(msg[key])[obj.html ? 'innerHTML' : 'textContent'].trim();
        }

        obj[choice] = msg;

        return obj;
    }

    function processq() {
        // Begin our main iterator.
        if (!(q.item >= 0)) q.item = 0;
        if (q.item === q.length) return document.body.removeEventListener('killTyper', q.kill);
        if (!q.ks) {
            q.ks = true;
            document.body.addEventListener('killTyper', q.kill);
        }

        // If no cursor is declared, resort to default styling.
        // The cursor will be pinged later by each line.
        if (!q.cursor) q.cursor = styles['cursor-soft'];

        // Main iterator.
        q.type = setInterval(function () {
            let item = q[q.item];

            // Various processing functions.
            item.line ? processLine(item) : item.continue ? processContinue(item) :
                                            item.pause ? processPause(item) :
                                            item.emit ? processEmit(item) :
                                            item.listen ? processListen(item) :
                                            item.back ? processBack(item) :
                                            item.empty ? processEmpty() :
                                            item.run ? processRun(item) :
                                            item.end && processEnd(item);
        }, 0);
    }

    function processMsg(item) {
        // Used by 'processLine' & 'processContinue'.
        let msg        = item.line || item.continue;
        let targetList = [q.newDiv];
        let div        = document.createElement('div');
        let counter    = 0;

        q.iterator = setInterval(function () {
            // End of message processing logic.
            if (counter === msg.length) {
                clearInterval(q.iterator);
                q.item++; // Increment our main item counter.
                return processq(); // Restart the main iterator.
            }

            let piece = msg[counter];

            // NO HTML
            if (!item.html) {

                // Avoid HTML parsing on supplied arrays.
                if (typeof msg !== 'string') {
                    div.textContent = piece;
                    piece           = div.innerHTML;
                }

                q.newDiv.innerHTML += piece;

                // HTML
            } else {
                // Open tags.
                if (piece === '<' && msg[counter + 1] !== '/') {
                    let _ret = function () {
                        let tag     = '';
                        let voidTag = '';

                        for (let _i = counter; _i < msg.length; _i++) {
                            tag += msg[_i];
                            if (msg[_i] !== '>' && msg[_i] !== '<') voidTag += msg[_i];
                            if (msg[_i] === '>') break;
                        }

                        let isVoid = q.voids.some(function (v) {
                            return v === voidTag;
                        });

                        // Non-void elements get focused on as the typing target.
                        if (!isVoid) {
                            let parent = targetList[0];

                            div.innerHTML = tag;
                            targetList.unshift(div.firstChild); // Add current tag to beginning of
                                                                // the 'targetList' array.
                            parent.appendChild(div.firstChild);

                            // Void elements get added to the contents but are not focused on for
                            // typing.
                        } else {
                            targetList[0].innerHTML += tag;
                        }

                        return {
                            v: counter += tag.length
                        }; // Move the counter passed the current tag.

                        // Closing tags.
                    }();

                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) ===
                        "object") {
                        return _ret.v;
                    }
                } else if (piece === '<' && msg[counter + 1] === '/') {
                    targetList.shift(); // Remove the tag from the 'targetList' array.
                    return counter = msg.indexOf('>', counter) + 1; // Move the counter passed the
                                                                    // closing tag.

                    // Unicode characters.
                } else if (piece === '&') {
                    // 1. Build the (potential) unicode character.
                    let char = '';
                    for (let i = counter; i < msg.length; i++) {
                        char += msg[i];

                        // Accounts for messages like `We &#like &#128007; semicolons!;`
                        // It will properly ignore the 1st `&#` and parse the rabbit character.
                        // Unicode rabbit: https://goo.gl/mEaMl4
                        if (msg[i] === ';' || msg[i + 1] === '&') break;
                    }

                    div.innerHTML = char;

                    //
                    let parsed = Number(char.replace('&#', '0').slice(0, -1));

                    // Unicode characters may have a length > 1. `codePointAt(0)` will render the
                    // code point of the WHOLE character IF the string contains it. If not, it will
                    // give the code point of the SINGLE character at the 0 index.
                    let isUnicode = div.innerHTML.codePointAt(0) === parsed;

                    // if (ucs2decode(div.innerHTML).length === 1) { // Unicode character found.
                    if (isUnicode) {
                        // Unicode character found.
                        targetList[0].innerHTML += char;
                        counter = i; // Move the counter to the end of the unicode text.
                    } else {
                        targetList[0].innerHTML += piece;
                    }
                } else {
                    targetList[0].innerHTML += piece;
                }
            }

            counter++;
        }, item.speed || speed); // Function for both line and continue.
    }

    function processLine(item) {
        // Stop the main iterator.
        clearInterval(q.type);

        // Process the previous line if there was one.
        if (q.newDiv) {
            // Because wack IE doesn't support multiple parameters for .remove or .add.
            ['typer', 'cursor-block', 'cursor-soft', 'cursor-hard', 'no-cursor'].forEach(
                function (name) {
                    q.newDiv.classList.remove(styles[name]);
                });

            q.newDiv.classList.add(styles['white-space']);

            if (q.newDiv.innerHTML === '') q.newDiv.innerHTML = ' '; // Retains the height of a
                                                                     // single line.
        }

        // Create new div.
        let div = document.createElement('div');
        div.setAttribute('data-typer-child', q.dataNum);
        div.className = q.cursor;
        div.classList.add(styles['typer']);
        div.classList.add(styles['white-space']);

        el.appendChild(div);
        q.newDiv = div;

        // If our line has no contents...
        if (item.line === 1) {
            q.item++;
            return processq();
        }

        // Message iterator.
        processMsg(item);
    }

    function processContinue(item) {
        clearInterval(q.type); // Stop the main iterator.
        processMsg(item); // Message iterator.
    }

    function processPause(item) {
        clearInterval(q.type); // Stop the main iterator.

        q.pause = setTimeout(function () {
            q.item++; // Increment our main item counter.
            processq(); // Restart the main iterator.
        }, item.pause);
    }

    function processEmit(item) {
        clearInterval(q.type); // Stop the main iterator.
        document.querySelector(item.el).dispatchEvent(new Event(item.emit));

        q.item++;
        processq();
    }

    function processListen(item) {
        clearInterval(q.type); // Stop the main iterator.

        let el = document.querySelector(item.el);

        // One-time event listener.
        el.addEventListener(item.listen, function handler(e) {
            el.removeEventListener(e.type, handler);
            if (q.killed) return; // Prevent error if kill switch is engaged.
            q.item++;
            processq();
        });
    }

    function processBack(item) {
        // Stop the main iterator.
        clearInterval(q.type);

        // Check for being called on an empty line.
        if (!q.newDiv.textContent) {
            q.item++;
            return processq();
        }

        function removeEmptys(el) {
            // Convert HTMLcollection to an array: http://goo.gl/2rTC4i
            let children = [].slice.call(el.children);

            children.forEach(function (child, i) {
                // Child.
                if (!child.innerHTML.length) {
                    child.remove ? child.remove() : child.removeNode(); // IE nonsense.

                    if (el === q.newDiv) {
                        contents = el.innerHTML.split(''); // Reset the contents array.
                        index    = contents.length - 1; // Reset the index.
                    }

                    // Children of child.
                } else if (child.children.length) {
                    removeEmptys(child); // Recursion (read: inception).

                    if (!this[i].innerHTML.length) {
                        this[i].remove ? this[i].remove() : this[i].removeNode(); // Remove empty
                                                                                  // recursive
                                                                                  // parent.
                        contents = el.innerHTML.split('');
                        index    = contents.length - 1;
                    }
                }
            }, children);
        }

        // Prevent '0' from triggering Typer's default speed.
        if (item.speed === 0) item.speed = 1;

        // Empty the line all at once.
        if (item.back === 'empty') {
            q.newDiv.innerHTML = '';
            q.item++;
            return processq();
        }

        // Prevent larger 'back' quantities from needlessly interrupting the flow.
        if (item.back > q.newDiv.innerHTML.length) item.back = 'all';

        // A simple way to erase the whole line without knowing the contents:
        // set the # of 'backspaces' to the content's length.
        if (item.back === 'all') item.back = q.newDiv.textContent.length;

        // Negative #'s are an easy way to say "erase all BUT X-amount of characters."
        if (item.back < 0) {
            let text  = q.newDiv.textContent;
            item.back = text.substring(item.back * -1, text.length).length;
        }

        let counter  = 0;
        let contents = q.newDiv.innerHTML.split('');
        let index    = contents.length - 1;

        q.goBack = setInterval(function () {
            counter++;

            // TAG DETECTION
            if (contents[index] === '>') {
                let tag = [];

                for (let i = index; i >= 0; i--) {
                    tag.unshift(contents[i]);

                    // Closing tag check.
                    if (contents[i] === '<' && contents[i + 1] === '/') {
                        tag.length = 0; // Clear the tag array.

                        // Back-to-back-tags logic.
                        if (contents[i - 1] === '>') {

                        } else {
                            index = i - 1;
                            break;
                        }

                        // Void tag check.
                    } else if (contents[i] === '<') {
                        let _ret2 = function () {
                            let vTag   = tag.slice(1, tag.length - 1).join('');
                            let isVoid = q.voids.some(function (v) {
                                return v === vTag;
                            });

                            index = i - 1;

                            // Remove void tag.
                            if (isVoid) contents.splice(i, tag.length);
                            tag.length = 0;

                            // Back-to-back-tags logic.
                            if (contents[i - 1] === '>') {
                                return 'continue';
                            } else {
                                return 'break';
                            }
                        }();

                        switch (_ret2) {
                            case 'continue':
                            //continue;

                            case 'break':
                                break;
                        }
                    }
                }
            }

            // UNICODE DETECTION
            if (contents[index] === ';') {
                let uni = [];

                for (let j = index; j >= 0; j--) {
                    uni.unshift(contents[j]);
                    if (contents[j] === '&') break;
                }

                let div       = document.createElement('div');
                div.innerHTML = uni.join('');

                if (div.textContent.length === 1) {
                    index = j - 1;
                    // Remove the whole chunk.
                    contents.splice(j, uni.length);
                } else {
                    // Remove a single character.
                    contents.splice(index, 1);
                    index--;
                }

                q.newDiv.innerHTML = contents.join('');

                // DEFAULT SINGLE-CHARACTER REMOVAL
            } else {
                contents.splice(index, 1);
                q.newDiv.innerHTML = contents.join('');
                index--;
            }

            // Exit.
            if (counter === item.back) {
                clearInterval(q.goBack);
                removeEmptys(q.newDiv);
                q.item++;
                processq();
            }
        }, item.speed || speed);
    }

    function processEmpty() {
        q.newDiv     = '';
        el.innerHTML = '';
        processLine({line: 1}); // This will stop the main iterator & run 'processq'.
    }

    function processRun(item) {
        clearInterval(q.type); // Stop the main iterator.

        item.run(el);
        q.item++;
        processq();
    }

    function processEnd() {
        clearInterval(q.type); // Final stop to our main iterator.
        q.cb(); // Run the callback provided.
    }

    // The kill switch.
    q.kill = function (e) {
        document.body.removeEventListener(e.type, q.kill);
        q.killed = true; // For processListen.

        // Stop all iterations & pauses.
        clearInterval(q.iterator); // From processMsg.
        clearInterval(q.goBack); // From processBack.
        clearTimeout(q.pause); // From processPause.

        if (q.item === q.length) return console.log('This typer has completed; removing listener.');

        // If typer is in a listener state...
        let ear = q[q.item];
        if (ear && ear.listen) {
            let _el = document.querySelector(ear.el);
            _el.dispatchEvent(new Event(ear.listen));
        }
    };

    // Return 'typerObj' to be able to run the various methods.
    return typerObj;
};