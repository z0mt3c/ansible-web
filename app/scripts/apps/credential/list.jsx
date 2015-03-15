var React = require('react/addons'),
    Router = require('react-router'),
    { Button, ButtonGroup, Table, PageHeader } = require('react-bootstrap'),
    _ = require('lodash'),
    Icon = require('react-fa/dist/Icon'),
    ListMixin = require('../../mixins/list');

var Reflux = require('reflux');
var Actions = require('../../actions/credentialActions');
var Stores = require('../../stores/credentialStores');

var CredentialList = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list'), ListMixin],
    listAction: Actions.list,
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
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
            <td>
                <Button onClick={this.edit.bind(null, item)} bsSize="small"><Icon name="edit"/></Button>
                {' '}
                <Button onClick={this.remove.bind(null, item)} bsSize="small"><Icon name="remove"/></Button>
            </td>
        </tr>);
    },
    edit(obj, e) {
        e.preventDefault();
        this.transitionTo('credential_edit', {id: obj.id});
    },
    remove(obj, e) {
        e.preventDefault();
        this.transitionTo('credential_edit', {id: obj.id});
    },
    render() {
        return this._render();
    }
});

module.exports = React.createClass({
    mixins: [Router.Navigation],
    componentDidMount() {
    },
    createCredential() {
        this.transitionTo('credential_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Credentials
                    <small> Manage your host credentials</small>
                    <Button bsStyle="primary" onClick={this.createCredential} className="pull-right">Create new credential</Button>
                </PageHeader>

                <CredentialList />
            </div>
        );
    }
});