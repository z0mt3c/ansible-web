var Reflux = require('reflux');
var reqwest = require('reqwest');

var Actions = Reflux.createActions(
    {
        'list': {asyncResult: true},
        'files': {asyncResult: true},
        'sync': {asyncResult: true},
        'get': {asyncResult: true},
        'create': {asyncResult: true},
        'delete': {asyncResult: true},
        'update': {asyncResult: true}
    }
);

Actions.create.listen(function(project) {
    reqwest({
        method: 'post',
        url: '/api/project',
        type: 'json',
        data: project
    }).then(this.completed, this.failed);
});

Actions.delete.listen(function(id) {
    reqwest({
        method: 'delete',
        url: '/api/project/' + id,
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.update.listen(function(project) {
    return reqwest({
        method: 'put',
        url: '/api/project/' + project.id,
        type: 'json',
        data: project
    }).then(this.completed, this.failed);
});

Actions.sync.listen(function(id) {
    return reqwest({
        method: 'post',
        url: '/api/project/' + id + '/sync',
        type: 'json'
    }).then(this.completed, this.failed);
});

Actions.files.shouldEmit = function(id) {
    return !!id;
};

Actions.sync.shouldEmit = function(id) {
    return !!id;
};

module.exports = Actions;