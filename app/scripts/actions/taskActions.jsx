var Reflux = require('reflux');
var reqwest = require('reqwest');
var rootResource = '/api/task';

var Actions = Reflux.createActions(
    {
        'list': {asyncResult: true},
        'get': {asyncResult: true},
        'run': {asyncResult: true},
        'create': {asyncResult: true},
        'delete': {asyncResult: true},
        'update': {asyncResult: true}
    }
);

Actions.create.listen(function(job) {
    reqwest({
        method: 'post',
        url: rootResource,
        type: 'json',
        data: job
    }).then(this.completed, this.failed);
});

Actions.delete.listen(function(id) {
    reqwest({
        method: 'delete',
        url: rootResource + '/' + id,
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.update.listen(function(job) {
    return reqwest({
        method: 'put',
        url: rootResource + '/' + job.id,
        type: 'json',
        data: job
    }).then(this.completed, this.failed);
});

Actions.run.listen(function(id) {
    return reqwest({
        method: 'post',
        url: rootResource + '/' + id + '/run',
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.run.shouldEmit = function(id) {
    return !!id;
};

module.exports = Actions;