var React = require('react/addons'),
    Router = require('react-router'),
    { Button, PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list'),
    Icon = require('../../components/icon');

var Reflux = require('reflux');
var Actions = require('../../actions/taskActions');
var Stores = require('../../stores/taskStores');

var TaskList = React.createClass({
    contextTypes: {router: React.PropTypes.func}, mixins: [Reflux.connect(Stores.List, 'list'), ListMixin],
    getListAction() {
        return Actions.list;
    },
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
        {field: 'type', title: 'Type', filter: true, sort: true},
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
        return (<tr key={item.id} onClick={this._click.bind(null, item)}>
            <td>{item.name}</td>
            <td>{item.type}</td>
            <td className="actions">
                <Button onClick={this.run.bind(null, item)} bsSize="small">
                    <Icon name="rocket"/>
                </Button>
                {' '}
                {this._renderEdit(item)}
                {' '}
                {this._renderDelete(item)}
            </td>
        </tr>);
    },
    run(item, e) {
        e.preventDefault();
        e.stopPropagation();
        Actions.run.triggerPromise(item.id).then(function(data) {
            this.context.router.transitionTo('run_detail', {id: data.runId});
        }.bind(this));
    },
    edit(obj, e) {
        e.preventDefault();
        this.context.router.transitionTo('task_edit', {id: obj.id});
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
    createTask() {
        this.context.router.transitionTo('task_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Tasks
                    <small> Manage your playbook execution tasks</small>
                    <Button bsStyle="primary" onClick={this.createTask} className="pull-right">Create new task</Button>
                </PageHeader>

                <TaskList />
            </div>
        );
    }
});