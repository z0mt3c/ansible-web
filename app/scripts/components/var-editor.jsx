var React = require('react');
var yaml = require('js-yaml/dist/js-yaml.min');
var { Input } = require('react-bootstrap');

module.exports = React.createClass({
    getInitialState() {
        return {value: this.props.valueLink};
    },

    getValueLink: function(props) {
        return props.valueLink || {
                value: props.value,
                requestChange: props.onChange
            };
    },

    componentWillReceiveProps: function(nextProps) {
        var valueLink = this.getValueLink(nextProps);
        var value = valueLink.value ? yaml.dump(valueLink.value) : '';
        this.refs.input.getInputDOMNode().value = value;
    },

    updateValue() {
        this.componentWillReceiveProps(this.props);
    },

    componentDidMount() {
        this.updateValue();
    },

    onBlur() {
        var value = this.refs.input.getValue();

        try {
            var parsed = yaml.safeLoad(value);
            this.getValueLink(this.props).requestChange(parsed);
            this.setState({bsStyle: null, help: null});
        } catch (e) {
            this.setState({bsStyle: 'error', help: e.message});
        }
    },

    render: function() {
        var style = this.state.bsStyle || this.props.bsStyle;
        var help = this.state.help || this.props.help;

        return (
            <Input {...this.props}
                type="textarea"
                bsStyle={style}
                help={help}
                valueLink={null}
                value={null}
                onChange={null}
                onBlur={this.onBlur}
                ref="input"/>
        );
    }
});

