import React, {Component} from 'react';
import {Header, Button} from 'semantic-ui-react';
import Modal from 'react-model';

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

export default class CreateSessionModal extends Component{
    constructor(props){
        super(props);
        this.state = {
          modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
        this.inputRef = React.createRef();
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        //this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        return (
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2>What is the name of your session?</h2>
            <input ref={this.inputRef} type="text" autofocus="autofocus" />
            <Button onclick={closeModal}>Create</Button>
          </Modal>
          );
    }

    getInputtedText(){
      return this.inputRef.current.value;
    }
}
