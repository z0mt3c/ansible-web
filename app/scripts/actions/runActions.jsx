var Reflux = require('reflux');
var reqwest = require('reqwest');

var Actions = Reflux.createActions(
    {
        'list': {asyncResult: true},
        'get': {asyncResult: true},
        'delete': {asyncResult: true},
        'update': {asyncResult: true}
    }
);

Actions.delete.listen(function(id) {
    reqwest({
        method: 'delete',
        url: '/api/run/' + id,
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.update.listen(function(job) {
    return reqwest({
        method: 'put',
        url: '/api/run/' + job.id,
        type: 'json',
        data: job
    }).then(this.completed, this.failed);
});

module.exports = Actions;