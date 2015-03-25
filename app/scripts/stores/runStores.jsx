var Reflux = require('reflux');
var reqwest = require('reqwest');
var _ = require('lodash');
var Actions = require('../actions/runActions');
var xResultCount = require('x-result-count');
var utils = require('../utils/utils');

var Stores = module.exports = {};

Stores.List = Reflux.createStore({
    init() {
        this.listenTo(Actions.list, this.list);
    },

    list(options) {
        var params = utils.prepareParams(options);

        var request = reqwest({
            url: '/api/run',
            type: 'json',
            data: params || {}
        });

        request.then(_.partialRight(this.onSuccess, request), this.onError);
    },

    onSuccess: function(items, request) {
        var resultCount = xResultCount.parse(request.request.getResponseHeader('x-result-count'));

        this.update({
            paging: resultCount,
            items: items
        });

        Actions.list.completed(items);
    },

    onError: function(error) {
        this.update(this.getInitialState());
        Actions.list.failed(error);
    },

    update(list) {
        this.list = list;
        this.trigger(list);
    },

    getInitialState() {
        this.list = {
            paging: {},
            items: []
        };

        return this.list;
    },

    getDefaultData() {
        return this.list;
    }
});


var io = require('socket.io-client');
var socket = io();


Stores.Get = Reflux.createStore({
    init() {
        this.listenTo(Actions.get, this.get);
    },

    get(id) {
        socket.emit('task:listen', id);
        socket.on('task:update', this.onUpdate);

        reqwest({
            url: '/api/run/' + id,
            type: 'json'
        }).then(this.onSuccess, this.onError);
    },

    onUpdate: function(data) {
        var item = this.item;
        var update = data ? data.update : null;

        if (item && item.id === data.id && (update.$push || update.$set)) {
            item = _.reduce(update.$push, function(memo, value, key) {
                var target = memo[key] = _.isArray(memo[key]) ? memo[key] : [];
                if (!_.contains(target, value)) {
                    target.push(value);
                }
                return memo;
            }, item);

            item = _.extend(item, update.$set);

            this.update(item);
        }
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