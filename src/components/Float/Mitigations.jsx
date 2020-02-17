import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class Mitigations extends Component {
    constructor() {
        super();

        this.childrenRefs = [];

    }

    state = {
        numberOfMitigations: 1,
        currentMitigation: null
    }

    componentDidMount () {
    	emitter.on(
    		'openMitigations',
    		function () {
    			this.openMitigations();
    		}.bind(this)
    	);

        $(this.outer.current).fadeToggle(0);
        $(this.outer.current).draggable();
    }

    openMitigations() {
        $(this.outer.current).fadeToggle(false);
    }

    closeMitigations() {
        $(this.outer.current).fadeToggle(false);
    }

    addNewMitigation() {
        this.setState({
            numberOfMitigations: this.state.numberOfMitigations + 1
        });

    }

    deselectMitigation() {
        if (this.state.currentMitigation){
            this.childrenRefs[this.state.currentMitigation].current.checked = false;
            this.state.currentMitigation = null;
            emitter.emit('changeCurrentMitigation', null);
        }
    }


    mitigationClicked(props) {
        if (!this.state.currentMitigation) {
            this.state.currentMitigation = props.number;

        } else {
            if (this.childrenRefs[props.number].current.value === "mit" + this.state.currentMitigation) {
                return;
            }

            this.childrenRefs[this.state.currentMitigation].current.checked = false;
            this.state.currentMitigation = props.number;
        }

        emitter.emit('changeCurrentMitigation', this.childrenRefs[this.state.currentMitigation].current.value);
    }

    render() {
        const children = [];

        for (var i = 1; i < this.state.numberOfMitigations + 1; i++){
            this.childrenRefs[i] = React.createRef();
            children.push(<MitigationComponent ref={this.childrenRefs[i]} key={i} number={i} mitigationClicked={this.mitigationClicked.bind(this)} />);
        }


        this.outer = React.createRef();
    	return (
            <MenuComponent ref={this.outer} addMitigation={this.addNewMitigation.bind(this)} closeMitigation={this.closeMitigations.bind(this)}  deselectMitigation={this.deselectMitigation.bind(this)} >
                {children}
            </MenuComponent>
    	);
    }
}

const MenuComponent = React.forwardRef((props, ref) => (
    <div ref={ref} className='mitigationsDiv panel panel-default'>
        <div className='panel-heading'> 
            Mitigations
            <button
                type='button'
                className='close'
                onClick={props.closeMitigation.bind(props)}
                aria-label='Close'
            >
                <span aria-hidden='true'>&times;</span>
            </button>
        </div> 
        <div className='panel-body sliderfix'>
            <form>
            {props.children}
            </form>
            <br />
            <button
                type='button'
                className='addMitigation'
                size="lg"
                onClick={props.addMitigation.bind(props)}
                aria-label='Add Mitigation'
                >
                Add mitigation
            </button>&nbsp; 
            <button
                type='button'
                className='deselectMitigation'
                size="lg"
                onClick={props.deselectMitigation.bind(props)}
                aria-label='Deselect Mitigation'
                >
                Deselect mitigation
            </button> 
        </div>
    </div>

));

const MitigationComponent = React.forwardRef((props, ref) => ( 
    <span><input ref={ref} type="radio" value={"mit" + props.number} onClick={() => props.mitigationClicked(props)} /> {"Mitigation " + props.number} <br /></span>
));