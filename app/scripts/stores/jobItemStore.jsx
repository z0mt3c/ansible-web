var Reflux = require('reflux');
var reqwest = require('reqwest');
var _ = require('lodash');
var actions = require('../actions/jobActions');

module.exports = Reflux.createStore({
    init() {
        this.listenTo(actions.loadItem, this.loadItem);
    },

    loadItem(id) {
        reqwest({
            url: '/api/job/' + id,
            type: 'json'
        }).then(this.onLoadItem, this.onLoadItemError);
    },

    onLoadItem: function(item) {
        this.item = item;
        this.trigger(this.item);
    },

    onLoadItemError: function(error) {
        actions.loadItemError(error);
        this.item = {};
        this.trigger(this.item);
    },

    updateList(item) {
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


var errorStore = Reflux.createStore({
    init: function() {
        this.listenTo(actions.loadItemError, this.trigger);
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