var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var JobActions = require('../../actions/jobActions');
var JobStores = require('../../stores/jobStores');

var JobList = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    render: function() {
        var items = _.map(this.props.items, function(item) {
            return (<tr onClick={this.props.clickHandler.bind(null, item)} key={item.id}>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
            </tr>)
        }.bind(this));

        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        );
    }
});

module.exports = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(JobStores.List, 'list')],
    componentDidMount: function() {
        JobActions.list();
    },
    editJob: function(obj) {
        this.transitionTo('job_edit', {id: obj.id});
    },
    createJob: function() {
        this.transitionTo('job_create');
    },
    render: function() {
        return (
            <div className="page-main">
                <h2>
                <Button bsStyle="primary" onClick={this.createJob} className="pull-right">Create new job</Button>
                    Jobs
                </h2>

                <JobList items={this.state.list} clickHandler={this.editJob}/>
            </div>
        );
    }
});