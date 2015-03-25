var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Button, Input, PageHeader, ListGroupItem, ListGroup, Panel, PanelGroup } = require('react-bootstrap'),
    _ = require('lodash');
var Icon = require('../../components/icon');

var Reflux = require('reflux');
var Actions = require('../../actions/inventoryActions');
var Stores = require('../../stores/inventoryStores');
var VarEditor = require('../../components/var-editor');

var InventoryGroup = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {group: this.props.group, availableGroups: [], _groupName: '', _hostName: ''};
    },
    componentWillReceiveProps: function(newProps) {
        this.setState({group: newProps.group, availableGroups: newProps.availableGroups});
    },
    removeHost(host) {
        var group = this.state.group;
        group.hosts = _.without(group.hosts, host);
        this.onChanged(group);
    },
    removeChild(child) {
        var group = this.state.group;
        group.children = _.without(group.children, child);
        this.onChanged(group);
    },
    addHost() {
        var name = this.state._hostName.trim();
        var group = this.state.group;
        group.hosts = group.hosts || [];

        if (name && !_.contains(group.hosts, name)) {
            group.hosts.push(name);
            this.onChanged(group);
        }
    },
    addGroup() {
        var name = this.state._groupName.trim();
        var group = this.state.group;
        group.children = group.children || [];

        if (name && !_.contains(group.children, name)) {
            group.children.push(name);
            this.onChanged(group);
        }
    },
    onChanged(group) {
        this.setState({group: group, _groupName: '', _hostName: ''});
        this.props.onChange(group);
    },
    renderHost(host, i) {
        return <ListGroupItem key={host + i}>{host}
            <Button onClick={this.removeHost.bind(null, host)} bsSize="xsmall" className="pull-right">
                <Icon name="remove"/>
            </Button>
        </ListGroupItem>;
    },
    renderChildren(group, i) {
        return <ListGroupItem key={group + i}>{group}
            <Button onClick={this.removeChild.bind(null, group)} bsSize="xsmall" className="pull-right">
                <Icon name="remove"/>
            </Button>
        </ListGroupItem>;
    },
    changeAttribute(key, data) {
        var group = this.state.group;
        group[key] = data;
        this.setState({group: group});
    },
    remove() {
        this.props.onRemove(this.state);
    },
    render() {
        var groups = _.without(this.props.availableGroups, this.state.group.children, this.state.group.name);
        var hostCount = this.state.group.hosts ? this.state.group.hosts.length : null;
        var groupCount = this.state.group.children ? this.state.group.children.length : null;

        return <div className="row">
            <div className="col-md-12">
                <h5>Group variables</h5>
                <VarEditor wrapperClassName="col-sm-12" value={this.state.group.vars} onChange={this.changeAttribute.bind(null, 'vars')}/>
            </div>
            <div className="col-md-6">
                <h5>Hosts{' '}
                    <span className="badge">{hostCount}</span>
                </h5>

                <ListGroup>
                {_.map(this.state.group.hosts, this.renderHost)}
                </ListGroup>

                <Input type="text" wrapperClassName="col-sm-12" placeholder="Hostname" valueLink={this.linkState('_hostName')} buttonAfter={<Button bsStyle="primary" onClick={this.addHost}>ADD</Button>}/>
            </div>
            <div className="col-md-6">

                <h5>Child groups{' '}
                    <span className="badge">{groupCount}</span>
                </h5>

                <ListGroup>
                {_.map(this.state.group.children, this.renderChildren)}
                </ListGroup>

                <Input type="select" wrapperClassName="col-sm-12" placeholder="Groupname" valueLink={this.linkState('_groupName')} buttonAfter={<Button bsStyle="primary" onClick={this.addGroup}>ADD</Button>}>
                    <option value="">Select child group</option>
                {_.map(groups, function(group) {
                    return <option value={group} key={group}>{group}</option>;
                })}
                </Input>
            </div>
        </div>;
    }
});

var InventoryGroups = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {groups: this.props.groups, _name: ''};
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
        var availableGroups = _.pluck(this.state.groups, 'name');
        var header = <span>{group.name + ' '}
            <span className="badge">{group.hosts.length}</span>
            <Button onClick={this.removeGroup.bind(null, group)} bsSize="xsmall" className="pull-right">
                <Icon name="remove"/>
            </Button>
        </span>;

        return <Panel header={header} eventKey={i} key={group.name + i}>
            <InventoryGroup
                group={group}
                availableGroups={availableGroups}
                onChange={this.onGroupChanged.bind(null, i)}
                onRemove={this.removeGroup.bind(null, group)}
                onSelect={this.changeActiveGroup.bind(null, i)}/>
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
            <PanelGroup ref="panelGroup" accordion>
                {_.map(this.state.groups, this.renderGroup)}
            </PanelGroup>

            <Input type="text" wrapperClassName="col-sm-12" placeholder="Groupname" valueLink={this.linkState('_name')} buttonAfter={<Button bsStyle="primary" onClick={this.addGroup}>ADD</Button>}/>
        </div>;
    }
});


var InventoryForm = React.createClass({
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

                <Input type="textarea" label="Description" labelClassName="col-sm-2" wrapperClassName="col-sm-10"
                    valueLink={this.linkState('description')} bsStyle={bsStyle.description}/>

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
    contextTypes: {router: React.PropTypes.func},
    componentDidMount() {
    },
    save() {
        this.context.router.transitionTo('inventory_list');
    },
    render() {
        var params = this.context.router.getCurrentParams();

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
