var Reflux = require('reflux');
var reqwest = require('reqwest');

var Actions = Reflux.createActions(
    ['load', 'loadError', 'loadItem', 'loadItemError']
);
/*
Actions.add.preEmit = function(job) {
    reqwest({
        method: 'put',
        url: '/api/job',
        type: 'json',
        data: job
    }).then(function() {
        console.log(arguments);
    });
};

Actions.remove.preEmit = function(id) {
    reqwest({
        method: 'delete',
        url: '/api/job/' + id,
        type: 'json'
    }).then(function() {
        console.log(arguments);
    });
};

Actions.update.preEmit = function(job) {
    reqwest({
        method: 'put',
        url: '/api/job/' + job.id,
        type: 'json',
        data: job
    }).then(function() {
        console.log(arguments);
    });
};
*/

module.exports = Actions;