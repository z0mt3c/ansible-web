var Reflux = require('reflux');
var reqwest = require('reqwest');
var _ = require('lodash');
var actions = require('../actions/jobActions');

module.exports = Reflux.createStore({
    init() {
        this.listenTo(actions.load, this.load);
    },

    load() {
        reqwest({
            url: '/api/job',
            type: 'json'
        }).then(this.onLoad, this.onLoadError);
    },

    onLoad: function(items) {
        this.list = items;
        this.trigger(this.list);
    },

    onLoadError: function(error) {
        actions.loadError(error);
        this.list = [];
        this.trigger(this.list);
    },

    updateList(list) {
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


var errorStore = Reflux.createStore({
    init: function() {
        this.listenTo(actions.loadError, this.trigger);
        // just a shortcut (pass on the error message to the listening
        // components), just to avoid having components listen to the
        // action directly

        // This enables us to refactor the error flow later to do
        // more complex error handling, but for now we assume the
        // error handling components in our application use the error
        // message that comes from the PostsApi

        // Suggestions include handle error messaging state
        // (for when to show and hide error messages), or
        // handling list of error notifications (clearing error
        // messages, etc.)
    },
    getDefaultData: function() { return ""; }
});