var React = require('react/addons'),

    { Alert, Input, PageHeader } = require('react-bootstrap'),
    _ = require('lodash');

var Reflux = require('reflux');
var Actions = require('../../actions/taskActions');
var VarEditor = require('../../components/var-editor');
var Stores = require('../../stores/taskStores');
var RepositoryActions = require('../../actions/repositoryActions');
var RepositoryStores = require('../../stores/repositoryStores');
var InventoryActions = require('../../actions/inventoryActions');
var InventoryStores = require('../../stores/inventoryStores');
var CredentialActions = require('../../actions/credentialActions');
var CredentialStores = require('../../stores/credentialStores');

var SelectCredential = React.createClass({
    mixins: [Reflux.connect(CredentialStores.List, 'credentials')],
    componentDidMount() {
        CredentialActions.list({limit: 9999});
    },
    render() {
        var options = [{id: '', name: 'Nothing'}].concat(this.state.credentials.items || []);
        return React.createElement(Input, React.__spread({}, this.props, {
                type: 'select',
                ref: 'input',
                key: 'input'
            }),
            _.map(options, function(credential) {
                return (<option value={credential.id} key={credential.id}>{credential.name}</option>);
            })
        );
    }
});

var SelectRepository = React.createClass({
    mixins: [Reflux.connect(RepositoryStores.List, 'repositories')],
    componentDidMount() {
        RepositoryActions.list({limit: 9999});
    },
    render() {
        var options = [{id: '', name: 'Nothing'}].concat(this.state.repositories.items || []);
        return React.createElement(Input, React.__spread({}, this.props, {
                type: 'select',
                ref: 'input',
                key: 'input'
            }),
            _.map(options, function(repository) {
                return (<option value={repository.id} key={repository.id}>{repository.name}</option>);
            })
        );
    }
});

var SelectInventory = React.createClass({
    mixins: [Reflux.connect(InventoryStores.List, 'inventories')],
    componentDidMount() {
        InventoryActions.list({limit: 9999});
    },
    render() {
        var options = [{id: '', name: 'Nothing'}].concat(this.state.inventories.items || []);
        return React.createElement(Input, React.__spread({}, this.props, {
                type: 'select',
                ref: 'input',
                key: 'input'
            }),
            _.map(options, function(inventory) {
                return (<option value={inventory.id} key={inventory.id}>{inventory.name}</option>);
            })
        );
    }
});

var SelectPlaybook = React.createClass({
    mixins: [Reflux.connect(RepositoryStores.Files, 'files')],
    propTypes: {
        repository: React.PropTypes.string
    },
    componentDidMount() {
        RepositoryActions.files(this.props.repository);
    },
    render() {
        var options = [].concat(this.state.files);

        return React.createElement(Input, React.__spread({}, this.props, {
                type: 'select',
                ref: 'input',
                key: 'input'
            }),
            _.map(options, function(file) {
                return (<option value={file} key={file}>{file}</option>);
            })
        );
    },
    componentWillReceiveProps: function(nextProps) {
        RepositoryActions.files(nextProps.repository);
    }
});


var JobForm = React.createClass({
    mixins: [Reflux.connect(Stores.Get), React.addons.LinkedStateMixin, Reflux.ListenerMixin],
    contextTypes: {
        router: React.PropTypes.func
    },
    componentDidMount() {
        var params = this.context.router.getCurrentParams();

        if (params.id) {
            Actions.get(params.id);
        }
    },
    completed() {
        this.props.onSave();
    },
    failed(xhr) {
        var body = JSON.parse(xhr.response);
        var state = this.state || {};
        state._error = body;
        this.setState(state);
    },
    submit(e) {
        e.preventDefault();
        var params = this.context.router.getCurrentParams();

        if (params.id) {
            Actions.update.triggerPromise(this.state).then(this.completed, this.failed);
        } else {
            Actions.create.triggerPromise(this.state).then(this.completed, this.failed);
        }
    },
    render() {
        var error = '';
        var state = this.state;

        var bsStyle = {};

        if (this.state._error) {
            var message = this.state._error.message;
            error = <Alert bsStyle="danger">{message}</Alert>;

            _.reduce(state._error.validation.keys, function(memo, key) {
                memo[key] = 'error';
                return memo;
            }, bsStyle);
        }

        var repositoryId = this.state.repositoryId;
        return (
            <form className="form-horizontal" onSubmit={this.submit}>
                {error}

                <Input type="text" label="Name" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>
                <Input type="textarea" label="Description" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('description')} bsStyle={bsStyle.description}/>

                <SelectRepository label="Repository" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('repositoryId')} bsStyle={bsStyle.repositoryId}/>
                <SelectPlaybook label="Playbook" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    ref="selectPlaybook" repository={repositoryId} valueLink={this.linkState('playbook')}
                    bsStyle={bsStyle.playbook}/>

                <Input type="select" label="Task type" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('runType')} bsStyle={bsStyle.runType}>
                    <option value="normal">normal</option>
                    <option value="check">check</option>
                </Input>

                <SelectInventory label="Inventory" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('inventoryId')} bsStyle={bsStyle.inventoryId}/>

                <SelectCredential label="Credential" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('credentialId')} bsStyle={bsStyle.credentialId}/>

                <Input type="text" label="Limit" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('hostLimit')} bsStyle={bsStyle.hostLimit}/>

                <Input type="text" label="Forks" defaultValue={0} labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('forks')} bsStyle={bsStyle.forks}/>

                <Input type="select" label="Verbosity" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('verbosity')} bsStyle={bsStyle.verbosity}>
                    <option value="default">Default</option>
                    <option value="verbose">Verbose</option>
                    <option value="debug">Debug</option>
                </Input>

                <VarEditor label="Variables" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('extraVars')} bsStyle={bsStyle.extraVars} />

                <Input type="submit" value="Save" wrapperClassName="col-sm-offset-2 col-sm-10"/>
            </form>
        );
    }
});

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},
    componentDidMount() {
    },
    save() {
        this.context.router.transitionTo('task_list');
    },
    render() {
        var params = this.context.router.getCurrentParams();

        return (
            <div className="page-main">
                <PageHeader>{params.id ? 'Edit task' : 'Create task'}
                    <small></small>
                </PageHeader>

                <JobForm id={params.id} onSave={this.save}/>
            </div>
        );
    }
});
