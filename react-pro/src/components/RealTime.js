import React from "react";
import {observer} from "mobx-react";
import "./RealTime.css";
import {Spin} from 'antd';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {realTimeStore} from '../stores/RealTimeStore';
import {toJS} from "mobx";
const store = realTimeStore;

@observer
export default class RealTime extends React.Component {
    constructor(props, context) {
        super(props, context);
        store.connectMQTT();
    }

    render() {
        const now_sensorData = toJS(store.now_sensorData);
        const {loading} = store;
        // 格式
        // {
        //     "sid": 2,
        //     "bat": 0.98828125,
        //     "temp": 24.7,
        //     "ax": 0.0,
        //     "ay": 0.0,
        //     "az": 0.086,
        //     "vx": 0.0,
        //     "vy": 0.111,
        //     "vz": 0.0,
        //     "stime": "2018-09-26T22:56:11.097366+08:00"
        // }

        const sensor = now_sensorData.map((d, index) => {
            const {sid,bat,temp,ax,ay,az,vx,vy,vz,stime} = d;
            return (
                <div key={index}>
                    <table cellSpacing="0" cellPadding="0" className="sensor_view">
                        <tbody>
                            <tr>
                                <td rowSpan="9" width="20%">
                                    <div>
                                        <div>时间:</div>
                                        <div>{moment(stime).format('HH:mm:ss')}</div>
                                    </div>
                                    <div style={{margin:"20px 0"}}>ID: {sid}</div>
                                    <div>
                                        <div>电量:</div>
                                        <div>{(Number(bat)*100).toFixed(2)}%</div>
                                    </div>
                                </td>
                                <td rowSpan="3" width="10%">
                                    <div>温度</div>
                                    <div>(℃)</div>
                                </td>
                                <td rowSpan="3" width="10%">{temp}</td>
                                {/*温度曲线*/}
                                <td rowSpan="3" width="60%">
                                    <ReactEcharts option={this.getTOpt(sid)} style={{height:"100px"}}/>
                                </td>
                            </tr>
                            <tr><td> </td></tr>
                            <tr><td> </td></tr>
                            <tr>
                                <td rowSpan="3" width="10%">
                                    <div>加速度</div>
                                    <div>(g)</div>
                                </td>
                                <td width="10%">{ax}</td>
                                {/*加速度曲线*/}
                                <td rowSpan="3" width="60%">
                                    <ReactEcharts option={this.getAOpt(sid)} style={{height:"100px"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td width="10%">{ay}</td>
                            </tr>
                            <tr>
                                <td width="10%">{az}</td>
                            </tr>
                            <tr>
                                <td rowSpan="3" width="10%">
                                    <div>速度</div>
                                    <div>(mm/s)</div>
                                </td>
                                <td width="10%">{vx}</td>
                                {/*速度曲线*/}
                                <td rowSpan="3" width="60%">
                                    <ReactEcharts option={this.getVOpt(sid)} style={{height:"100px"}}/>
                                </td>
                            </tr>
                            <tr>
                                <td width="10%">{vy}</td>
                            </tr>
                            <tr>
                                <td width="10%">{vz}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        });
        return (
            <div>
                <Spin spinning={loading}
                      className="realtime_loading"
                      size="large"/>
                {!now_sensorData.length?<div>暂无数据上传，接收中...</div>:sensor}
            </div>
        )
    }

    getTOpt=(sid)=>{
        const xAxis = store.getXAxis(sid);
        const series = store.getTSeries(sid);
        return {
            tooltip:{
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            xAxis:{
                type: 'category',
                boundaryGap: false,
                data:xAxis,
                axisLabel:{
                    fontSize:8
                }
            },
            yAxis: {
                // name: "温度[℃]",
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                },
                axisLabel:{
                    fontSize:8
                }
            },
            series:{
                name: "温度",
                type:'line',
                data: series
            },
            grid: {
                x: 30,
                x2: 10,
                y: 10,
                y2: 20
            }
        };
    };

    getVOpt=(sid)=>{
        const xAxis = store.getXAxis(sid);
        const vxSeries = store.getVXSeries(sid);
        const vySeries = store.getVYSeries(sid);
        const vzSeries = store.getVZSeries(sid);
        return {
            tooltip:{
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            xAxis:{
                type: 'category',
                boundaryGap: false,
                data:xAxis,
                axisLabel:{
                    fontSize:8
                }
            },
            yAxis: {
                // name: "速度[mm/s]",
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                },
                axisLabel:{
                    fontSize:8
                }
            },
            series:[{
                name: "x轴",
                type:'line',
                data: vxSeries
            },{
                name: "y轴",
                type:'line',
                data: vySeries
            },{
                name: "z轴",
                type:'line',
                data: vzSeries
            }],
            grid: {
                x: 30,
                x2: 10,
                y: 10,
                y2: 20
            }
        };
    };

    getAOpt=(sid)=>{
        const xAxis = store.getXAxis(sid);
        const axSeries = store.getAXSeries(sid);
        const aySeries = store.getAYSeries(sid);
        const azSeries = store.getAZSeries(sid);
        return {
            tooltip:{
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            xAxis:{
                type: 'category',
                boundaryGap: false,
                data:xAxis,
                axisLabel:{
                    fontSize:8
                }
            },
            yAxis: {
                // name: "加速度[g]",
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                },
                axisLabel:{
                    fontSize:8
                }
            },
            series:[{
                name: "x轴",
                type:'line',
                data: axSeries
            },{
                name: "y轴",
                type:'line',
                data: aySeries
            },{
                name: "z轴",
                type:'line',
                data: azSeries
            }],
            grid: {
                x: 30,
                x2: 10,
                y: 10,
                y2: 20
            }
        };
    }
}