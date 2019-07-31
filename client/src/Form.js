import React from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
function NewName(props) {
   let _name = null;

    function handleNewName(event){
        event.preventDefault();
        //this.setState( {name: _name.value});
        let url = "http://localhost:9000/testAPI?name=" + _name.value;
        //this.setState( {name: url});
        props.onNewName({newUrl: url});
        _name.value = "";
        url= "";
    }

        return (
            <div className="formMain">
                <form className="formForm" onSubmit={handleNewName}>
                    <input
                        type='text'
                        id='name'
                        placeholder='TWITER HANDLE'
                        ref={(input) => {_name = input;}}
                        value={_name}/>
                    <button className="button3" type='submit'>Save</button>
                    <Link to="/game"><button className="button3">Go</button></Link>
                </form>
            </div>
        )
}
NewName.propTypes = {
    onNewName: PropTypes.func
};
export default NewName;
