/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 26/11/2014.
 *
 * Copyright (c) 2014, Kyriakos Barbounakis k.barbounakis@gmail.com
 Anthi Oikonomou anthioikonomou@gmail.com
 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 * Neither the name of MOST web framework nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var pagedown = require('pagedown'), fs = require('fs');
/**
 * @class MarkdownEngine
 * Represents a view engine that may be used in MOST web framework applications.
 * @param {HttpContext|*} context
 * @constructor
 * @property {HttpContext|*} context
 */
function MarkdownEngine(context) {
    var ctx = context;
    Object.defineProperty(this, 'context', {
        get: function () {
            return ctx;
        },
        set: function (value) {
            ctx = value;
        },
        configurable: false,
        enumerable: false
    });
}
/**
 * Renders the view by attaching the data specified if any
 * @param {string|function()} file A string that represents the physical path of the view or a function which returns the view path
 * @param {*} data Any data to be attached in the result
 * @param {function(Error=,string=)} callback A callback function to be called when rendering operation will be completed.
 */
MarkdownEngine.prototype.render = function(file, data, callback) {
    callback = callback || function() {};
    var self = this;
    var physicalPath;
    try {
        //if first argument is a function
        if (typeof file === 'function') {
            //invoke this function and return the physical path of the target view
            physicalPath = file.call();
        }
        else if (typeof file === 'string') {
            //otherwise get physical
            physicalPath = file;
        }
        else {
            //or raise error for invalid type
            callback(new TypeError('The target view path has an invalid type or is empty.'));
            return;
        }
        fs.readFile(physicalPath, 'utf8', function(err, data) {
           if (err) {
               //throw error
               callback(err);
           }
            else {
               //convert data
               try {
                   /**
                    * @type {Markdown.Converter|*}
                    */
                   var converter = new pagedown.Converter();
                   var result = converter.makeHtml(data);
                   //return the converted HTML markup
                   callback(null, result);
               }
               catch (e) {
                   //throw error
                   callback(e);
               }
           }
        });
    }
    catch(e) {
        callback(e);
        return;
    }

};

var md = {
    /**
     * Creates a new instance of MarkdownEngine class
     * @param {HttpContext|*} context - The underlying HTTP context.
     * @returns {MarkdownEngine}
     */
    createInstance:function(context) {
        return new MarkdownEngine(context);
    }
};

if (typeof exports !== 'undefined') module.exports = md;