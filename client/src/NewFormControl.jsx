import React from 'react';
import NewName from './Form';
import PropTypes from 'prop-types';

class NewNameControl extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            formVisibleOnPage: false
        };
        this.handleTroubleshootingConfirmation = this.handleTroubleshootingConfirmation.bind(this);
    }
    handleTroubleshootingConfirmation(){
        this.setState({ formVisibleOnPage: true});
    }
    render() {
        let currentlyVisibleContent = null;
        if(this.state.formVisibleOnPage){
            currentlyVisibleContent = <NewName onNewName={this.props.onNewName}/>;
        } else {
            currentlyVisibleContent = <NewName onNewName={this.props.onNewName}/>;
        }
        return(
            <div>
                { currentlyVisibleContent }
            </div>
        );
    }

}
NewNameControl.propTypes = {
    onNewName: PropTypes.func
}

export default NewNameControl;
