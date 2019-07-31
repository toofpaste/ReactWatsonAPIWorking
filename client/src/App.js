import React, {Component} from "react";
import "./App.css";
import Game from './Game';
import NewNameControl from './NewFormControl';
import Main  from './Main';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {url : ""};
        this.sendUrl = this.sendUrl.bind(this);
    }
    sendUrl(newUrl){
        this.setState({url: newUrl});
    }



    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path='/new' render={() => <NewNameControl onNewName={this.sendUrl}/>}/>
                        <Route exact path='/' render={() => <Main/>}/>
                        <Route path='/game' render={() => <Game completedUrl={this.state.url}/>}/>
                    </Switch>
                </div>
            </BrowserRouter>

        );
    }
}
export default App;
