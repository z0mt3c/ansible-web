var Reflux = require('reflux');
var reqwest = require('reqwest');
var _ = require('lodash');
var actions = require('../actions/repositoryActions');

var Stores = module.exports = {};

Stores.List = Reflux.createStore({
    init() {
        this.listenTo(actions.list, this.list);
    },

    list() {
        reqwest({
            url: '/api/repository',
            type: 'json'
        }).then(this.onSuccess, this.onError);
    },

    onSuccess: function(items) {
        this.update(items);
        actions.list.completed(items);
    },

    onError: function(error) {
        this.update([]);
        actions.list.failed(error);
    },

    update(list) {
        this.list = list;
        this.trigger(list);
    },

    getInitialState() {
        this.list = [];
        return this.list;
    },

    getDefaultData() {
        return this.list;
    }
});


Stores.Get = Reflux.createStore({
    init() {
        this.listenTo(actions.get, this.get);
    },

    get(id) {
        reqwest({
            url: '/api/repository/' + id,
            type: 'json'
        }).then(this.onSuccess, this.onError);
    },

    onSuccess: function(item) {
        this.update(item);
        actions.get.completed(item);
    },

    onError: function(error) {
        this.update({});
        actions.get.failed(error);
    },

    update(item) {
        this.item = item;
        this.trigger(item);
    },

    getInitialState() {
        this.item = {};
        return this.item;
    },

    getDefaultData() {
        return this.item;
    }
});

Stores.Files = Reflux.createStore({
    init() {
        this.listenTo(actions.files, this.get);
    },

    get(id) {
        reqwest({
            url: '/api/repository/' + id + '/files',
            type: 'json'
        }).then(this.onSuccess, this.onError);
    },

    onSuccess: function(item) {
        this.update(item);
        actions.get.completed(item);
    },

    onError: function(error) {
        this.update([]);
        actions.get.failed(error);
    },

    update(item) {
        this.item = item;
        this.trigger(item);
    },

    getInitialState() {
        this.item = [];
        return this.item;
    },

    getDefaultData() {
        return this.item;
    }
});
