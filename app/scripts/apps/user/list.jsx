var React = require('react/addons'),
    Router = require('react-router'),
    { Button, ButtonGroup, Table, PageHeader } = require('react-bootstrap'),
    _ = require('lodash'),
    Icon = require('react-fa/dist/Icon'),
    ListMixin = require('../../mixins/list');

var Reflux = require('reflux');
var Actions = require('../../actions/userActions');
var Stores = require('../../stores/userStores');

var UserList = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list'), ListMixin],
    listAction: Actions.list,
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
        {field: 'email', title: 'Email', filter: true, sort: true},
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
        return (<tr onClick={this.edit.bind(null, item)} key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>
                <Button onClick={this.edit.bind(null, item)} bsSize="small"><Icon name="edit"/></Button>
                {' '}
                <Button onClick={this.remove.bind(null, item)} bsSize="small"><Icon name="remove"/></Button>
            </td>
        </tr>);
    },
    edit(obj, e) {
        e.preventDefault();
        this.transitionTo('user_edit', {id: obj.id});
    },
    remove(obj, e) {
        e.preventDefault();
        this.transitionTo('user_edit', {id: obj.id});
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

                <UserList />
            </div>
        );
    }
});