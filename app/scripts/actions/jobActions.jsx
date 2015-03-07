var Reflux = require('reflux');
var reqwest = require('reqwest');

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
        url: '/api/job',
        type: 'json',
        data: job
    }).then(this.completed, this.failed);
});

Actions.delete.listen(function(id) {
    reqwest({
        method: 'delete',
        url: '/api/job/' + id,
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.update.listen(function(job) {
    return reqwest({
        method: 'put',
        url: '/api/job/' + job.id,
        type: 'json',
        data: job
    }).then(this.completed, this.failed);
});

Actions.run.listen(function(id) {
    return reqwest({
        method: 'post',
        url: '/api/job/' + id + '/run',
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.run.shouldEmit = function(id) {
    return !!id;
};

module.exports = Actions;