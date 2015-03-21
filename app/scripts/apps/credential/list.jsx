var React = require('react/addons'),
    Router = require('react-router'),
    { Button, PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list');

var Reflux = require('reflux');
var Actions = require('../../actions/credentialActions');
var Stores = require('../../stores/credentialStores');

var CredentialList = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list'), ListMixin],
    getListAction() { return Actions.list; },
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
        {field: 'description', title: 'Description', filter: true, sort: true},
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
            <td>{item.description}</td>
            <td className="actions">
                {this._renderEdit(item)}
                {' '}
                {this._renderDelete(item)}
            </td>
        </tr>);
    },
    edit(obj, e) {
        e.preventDefault();
        this.transitionTo('credential_edit', {id: obj.id});
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

                <CredentialList sort="+name"/>
            </div>
        );
    }
});
