var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input, PageHeader } = require('react-bootstrap'),
    _ = require('lodash');

var Reflux = require('reflux');
var Actions = require('../../actions/credentialActions');
var Stores = require('../../stores/credentialStores');

var CredentialForm = React.createClass({
    mixins: [Reflux.connect(Stores.Get), React.addons.LinkedStateMixin],
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
    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    },
    onDrop(e) {
        e.preventDefault();
        var file = _.first(e.dataTransfer.files);
        var reader = new FileReader();

        reader.onload = function(e) {
            this.setState({sshKey: e.target.result});
        }.bind(this);

        reader.readAsText(file, 'utf8');
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


        var form = null;

        if (this.state.type === 'machine') {
            form = (<div>
                <Input type="text" label="SSH User" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('sshUser')} bsStyle={bsStyle.sshUser}/>

                <Input type="select" label="SSH Auth Type" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('sshAuthType')} bsStyle={bsStyle.sshAuthType}>
                    <option value="">Choose</option>
                    <option value="password">Password</option>
                    <option value="key">Key</option>
                    <option value="keyPath">Path to key</option>
                </Input>

                {this.state.sshAuthType === 'password' ? <Input type="password" label="SSH Password" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('sshPassword')} bsStyle={bsStyle.sshPassword}/> : null}
                {this.state.sshAuthType === 'key' ? <Input type="textarea" label="SSH Key" labelClassName="col-sm-2" wrapperClassName="col-sm-10" onDragOver={this.onDragOver} onDrop={this.onDrop} valueLink={this.linkState('sshKey')} bsStyle={bsStyle.sshKey}/> : null}
                {this.state.sshAuthType === 'keyPath' ? <Input type="text" label="SSH Key Path" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('sshKeyPath')} bsStyle={bsStyle.sshKeyPath}/> : null}
                {this.state.sshAuthType === 'key' || this.state.sshAuthType === 'keyPath' ? <Input type="text" label="SSH Key Password" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('sshKeyPassword')} bsStyle={bsStyle.sshKeyPassword}/> : null}
            </div>);
        } else if (this.state.type === 'repository') {
            form = <div>to be implemented</div>;
        }

        return (
            <form className="form-horizontal" onSubmit={this.submit}>
                {error}

                <Input type="text" label="Name" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>
                <Input type="textarea" label="Description" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('description')} bsStyle={bsStyle.description}/>

                <Input type="select" label="Credential Type" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('type')} bsStyle={bsStyle.type}>
                    <option value="">Choose</option>
                    <option value="repository">Repository</option>
                    <option value="machine">Machine</option>
                </Input>

                {form}

                <Input type="submit" value="Save" wrapperClassName="col-sm-offset-2 col-sm-10"/>
            </form>
        );
    }
});

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    save() {
        this.context.router.transitionTo('credential_list');
    },
    render() {
        var params = this.context.router.getCurrentParams();

        return (
            <div className="page-main">
                <PageHeader>{params.id ? 'Edit credential' : 'Create credential'}
                    <small></small>
                </PageHeader>

                <CredentialForm id={params.id} onSave={this.save}/>
            </div>
        );
    }
});
