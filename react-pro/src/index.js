import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    Router,
    Route,
    Switch,
} from 'react-router-dom';
import { createHashHistory } from 'history';
import RealTime from "./components/RealTime";
import Params from "./components/Params";
import History from './components/History';
import Footer from './components/Footer';
const history = createHashHistory();

ReactDOM.render(
    <Router history={history}>
        <div style={{paddingBottom:40}}>
            <Footer/>
            <Switch>
                <Route exact path="/" component={RealTime} />
                <Route path="/history" component={History} />
                <Route path="/params" component={Params} />
            </Switch>
        </div>
    </Router>,
    document.getElementById('root'));
