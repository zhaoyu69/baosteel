import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import { createHashHistory } from 'history';
import RealTime from "./components/RealTime";
import Params from "./components/Params";
import History from './components/History';
const history = createHashHistory();

ReactDOM.render(
    <Router history={history}>
        <div style={{paddingBottom:40}}>
            <footer>
                <div><Link to="/">实时</Link></div>
                <div><Link to="/history">历史</Link></div>
                <div><Link to="/params">参数</Link></div>
            </footer>
            <Switch>
                <Route exact path="/" component={RealTime} />
                <Route path="/history" component={History} />
                <Route path="/params" component={Params} />
            </Switch>
        </div>
    </Router>,
    document.getElementById('root'));
