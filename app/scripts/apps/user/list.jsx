var React = require('react/addons'),
    Router = require('react-router'),
    { Button, PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list');

var Reflux = require('reflux');
var Actions = require('../../actions/userActions');
var Stores = require('../../stores/userStores');

var UserList = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list'), ListMixin],
    getListAction() { return Actions.list; },
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
        {field: 'email', title: 'Email', filter: true, sort: true},
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
        return (<tr onClick={this._click.bind(null, item)} key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td className="actions">
                {this._renderEdit(item)}
                {' '}
                {this._renderDelete(item)}
            </td>
        </tr>);
    },
    edit(obj, e) {
        e.preventDefault();
        this.transitionTo('user_edit', {id: obj.id});
    },
    delete(obj, e) {
        e.preventDefault();
        Actions.delete.triggerPromise(obj.id).then(function() {
            this.load();
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
    createUser() {
        this.transitionTo('user_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Users
                    <small> Manage your users</small>
                    <Button bsStyle="primary" onClick={this.createUser} className="pull-right">Create new user</Button>
                </PageHeader>

                <UserList sort="+name" />
            </div>
        );
    }
});