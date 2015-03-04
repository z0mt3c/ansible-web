var React = require('react'),
    Router = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    Table = Bootstrap.Table,
    _ = require('lodash'),
    $ = require('jquery'),
    ListElement = require('../../components/list').List;

var columns = [
    {key: 'id', value: 'ID'},
    {key: 'type', value: 'type'},
    {key: 'name', value: 'name'}
];

var Reflux = require('reflux');
var JobActions = require('../../actions/jobActions');
var JobStore = require('../../stores/jobStore');

var List = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(JobStore, 'list')],
    componentDidMount: function() {
        JobActions.load();
    },
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    Jobs
                </h2>

                <ListElement items={this.state.list} columns={columns}/>
            </div>
        );
    }
});

var Detail = React.createClass({
    mixins: [Router.State],
    componentDidMount: function() {
        console.log(this.getParams());
    },
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    Job {this.getParams()}
                </h2>
            </div>
        );
    }
});

module.exports = {List: List, Detail: Detail};