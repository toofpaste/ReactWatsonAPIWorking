import React, {Component} from "react";
import { Link } from 'react-router-dom';


class Main extends Component {

    render() {
        return (

            <div className='homescreen'>
                <h1 className='homeTitle'>Connect 4 Personality</h1>
                <Link to="/new"><button className='button2'>Start</button></Link>
            </div>

        )
    }
}


export default Main;
