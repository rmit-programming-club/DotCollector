import React, {Component} from 'react';
import {Header, Button} from 'semantic-ui-react';
import Modal from 'react-modal';

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  }
};

export default class CreateSessionModal extends Component{
    constructor(props){
        super(props);
        this.state = {
          inputName: ''
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        //this.subtitle.style.color = '#f00';
    }

    closeModal() {
      this.props.onSubmit(this.state.inputName)
    }

    render() {
        return (
          <Modal
            isOpen={this.props.isOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Create Session Modal"
            ariaHideApp={false}
          >
            <h2>What is the name of your session?</h2>
            <input onChange={this.updateInputValue} type="text" autoFocus="autofocus" />
            <b />
            <Button onClick={this.closeModal}>Create</Button>
          </Modal>
          );
    }

    updateInputValue(evt){
      this.setState({
        inputName: evt.target.value
      });
    }
}
