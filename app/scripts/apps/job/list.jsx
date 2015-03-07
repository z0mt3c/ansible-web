var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var JobActions = require('../../actions/jobActions');
var JobStores = require('../../stores/jobStores');

var JobList = React.createClass({
    mixins: [Router.Navigation],
    propTypes: {
        items: React.PropTypes.array
    },
    run: function(item, e) {
        e.preventDefault();
        e.stopPropagation();
        JobActions.run(item.id);
    },
    editJob: function(obj) {
        this.transitionTo('job_edit', {id: obj.id});
    },
    render: function() {
        var items = _.map(this.props.items, function(item) {
            return (<tr onClick={this.editJob.bind(null, item)} key={item.id}>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td><Button onClick={this.run.bind(null, item)}>RUN</Button></td>
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
                        <th>Actions</th>
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

                <JobList items={this.state.list} />
            </div>
        );
    }
});