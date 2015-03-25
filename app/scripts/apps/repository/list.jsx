var React = require('react/addons'),
    Router = require('react-router'),
    { Button, PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list'),
    Icon = require('../../components/icon');

var Reflux = require('reflux');
var Actions = require('../../actions/repositoryActions');
var Stores = require('../../stores/repositoryStores');

var RepositoryList = React.createClass({
    contextTypes: {router: React.PropTypes.func}, mixins: [Reflux.connect(Stores.List, 'list'), ListMixin],
    getListAction() {
        return Actions.list;
    },
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
        {field: 'type', title: 'Type', filter: true, sort: true},
        {field: 'url', title: 'URL', filter: true, sort: true},
        {field: 'branch', title: 'Branch', filter: true, sort: true},
        {field: 'actions', title: 'Actions', filter: false, sort: false, hide: true, className: 'actions'}
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
        return (<tr key={item.id} onClick={this._click.bind(null, item)} >
            <td>{item.name}</td>
            <td>{item.type}</td>
            <td>{item.url}</td>
            <td>{item.branch}</td>
            <td className="actions">
                <Button onClick={this.sync.bind(null, item)} bsSize="small">
                    <Icon name="refresh"/>
                </Button>
                {' '}
                {this._renderEdit(item)}
                {' '}
                {this._renderDelete(item)}
            </td>
        </tr>);
    },
    edit(obj, e) {
        e.preventDefault();
        this.context.router.transitionTo('repository_edit', {id: obj.id});
    },
    delete(obj, e) {
        e.preventDefault();
        Actions.delete.triggerPromise(obj.id).then(function() {
            this.load();
        }.bind(this));
    },
    sync(obj, e) {
        e.preventDefault();
        e.stopPropagation();
        Actions.sync.triggerPromise(obj.id).then(function(data) {
            this.context.router.transitionTo('run_detail', {id: data.runId});
        }.bind(this));
    },
    render() {
        return this._render();
    }
});

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},
    componentDidMount() {
    },
    createRepository() {
        this.context.router.transitionTo('repository_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Repositories
                    <small> Manage your playbook repositories</small>
                    <Button bsStyle="primary" onClick={this.createRepository} className="pull-right">Create new
                        repository</Button>
                </PageHeader>

                <RepositoryList sort="+name" />
            </div>
        );
    }
});