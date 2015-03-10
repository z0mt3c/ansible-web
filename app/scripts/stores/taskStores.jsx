var Reflux = require('reflux');
var reqwest = require('reqwest');
var _ = require('lodash');
var Actions = require('../actions/taskActions');

var Stores = module.exports = {};

Stores.List = Reflux.createStore({
    init() {
        this.listenTo(Actions.list, this.list);
    },

    list() {
        reqwest({
            url: '/api/task',
            type: 'json'
        }).then(this.onSuccess, this.onError);
    },

    onSuccess: function(items) {
        this.update(items);
        Actions.list.completed(items);
    },

    onError: function(error) {
        this.update([]);
        Actions.list.failed(error);
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
        this.listenTo(Actions.get, this.get);
    },

    get(id) {
        reqwest({
            url: '/api/task/' + id,
            type: 'json'
        }).then(this.onSuccess, this.onError);
    },

    onSuccess: function(item) {
        this.update(item);
        Actions.get.completed(item);
    },

    onError: function(error) {
        this.update({});
        Actions.get.failed(error);
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
