//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.00.011
//
//-----------------------------------------------------

var $0model = (function createInstance() {
    "use strict";

    //-----------------------------]>

    var rAigis = typeof($aigis) !== "undefined" ? $aigis : require("aigis").global(false);

    //-----------------------------]>

    var gModelStore = {};

    //-----------------------------]>

    var gExport = {
        "global": function(v) {
            if(global && typeof(global) !== "object" || typeof(v) === "undefined")
                return this;

            if(v) {
                var gSObj = gExport.sanitize,
                    gVObj = gExport.validate;

                for(var i in gExport) {
                    if(gExport.hasOwnProperty(i))
                        gSObj[i] = gVObj[i] = gExport[i];
                }

                if(typeof(global.$sanitize) === "undefined")
                    global.$sanitize = gSObj;

                if(typeof(global.$validate) === "undefined")
                    global.$validate = gVObj;
            } else {
                if(global.$sanitize === gExport.sanitize)
                    delete global.$sanitize;

                if(global.$validate === gExport.validate)
                    delete global.$validate;
            }

            return this;
        },

        "type": function() {
            rAigis.apply(rAigis, arguments);
            return this;
        },

        "rule": function(name, func) {
            rAigis.apply(rAigis, arguments);
            return this;
        },

        //--------]>

        "model": function(name, schema) {
            if(arguments.length == 1)
                return gModelStore[name];

            if(!schema || typeof(schema) !== "object")
                return null;

            //---------------]>

            var schAttributes   = schema.attributes,
                schMethods      = schema.methods,
                schFilters      = schema.filters;

            var evOnCreate      = schema.onCreate,
                onChangeData    = schema.onChangeData;


            var mdlFiltersStore = {};

            //------)>

            if(!schAttributes || typeof(schAttributes) !== "object") schAttributes = null;
            else {
                var schData;

                for(var attribute in schAttributes) {
                    if(!Object.prototype.hasOwnProperty.call(schAttributes, attribute)) continue;

                    schData = schAttributes[attribute];

                    if(typeof(schData) === "string") {
                        schAttributes[attribute] = {"type": schData};
                    } else {
                        schData.type = schData.type || schData.use;
                    }
                }
            }

            if(!schMethods || typeof(schMethods) !== "object") schMethods = null;

            if(!schFilters || typeof(schFilters) !== "object") schFilters = null;
            else {
                for(var attribute in schFilters) {
                    if(!Object.prototype.hasOwnProperty.call(schFilters, attribute)) continue;

                    schFilters[attribute].forEach(function(filter) {
                        if(typeof(filter) !== "function")
                            return;

                        mdlFiltersStore[attribute] = mdlFiltersStore[attribute] || [];
                        mdlFiltersStore[attribute].push(filter);
                    });
                }
            }

            if(typeof(evOnCreate) !== "function") evOnCreate = null;
            if(typeof(onChangeData) !== "function") onChangeData = null;

            //---------------]>

            function runFilter(attribute, data, options) {
                var filters = mdlFiltersStore[attribute];

                if(filters) {
                    for(var i = 0, len = filters.length; i < len; i++) {
                        data = filters[i].call(data);
                    }

                    data = rAigis.sanitize(options.type, data, options);
                }

                return data;
            }

            //---------------]>

            var result = function() {
                if(schMethods)
                    this.__data = rAigis.sanitize(schAttributes, {});
            };

            result.prototype = {
                "data": function(name, v) {
                    if(!schMethods)
                        throw new Error("[!] 0model: schema without attributes");

                    //---------]>

                    var schData, oldVal,
                        dc = this.__data;

                    if(arguments.length == 0)
                        return dc;

                    if(name && typeof(name) === "object") {
                        for(var attribute in schAttributes) {
                            if(
                                !Object.prototype.hasOwnProperty.call(schAttributes, attribute) ||
                                !Object.prototype.hasOwnProperty.call(name, attribute)
                            ) continue;

                            schData = schAttributes[attribute];
                            dc[attribute] = runFilter(attribute, rAigis.sanitize(schData.type, name[attribute], schData), schData);
                        }

                        return this;
                    }

                    if(arguments.length == 1)
                        return dc[name];

                    schData = schAttributes[name];

                    oldVal = dc[name];
                    dc[name] = runFilter(name, rAigis.sanitize(schData.type, typeof(v) === "function" ? v.call(oldVal) : v, schData), schData);

                    if(onChangeData)
                        onChangeData.call(this, name, dc[name], oldVal);

                    return this;
                }
            };

            //--------)>

            for(var method in schMethods) {
                if(!Object.prototype.hasOwnProperty.call(schMethods, method)) continue;

                if(["data"].indexOf(method) !== -1)
                    throw new Error("[!] 0model: Cannot redefine property: " + method);

                result.prototype[method] = schMethods[method];
            }

            //---------------]>

            return gModelStore[name] = function(data) {
                var objModel = new result(data);

                if(data && typeof(data) === "object") {
                    objModel.data(data);
                }

                if(evOnCreate)
                    evOnCreate.call(objModel);

                return objModel;
            };
        }
    };

    return gExport;
})();

//-----------------------------------------------------

if(typeof(module) == "object") {
    module.exports = $0model;
}