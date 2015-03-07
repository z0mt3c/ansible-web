var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var ProjectActions = require('../../actions/projectActions');
var ProjectStores = require('../../stores/projectStores');

var ProjectList = React.createClass({
    mixins: [Router.Navigation],
    propTypes: {
        items: React.PropTypes.array
    },
    edit: function(obj, e) {
        e.preventDefault();
        this.transitionTo('project_edit', {id: obj.id});
    },
    sync: function(obj, e) {
        e.preventDefault();
        e.stopPropagation();
        ProjectActions.sync(obj.id);
    },
    render: function() {
        var items = _.map(this.props.items, function(item) {
            return (<tr onClick={this.edit.bind(null, item)} key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td>{item.url}</td>
                <td>{item.branch}</td>
                <td><Button onClick={this.sync.bind(null, item)}>SYNC</Button></td>
            </tr>)
        }.bind(this));

        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Url</th>
                        <th>Branch</th>
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
    mixins: [Router.Navigation, Reflux.connect(ProjectStores.List, 'list')],
    componentDidMount: function() {
        ProjectActions.list();
    },
    createProject: function() {
        this.transitionTo('project_create');
    },
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    <Button bsStyle="primary" onClick={this.createProject} className="pull-right">Create new project</Button>
                    Projects
                </h2>

                <ProjectList items={this.state.list} />
            </div>
        );
    }
});