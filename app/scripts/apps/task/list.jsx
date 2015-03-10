var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/taskActions');
var Stores = require('../../stores/taskStores');

var JobList = React.createClass({
    mixins: [Router.Navigation],
    propTypes: {
        items: React.PropTypes.array
    },
    run: function(item, e) {
        e.preventDefault();
        e.stopPropagation();
        Actions.run(item.id);
    },
    editJob: function(obj) {
        this.transitionTo('task_edit', {id: obj.id});
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
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list')],
    componentDidMount: function() {
        Actions.list();
    },
    createJob: function() {
        this.transitionTo('task_create');
    },
    render: function() {
        return (
            <div className="page-main">
                <h2>
                <Button bsStyle="primary" onClick={this.createJob} className="pull-right">Create new task</Button>
                    Tasks
                </h2>

                <JobList items={this.state.list} />
            </div>
        );
    }
});