var Reflux = require('reflux');
var reqwest = require('reqwest');
var rootResource = '/api/user';

var Actions = Reflux.createActions(
    {
        'list': {asyncResult: true},
        'get': {asyncResult: true},
        'create': {asyncResult: true},
        'delete': {asyncResult: true},
        'update': {asyncResult: true}
    }
);

Actions.create.listen(function(project) {
    reqwest({
        method: 'post',
        url: rootResource,
        type: 'json',
        data: project
    }).then(this.completed, this.failed);
});

Actions.delete.listen(function(id) {
    reqwest({
        method: 'delete',
        url: rootResource + '/' + id,
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.update.listen(function(project) {
    return reqwest({
        method: 'put',
        url: rootResource + '/' + project.id,
        type: 'json',
        data: project
    }).then(this.completed, this.failed);
});

module.exports = Actions;