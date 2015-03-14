var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table, PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list'),
    Icon = require('react-fa/dist/Icon'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/repositoryActions');
var Stores = require('../../stores/repositoryStores');

var RepositoryList = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list'), ListMixin],
    listAction: Actions.list,
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
        {field: 'type', title: 'Type', filter: true, sort: true},
        {field: 'url', title: 'URL', filter: true, sort: true},
        {field: 'branch', title: 'Branch', filter: true, sort: true},
        {field: 'actions', title: 'Actions', filter: false, sort: false}
    ],
    propTypes: {
        limit: React.PropTypes.number,
        skip: React.PropTypes.number,
        sort: React.PropTypes.string
    },
    componentDidMount() {
        this.load();
    },
    renderRow(item) {
        return (<tr onClick={this.clickItem.bind(null, item)} key={item.id}>
            <td>{item.name}</td>
            <td>{item.type}</td>
            <td>{item.url}</td>
            <td>{item.branch}</td>
            <td><Button onClick={this.sync.bind(null, item)} bsSize="small"><Icon name="refresh"/></Button></td>
        </tr>);
    },
    clickItem(obj, e) {
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
        return this._render();
    }
});

module.exports = React.createClass({
    mixins: [Router.Navigation],
    componentDidMount() {
    },
    createRepository() {
        this.transitionTo('repository_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Repositories
                    <small> Manage your playbook repositories</small>
                    <Button bsStyle="primary" onClick={this.createRepository} className="pull-right">Create new
                        repository</Button>
                </PageHeader>

                <RepositoryList />
            </div>
        );
    }
});