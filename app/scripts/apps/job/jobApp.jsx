var React = require('react'),
    Router = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    Table = Bootstrap.Table,
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var JobActions = require('../../actions/jobActions');
var JobListStore = require('../../stores/jobListStore');
var JobItemStore = require('../../stores/jobItemStore');

var JobList = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    render: function() {
        var items = _.map(this.props.items, function(item) {
                return (<tr onClick={this.props.clickHandler.bind(null, item)} key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
            </tr>)
        }.bind(this));

        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        );
    }
});

var List = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(JobListStore, 'list')],
    componentDidMount: function() {
        JobActions.load();
    },
    handleClick: function(obj) {
        this.transitionTo('job', { id: obj.id });
    },
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    Jobs
                </h2>

                <JobList items={this.state.list} clickHandler={this.handleClick}/>
            </div>
        );
    }
});

var Detail = React.createClass({
    mixins: [Router.State, Reflux.connect(JobItemStore, 'item')],
    componentDidMount: function() {
        var params = this.getParams();
        JobActions.loadItem(params.id);
    },
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    Job: {this.state.item.name}
                </h2>
            </div>
        );
    }
});

module.exports = {List: List, Detail: Detail};