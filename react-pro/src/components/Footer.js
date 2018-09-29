import React from "react";
import {observer} from "mobx-react";
import './Footer.css';
import {Link} from 'react-router-dom';

@observer
export default class Footer extends React.Component {

    render() {
        return (
            <footer>
                <div><Link to="/">实时</Link></div>
                <div><Link to="/history">历史</Link></div>
                <div><Link to="/params">参数</Link></div>
            </footer>
        )
    }
}