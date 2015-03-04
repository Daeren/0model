//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.00.002
//
//-----------------------------------------------------

var $model = (function createInstance() {
    "use strict";

    //-----------------------------]>

    var rAigis = typeof($aigis) !== "undefined" ? $aigis : require("aigis").global(false);

    //-----------------------------]>

    var gModelStore     = {},
        gFilterStore    = {};

    //-------[HELPERS]-------}>

    function wFuncStore(name, func, store) {
        if(name === null)
            return;

        switch(typeof(name)) {
            case "string":
                if(func === null) delete store[name];
                else if(typeof(func) === "function") store[name] = func;

                break;

            case "object":
                for(var field in name) {
                    if(!Object.prototype.hasOwnProperty.call(name, field)) continue;

                    func = name[field];

                    if(func === null) delete store[name];
                    else if(typeof(func) === "function") store[name] = func;
                }

                break;
        }
    }

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

        "filter": function(name, func) {
            wFuncStore(name, func, gFilterStore);
            return this;
        },

        //--------]>

        "model": function(name, schema) {
            if(arguments.length == 1)
                return gModelStore[name];

            if(!schema || typeof(schema) !== "object")
                return null;

            //--------[INIT]--------}>

            var schStatic       = schema.static,
                schAttributes   = schema.attributes,
                schMethods      = schema.methods,
                schFilters      = schema.filters;

            var evOnCreate      = schema.onCreate,
                onChangeData    = schema.onChangeData;


            var mdlFiltersStore;

            //------)>

            if(!schStatic || typeof(schStatic) !== "object") schStatic = null;

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
            else {
                var func,
                    newObjMethods = {};

                for(var method in schMethods) {
                    if(!Object.prototype.hasOwnProperty.call(schMethods, method)) continue;

                    if(["data", "validate"].indexOf(method) !== -1)
                        throw new Error("[!] 0model: Cannot redefine property: " + method);

                    func = schMethods[method];

                    if(typeof(func) === "function")
                        newObjMethods[method] = func;
                }

                schMethods = newObjMethods;
            }

            if(!schFilters || typeof(schFilters) !== "object") schFilters = null;
            else {
                var filters, fSetFilter;

                for(var attribute in schFilters) {
                    if(!Object.prototype.hasOwnProperty.call(schFilters, attribute)) continue;

                    filters = schFilters[attribute];
                    fSetFilter = function(filter) {
                        if(typeof(filter) !== "string" && typeof(filter) !== "function")
                            return;

                        mdlFiltersStore = mdlFiltersStore || {};

                        mdlFiltersStore[attribute] = mdlFiltersStore[attribute] || [];
                        mdlFiltersStore[attribute].push(filter);
                    };

                    if(Array.isArray(filters))
                        filters.forEach(fSetFilter); else fSetFilter(filters);
                 }
            }

            if(typeof(evOnCreate) !== "function") evOnCreate = null;
            if(typeof(onChangeData) !== "function") onChangeData = null;

            //---------------]>

            function runFilter(attribute, data, scenario, options) {
                if(!mdlFiltersStore)
                    return data;

                var filters = mdlFiltersStore[attribute];

                if(filters) {
                    for(var f, i = 0, len = filters.length; i < len; i++) {
                        f = filters[i];

                        if(typeof(f) === "string") {
                            if(!gFilterStore[f])
                                throw new Error("[!] 0model: [filter] - not found: " + f);

                            f = gFilterStore[f];
                        }

                        data = f.call(data, scenario);
                    }

                    data = rAigis.sanitize(options.type, data, options);
                }

                return data;
            }

            //--------[BUILD: MODEL]--------}>

            var resModel = function(data, scenario) {
                if(schAttributes) {
                    this.scenario = scenario;
                    this.data(data && typeof(data) === "object" ? data : {});
                }

                if(evOnCreate)
                    evOnCreate.call(this);
            };

            resModel.prototype = {
                "data": function(name, v) {
                    if(!schAttributes)
                        throw new Error("[!] 0model: [data] - schema without attributes");

                    var isInit,
                        schData, newVal, oldVal,

                        dc = this.__data,
                        sc = this.scenario;

                    if(!dc) {
                        isInit = true;
                        dc = this.__data = {};
                    }

                    //---------]>

                    if(arguments.length == 0)
                        return dc;

                    //---------]>

                    if(name && typeof(name) === "object") {
                        for(var attribute in schAttributes) {
                            if(
                                !Object.prototype.hasOwnProperty.call(schAttributes, attribute) ||
                                !Object.prototype.hasOwnProperty.call(name, attribute)
                            ) continue;

                            schData = schAttributes[attribute];

                            if(
                                (isInit && schData.unsafe) ||
                                (typeof(schData.on) !== "undefined" && schData.on != sc)
                            )
                                continue;

                            oldVal = dc[attribute];
                            newVal = dc[attribute] = runFilter(attribute, rAigis.sanitize(schData.type, name[attribute], schData), sc, schData);

                            if(!isInit && onChangeData)
                                onChangeData.call(this, attribute, newVal, oldVal);
                        }

                        return dc;
                    }

                    //---------]>

                    if(arguments.length == 1)
                        return dc[name];

                    //---------]>

                    schData = schAttributes[name];

                    if(typeof(schData.on) !== "undefined" && schData.on != sc)
                        return;

                    oldVal = dc[name];
                    newVal = dc[name] = runFilter(name, rAigis.sanitize(schData.type, typeof(v) === "function" ? v.call(oldVal, this) : v, schData), sc, schData);

                    if(onChangeData)
                        onChangeData.call(this, name, newVal, oldVal);

                    return newVal;
                },

                "validate": function(errors) {
                    if(!schAttributes)
                        throw new Error("[!] 0model: [validate] - schema without attributes");

                    //---------]>

                    var opt;

                    if(errors || typeof(this.scenario) !== "undefined")
                        opt = {
                            "errors":   errors,
                            "on":       this.scenario
                        };

                    return rAigis.validate(schAttributes, this.__data, opt);
                },

                //-------]>

                "toJSON": function(replacer, space) {
                    return JSON.stringify(this.data(), replacer, space);
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

            if(schMethods) {
                for(var method in schMethods) {
                    if(!Object.prototype.hasOwnProperty.call(schMethods, method)) continue;

                    resModel.prototype[method] = schMethods[method];
                }
            }

            //--------[BUILD: MODEL-CONSTRUCTOR]--------}>

            var result = function(data, scenario) {
                return new resModel(data, scenario);
            };

            result.static = {};
            result.existMethod = function(name) {
                return schMethods && schMethods.hasOwnProperty(name);
            };

            //-------]>

            if(schStatic) {
                for(var field in schStatic) {
                    if(!Object.prototype.hasOwnProperty.call(schStatic, field)) continue;

                    result.static[field] = schStatic[field];
                }
            }

            Object.freeze(result.static);

            return gModelStore[name] = result;
        }
    };

    return gExport;
})();

//-----------------------------------------------------

if(typeof(module) == "object") {
    module.exports = $model.global(true);
}