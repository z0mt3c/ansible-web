var React = require('react'),
    Router = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    Table = Bootstrap.Table,
    _ = require('lodash'),
    $ = require('jquery'),
    List = require('../../components/list').List;

var columns = [
    {key: 'id', value: 'ID'},
    {key: 'type', value: 'type'},
    {key: 'name', value: 'name'}
];

var Reflux = require('reflux');
var JobActions = require('../../actions/jobActions');
var JobStore = require('../../stores/jobStore');

var Main = module.exports = React.createClass({
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

                <List items={this.state.list} columns={columns}/>
            </div>
        );
    }
});
