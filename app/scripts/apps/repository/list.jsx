var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table, PageHeader } = require('react-bootstrap'),
    Paging = require('../../components/paging'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/repositoryActions');
var Stores = require('../../stores/repositoryStores');

var ProjectList = React.createClass({
    mixins: [Router.Navigation],
    propTypes: {
        items: React.PropTypes.array
    },
    edit(obj, e) {
        e.preventDefault();
        this.transitionTo('repository_edit', {id: obj.id});
    },
    sync(obj, e) {
        e.preventDefault();
        e.stopPropagation();
        Actions.sync.triggerPromise(obj.id).then(function(data) {
            this.transitionTo('run_detail', {id: data.runId});
        }.bind(this));
    },
    render() {
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
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list')],
    componentDidMount() {
        Actions.list();
    },
    createProject() {
        this.transitionTo('repository_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Repositories
                    <small> Manage your playbook repositories</small>
                    <Button bsStyle="primary" onClick={this.createProject} className="pull-right">Create new
                        repository</Button>
                </PageHeader>

                <ProjectList items={this.state.list.items}/>

                <Paging paging={this.state.list.paging}/>
            </div>
        );
    }
});