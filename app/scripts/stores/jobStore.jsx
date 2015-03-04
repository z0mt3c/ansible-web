var Reflux = require('reflux');
var reqwest = require('reqwest');
var _ = require('lodash');
var actions = require('../actions/jobActions');

module.exports = Reflux.createStore({
    listenables: [actions],

    init() {
        //this.listenTo(actions.load, this.load);
    },

    load() {
        reqwest({
            url: '/api/job',
            type: 'json'
        }).then(function(response) {
            this.list = response;
            this.trigger(this.list);
        }.bind(this));
    },

    onAdd(item) {
        this.updateList([
            item
        ].concat(this.list));
    },

    onRemove(id) {
        var newList = _.reject(this.list, {id: id});
        this.updateList(newList);
    },

    onUpdate(obj) {
        var newList = _.clone(this.list);
        var index = _.findIndex(newList, {id: obj.id});
        newList[index] = obj;
        this.updateList(newList)
    },

    updateList(list) {
        this.list = list;
        this.trigger(list);
    },

    getInitialState() {
        this.list = [];
        return this.list;
    }
})