var _ = require('lodash');

module.exports = {
    prepareParams: function(options) {
        var params = _.extend({}, options, {filter: null}, options.filter);
        delete params.filter;

        _.each(params, function(value, key) {
            if (value === null || value === undefined || value === '') {
                delete params[key];
            }
        });

        return params;
    }
};