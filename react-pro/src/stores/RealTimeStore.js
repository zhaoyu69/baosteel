import {observable, action, computed, toJS} from "mobx";
import _ from 'lodash';

export default class RealTimeStore{
    @observable sensorData = {}; // { "1": [], "2": [], "3": []}
    @observable loading = true;

    @action setLoading=(loading)=>{
        this.loading = loading;
    };

    // 连接到mqtt
    @action connectMQTT = () => {
        const that = this;
        const Paho = window["Paho"];
        const client = new Paho.MQTT.Client("test.mosquitto.org", Number(8080), "zy" + new Date().getTime());
        console.log(client);

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        client.connect({
            onSuccess:onConnect,
            keepAliveInterval:30,
            // reconnect:true
        });

        client.disconnect({
            reconnect:true
        });

        function onConnect() {
            console.log("onConnect");
            client.subscribe("/gova/baosteel/mjs/01",{qos:1});
        }

        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }

        function onMessageArrived(message) {
            // console.log("onMessageArrived:"+message.payloadString);
            const json = JSON.parse(message.payloadString);
            let sensorData = toJS(that.sensorData);
            if(that.loading){
                that.setLoading(false);
            }
            if(sensorData[json.sid]){
                // 已经有此id
                sensorData[json.sid].push(json);
                // 保留10个
                if(sensorData[json.sid].length > 10) {
                    sensorData[json.sid].shift();
                }
            }else{
                // 新的id
                let arr=[];
                arr.push(json);
                sensorData[json.sid]=arr;
            }
            that.sensorData=sensorData;
        }
    };

    // 显示的表内容:每个ID的最新数据
    @computed get now_sensorData(){
        let data = [];
        _.forEach(toJS(this.sensorData), (sensorDataBySid, key)=>{
            data.push(sensorDataBySid[sensorDataBySid.length-1])
        });
        return data;
    }

    // 横坐标数组
    @action getXAxis(sid){
        let sensorDataBySid=this.sensorData[sid];
        return _.range(1, sensorDataBySid.length+1);
    }

    // 温度
    @action getTSeries(sid){
        let sensorDataBySid=this.sensorData[sid];
        return sensorDataBySid.map(data=>data.temp);
    }

    // 速度
    @action getVXSeries(sid){
        let sensorDataBySid=this.sensorData[sid];
        return sensorDataBySid.map(data=>data.vx);
    }
    @action getVYSeries(sid){
        let sensorDataBySid=this.sensorData[sid];
        return sensorDataBySid.map(data=>data.vy);
    }
    @action getVZSeries(sid){
        let sensorDataBySid=this.sensorData[sid];
        return sensorDataBySid.map(data=>data.vz);
    }

    // 加速度
    @action getAXSeries(sid){
        let sensorDataBySid=this.sensorData[sid];
        return sensorDataBySid.map(data=>data.ax);
    }
    @action getAYSeries(sid){
        let sensorDataBySid=this.sensorData[sid];
        return sensorDataBySid.map(data=>data.ay);
    }
    @action getAZSeries(sid){
        let sensorDataBySid=this.sensorData[sid];
        return sensorDataBySid.map(data=>data.az);
    }
}

export const realTimeStore = new RealTimeStore();