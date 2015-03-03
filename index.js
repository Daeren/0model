//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.00.01
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
                var gObj = gExport.model;

                for(var i in gExport) {
                    if(gExport.hasOwnProperty(i))
                        gObj[i] = gExport[i];
                }

                if(typeof(global.$model) === "undefined")
                    global.$model = gObj;
            } else {
                if(global.$model === gExport.sanitize)
                    delete global.$model;
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

            var result = function(data, scenario) {
                if(schMethods)
                    this.__data = rAigis.sanitize(schAttributes, {});

                //---------]>

                if(data && typeof(data) === "object")
                    this.data(data);

                if(evOnCreate)
                    evOnCreate.call(this);
            };

            result.prototype = {
                "data": function(name, v) {
                    if(!schAttributes)
                        throw new Error("[!] 0model: [data] - schema without attributes");

                    var schData, newVal, oldVal,
                        dc = this.__data;

                    //---------]>

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

                        return dc;
                    }

                    if(arguments.length == 1)
                        return dc[name];

                    schData = schAttributes[name];

                    oldVal = dc[name];
                    newVal = dc[name] = runFilter(name, rAigis.sanitize(schData.type, typeof(v) === "function" ? v.call(oldVal) : v, schData), schData);

                    if(onChangeData)
                        onChangeData.call(this, name, newVal, oldVal);

                    return newVal;
                },

                "validate": function(errors) {
                    if(!schAttributes)
                        throw new Error("[!] 0model: [validate] - schema without attributes");

                    //---------]>

                    return rAigis.validate(schAttributes, this.__data, errors ? {"errors": true} : undefined);
                },

                "toJSON": function(replacer, space) {
                    return JSON.stringify(this.__data, replacer, space);
                },

                "fromJSON": function(data) {
                    if(!data || typeof(data) !== "string")
                        return this;

                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        return this;
                    }

                    if(!data || Array.isArray(data))
                        return this;

                    this.data(data);

                    return this;
                }
            };

            //--------)>

            for(var method in schMethods) {
                if(!Object.prototype.hasOwnProperty.call(schMethods, method)) continue;

                if(["data", "validate"].indexOf(method) !== -1)
                    throw new Error("[!] 0model: Cannot redefine property: " + method);

                result.prototype[method] = schMethods[method];
            }

            //---------------]>

            return gModelStore[name] = function(data, scenario) {
                return new result(data, scenario);
            };
        }
    };

    return gExport;
})();

//-----------------------------------------------------

if(typeof(module) == "object") {
    module.exports = $0model;
}