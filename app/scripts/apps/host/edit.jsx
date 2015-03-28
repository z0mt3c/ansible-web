var React = require('react/addons'),

    { Alert, Input, PageHeader } = require('react-bootstrap'),
    _ = require('lodash');

var Reflux = require('reflux');
var Actions = require('../../actions/hostActions');
var Stores = require('../../stores/hostStores');
var VarEditor = require('../../components/var-editor');

var HostForm = React.createClass({
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

        var facts = JSON.stringify(this.state.facts || {}, null, '  ');
        return (
            <form className="form-horizontal" onSubmit={this.submit}>
                {error}

                <Input type="text" label="Name" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>

                <VarEditor label="Variables" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('vars')}/>

                <Input type="submit" value="Save" wrapperClassName="col-sm-offset-2 col-sm-10"/>

                <pre>{facts}</pre>
            </form>
        );
    }
});

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},
    componentDidMount() {
    },
    save() {
        this.context.router.transitionTo('host_list');
    },
    render() {
        var params = this.context.router.getCurrentParams();

        return (
            <div className="page-main">
                <PageHeader>{params.id ? 'Edit host' : 'Create host'}
                    <small></small>
                </PageHeader>

                <HostForm id={params.id} onSave={this.save}/>
            </div>
        );
    }
});
