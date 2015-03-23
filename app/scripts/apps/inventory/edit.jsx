var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Button, Input, PageHeader, ListGroupItem, ListGroup, Panel, PanelGroup } = require('react-bootstrap'),
    _ = require('lodash');
var Icon = require('react-fa/dist/Icon');

var Reflux = require('reflux');
var Actions = require('../../actions/inventoryActions');
var Stores = require('../../stores/inventoryStores');

var InventoryGroup = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {group: this.props.group, _name: ''}
    },
    componentWillReceiveProps: function(newProps) {
        this.setState({group: newProps.group});
    },
    addHost() {
        var name = this.state._name.trim();
        var group = this.state.group;
        group.hosts = group.hosts || [];

        if (name && !_.contains(group.hosts, name)) {
            group.hosts.push(name);
            this.onChanged(group);
        }
    },
    removeHost(host) {
        var group = this.state.group;
        group.hosts = _.without(group.hosts, host);
        this.onChanged(group);
    },
    onChanged(group) {
        this.setState({group: group, _name: ''});
        this.props.onChange(group);
    },
    renderHost(host, i) {
        return <ListGroupItem key={host + i}>{host}
            <Button onClick={this.removeHost.bind(null, host)} bsSize="xsmall" className="pull-right">
                <Icon name="remove"/>
            </Button>
        </ListGroupItem>
    },
    remove() {
        this.props.onRemove(this.state);
    },
    render() {
        return <div>
            <h5>Hosts</h5>

            <ListGroup>
                {_.map(this.state.group.hosts, this.renderHost)}
            </ListGroup>

            <Input type="text" wrapperClassName="col-sm-12" placeholder="Hostname" valueLink={this.linkState('_name')} buttonAfter={<Button onClick={this.addHost}>Add host</Button>}/>
        </div>;
    }
});

var InventoryGroups = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {groups: this.props.groups, _name: ''}
    },
    componentWillReceiveProps: function(newProps) {
        this.setState({groups: newProps.groups});
    },
    onGroupChanged(i, group) {
        var groups = this.state.groups;
        groups[i] = group;
        this.onChanged(groups);
    },
    onChanged(groups) {
        this.setState({groups: groups, _name: ''});
        this.props.onChange(groups);
    },
    removeGroup(group, e) {
        e.preventDefault();
        e.stopPropagation();
        var groups = _.without(this.state.groups, group);
        this.onChanged(groups);
    },
    renderGroup(group, i) {
        var header = <span>{group.name}
            <Button onClick={this.removeGroup.bind(null, group)} bsSize="xsmall" className="pull-right">
                <Icon name="remove"/>
            </Button>
        </span>;

        return <Panel header={header} eventKey={i}>
            <InventoryGroup group={group} key={group.name + i} onChange={this.onGroupChanged.bind(null, i)} onRemove={this.removeGroup.bind(null, group)} onSelect={this.changeActiveGroup.bind(null, i)}/>
        </Panel>;
    },
    addGroup() {
        var name = this.state._name.trim();
        var groups = this.state.groups || [];

        if (name && !_.find(groups, {name: name})) {
            groups.push({
                name: name,
                hosts: [],
                vars: {
                    test: 'abc'
                },
                children: []
            });

            this.setState({groups: groups, _name: ''});
        }
    },
    changeActiveGroup(key) {
        this.refs.panelGroup.setProps({
            activeKey: key
        });
    },
    render() {
        return <div className="col-sm-10">
            <PanelGroup defaultActiveKey={0} ref="panelGroup" accordion>
                {_.map(this.state.groups, this.renderGroup)}
            </PanelGroup>

            <Input type="text" wrapperClassName="col-sm-12" placeholder="Groupname" valueLink={this.linkState('_name')} buttonAfter={<Button onClick={this.addGroup}>Add group</Button>}/>
        </div>;
    }
});


var InventoryForm = React.createClass({
    mixins: [Router.State, Reflux.connect(Stores.Get), React.addons.LinkedStateMixin],
    componentDidMount() {
        var params = this.getParams();

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
        var params = this.getParams();

        if (params.id) {
            Actions.update.triggerPromise(this.state).then(this.completed, this.failed);
        } else {
            Actions.create.triggerPromise(this.state).then(this.completed, this.failed);
        }
    },
    onChangeGroups(newGroups) {
        this.setState({groups: newGroups});
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

        return (
            <form className="form-horizontal" onSubmit={this.submit}>
                {error}

                <Input type="text" label="Name" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>

                <div className="row">
                    <label className="control-label col-sm-2">
                        Groups
                    </label>
                    <InventoryGroups groups={this.state.groups} onChange={this.onChangeGroups} />
                </div>

                <Input type="submit" value="Save" wrapperClassName="col-sm-offset-2 col-sm-10"/>
            </form>
        );
    }
});

module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State],
    componentDidMount() {
    },
    save() {
        this.transitionTo('inventory_list');
    },
    render() {
        var params = this.getParams();

        return (
            <div className="page-main">
                <PageHeader>{params.id ? 'Edit inventory' : 'Create inventory'}
                    <small></small>
                </PageHeader>

                <InventoryForm id={params.id} onSave={this.save}/>
            </div>
        );
    }
});
