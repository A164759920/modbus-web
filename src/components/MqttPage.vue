<template>
    <div class="container">
        <div v-drag class="remote">
            <div class="remote-header">远程控制器</div>
            <div class="remote-row">
                <div class="row-text">加热</div>
                <div class="row-check">
                    <div class="check-name"></div>
                    <input type="checkbox" class="check-box" @change="checkClick('hotState')" v-model="temp_hotState">
                </div>
            </div>
            <div class="remote-row">
                <div class="row-text">冷却</div>
                <div class="row-check">
                    <div class="check-name"></div>
                    <input type="checkbox" class="check-box" @change="checkClick('coldState')" v-model="temp_coldState">
                </div>
            </div>
            <div class="remote-row">
                <div class="row-text">加酸</div>
                <div class="row-check">
                    <div class="check-name"></div>
                    <input type="checkbox" class="check-box" @change="checkClick('acidState')" v-model="temp_acidState">
                </div>
            </div>
            <div class="remote-row">
                <div class="row-text">加碱</div>
                <div class="row-check">
                    <div class="check-name"></div>
                    <input type="checkbox" class="check-box" @change="checkClick('baseState')" v-model="temp_baseState">
                </div>
            </div>
            <div class="remote-row">
                <div class="row-text">搅拌</div>
                <div class="row-check">
                    <div class="check-name"></div>
                    <input type="checkbox" class="check-box" @change="checkClick('whiskState')" v-model="temp_whiskState">
                </div>
            </div>
        </div>
        <div class="body">
            <div class="pre-header">
                <div class="connect-status" :class="setConnectStatus"></div>
                发酵罐远程监控软件
            </div>
            <div class="header">
                <div class="header-text">当前发酵罐</div>
                <input type="text" class="header-input" v-model="client.deviceName">
                <div class="connect-button" @click="getDeviceByName">连接</div>
            </div>
            <div class="control-body">
                <div class="row">
                    <div class="row-content">
                        <div class="content-name">当前温度</div>
                        <div class="content-data">{{ temperature }}</div>
                    </div>
                    <div class="row-content">
                        <div class="content-name">当前PH值</div>
                        <div class="content-data">{{ pH }}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="row-content">
                        <div class="content-name">当前溶氧</div>
                        <div class="content-data">{{ oxygen }}</div>
                    </div>
                    <div class="row-content">
                        <div class="content-name">当前泡沫</div>
                        <div class="content-data">{{ foam }}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="row-content">
                        <div class="content-name">控制方式</div>
                        <div class="content-data">{{ setControlState }}</div>
                    </div>
                    <div class="row-content">
                        <div class="content-name">系统状态</div>
                        <div class="content-data">{{ setDeviceState }}</div>
                    </div>
                </div>
                <div class="staterow">
                    <div class="staterow-content">
                        <div class="content-name">加热</div>
                        <div class="content-data">{{ setStateText(this.hotState) }}</div>
                    </div>
                    <div class="staterow-content">
                        <div class="content-name">冷却</div>
                        <div class="content-data">{{ setStateText(this.coldState) }}</div>
                    </div>
                </div>
                <div class="staterow">
                    <div class="staterow-content">
                        <div class="content-name">加酸</div>
                        <div class="content-data">{{ setStateText(this.acidState) }}</div>
                    </div>
                    <div class="staterow-content">
                        <div class="content-name">加碱</div>
                        <div class="content-data">{{ setStateText(this.baseState) }}</div>
                    </div>
                </div>
                <div class="staterow">
                    <div class="staterow-content">
                        <div class="content-name">搅拌</div>
                        <div class="content-data">{{ setStateText(this.whiskState) }}</div>
                    </div>

                </div>
                <div class="footer">
                    <div class="button" @click="updateControlState('0')">本地控制</div>
                    <div class="button" @click="updateControlState('1')">远程控制</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios"
export default {
    name: "MqttPage",
    data: function () {
        return {
            dataTimer: null,
            temperature: "",
            oxygen: "",
            pH: "",
            foam: "",
            controlState: "",
            hotState: "",
            temp_hotState: "",
            coldState: "",
            temp_coldState: "",
            acidState: "",
            temp_acidState: "",
            baseState: "",
            temp_baseState: "",
            whiskState: "",
            temp_whiskState: "",
            DOMAIN: "http://127.0.0.1:8888",
            client: {
                // onLine: false,
                // pid: "583419",
                // deviceID: "1059893029",
                // deviceName: "mqtt-can1",
                onLine: false,
                pid: "",
                deviceID: "",
                deviceName: "mqtt-can1",
            },
        }
    },
    computed: {
        setControlState: function () {
            return this.controlState === "1" ? "远程控制" : "本地控制"
        },
        setDeviceState: function () {
            return this.client.onLine ? "开机" : "关机"
        },
        setConnectStatus: function () {
            return this.client.onLine ? `connected` : ``
        }

    },
    methods: {
        /**
         * @description 远程控制器选择框事件
         * @param {String} stateName 
         */
        checkClick: function (stateName) {
            // 远程控制是才可使用
            if (this.client.onLine && this.controlState === "1") {
                switch (stateName) {
                    case "hotState":
                        if (event.target.checked) {
                            this.updateImageState({ "hotState": "1" })
                        } else {
                            this.updateImageState({ "hotState": "0" })
                        }

                        break;
                    case "coldState":
                        if (event.target.checked) {
                            this.updateImageState({ "coldState": "1" })
                        } else {
                            this.updateImageState({ "coldState": "0" })
                        }

                        break;
                    case "acidState":
                        if (event.target.checked) {
                            this.updateImageState({ "acidState": "1" })
                        } else {
                            this.updateImageState({ "acidState": "0" })
                        }

                        break;
                    case "baseState":
                        if (event.target.checked) {
                            this.updateImageState({ "baseState": "1" })
                        } else {
                            this.updateImageState({ "baseState": "0" })
                        }

                        break;
                    case "whiskState":
                        if (event.target.checked) {
                            this.updateImageState({ "whiskState": "1" })
                        } else {
                            this.updateImageState({ "whiskState": "0" })
                        }

                        break;
                }
            } else {
                console.log("本地控制模式")
            }
        },

        setStateText: function (stateName) {
            return stateName === "1" ? "ON" : "OFF"
        },
        /**
         * @description 更新控制状态
         * @param {String} stateCode 
         */
        updateControlState: async function (stateCode) {
            try {
                const res = await axios.post(`${this.DOMAIN}/mqtt/updateImageState`, {
                    deviceID: this.client.deviceID,
                    newStates: {
                        "controlState": stateCode,
                    }
                })
                if (res.data.code === 0) {
                    this.controlState = stateCode
                } else {
                    console.log("切换控制状态失败-1", res.data.data)
                }
            } catch (error) {
                console.log("切换控制状态失败-2", error)
            }
        },
        updateImageState: async function (stateObj) {
            try {
                const res = await axios.post(`${this.DOMAIN}/mqtt/updateImageState`, {
                    deviceID: this.client.deviceID,
                    newStates: stateObj
                })
                if (res.data.code === 0) {
                    console.log("更新镜像状态成功", res.data.data)
                } else {
                    console.log("更新镜像状态失败-1", res.data.data)
                }
            } catch (error) {
                console.log("更新镜像状态失败-2", error)
            }
        },
        /**
         * @description 获取镜像state的reported字段
         */
        getImageStateByID: async function () {
            try {
                const res = await axios.get(`${this.DOMAIN}/mqtt/getImageState`, {
                    params: {
                        deviceID: this.client.deviceID
                    }
                })
                console.log(res.data)
                if (res.data.code === 0) {
                    const { baseState, hotState, whiskState, acidState, coldState, controlState } = res.data.data
                    this.baseState = baseState;
                    this.hotState = hotState;
                    this.whiskState = whiskState;
                    this.acidState = acidState;
                    this.coldState = coldState;
                    this.controlState = controlState
                    if (this.controlState === "1") {
                        this.temp_hotState = hotState === "1" ? true : false
                        this.temp_coldState = coldState === "1" ? true : false
                        this.temp_acidState = acidState === "1" ? true : false
                        this.temp_baseState = baseState === "1" ? true : false
                        this.temp_whiskState = whiskState === "1" ? true : false
                    }
                } else {
                    console.log("获取imageState失败-1", res.data.data)
                }
            } catch (error) {
                console.log("获取imageState失败-1", error)
            }
        },
        /**
         * @description 获取传感器数据流
         */
        getDataStreamByID: async function () {
            try {
                const res = await axios.get(`${this.DOMAIN}/mqtt/getDataStream`,
                    {
                        params: {
                            deviceID: this.client.deviceID
                        }
                    }
                )
                if (res.data.code === 0) {
                    const { foam, temperature, pH, oxygen } = res.data.data
                    this.foam = foam;
                    this.temperature = temperature;
                    this.pH = pH;
                    this.oxygen = oxygen;
                } else {
                    console.log("获取数据流失败-1", res.data.data)
                }
            } catch (error) {
                console.log("获取数据流失败-1", error)
            }
        },
        /**
         * @description 获取设备基本信息
         */
        getDeviceByName: async function () {
            if (this.client.onLine) {
                this.client.deviceID = "";
                // this.client.deviceName = "";
                this.client.pid = "";
                this.client.onLine = false
                this.temperature = "";
                this.oxygen = "";
                this.pH = "";
                this.foam = "";
                this.controlState = "";
                this.hotState = "";
                this.coldState = "";
                this.acidState = "";
                this.baseState = "";
                this.whiskState = "";
                // 清除获取数据定时器
                if (this.dataTimer != null) {
                    clearInterval(this.dataTimer)
                }
            } else {
                try {
                    const res = await axios.get(`${this.DOMAIN}/mqtt/getDevice`,
                        {
                            params: {
                                deviceName: this.client.deviceName
                            }
                        }
                    )
                    if (res.data.code === 0) {
                        const { device_id, name, pid } = res.data.data
                        this.client.deviceID = device_id;
                        this.client.deviceName = name;
                        this.client.pid = pid
                        this.client.onLine = true
                        // 注册获取数据的定时器
                        this.dataTimer = setInterval(() => {
                            this.getDataStreamByID(this.client.id) // 数据流
                            this.getImageStateByID(this.client.id)    // 镜像
                            console.log("定时器执行了")
                        }, 2000);
                    } else {
                        console.log("查询设备失败-1", res.data.data)
                        window.alert("获取设备失败,请检查设备名")
                    }
                } catch (error) {
                    console.log("查询设备失败-2", error)
                    window.alert("获取设备失败,请检查设备名")
                }
            }

        }
    },

    mounted: function () {

    }

}
</script>

<style scoped lang="scss">
.container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: whitesmoke;
    display: flex;
    justify-content: center;

    .remote {
        z-index: 3;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: -moz-none;
        cursor: pointer;
        left: 10px;
        position: absolute;
        width: 150px;
        height: 250px;
        background-color: white;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
            rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
        border-radius: 10px;
        border-left: 2px solid black;
        border-right: 2px solid black;
        border-bottom: 2px solid black;

        .remote-header {
            border-radius: 10px;
            border: rgb(17, 137, 114) solid 3px;
            background-color: rgb(231, 244, 240);
            height: 30px;
            line-height: 30px;
            text-align: center;
        }

        .remote-row {
            display: flex;
            width: 100%;
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;


            .row-text {
                padding-left: 15px;
                margin-right: 20px;
            }

        }
    }

    .body {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        width: 450px;
        height: 600px;
        border: 1px solid black;
    }

    .pre-header {
        position: relative;
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-weight: 530;
        border-bottom: 1px solid black;

        .connect-status {
            position: absolute;
            top: 20px;
            left: 10px;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background-color: red;
            box-shadow: -1px -1px 4px rgba(255, 255, 255, 0.05),
                4px 4px 6px rgba(0, 0, 0, 0.2),
                inset -1px -1px 4px rgba(255, 255, 255, 0.05),
                inset 1px 1px 1px rgba(0, 0, 0, 0.1);
        }

        .connected {
            background-color: green;
        }
    }

    .header {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
        margin-bottom: 10px;

        .connect-button {
            position: absolute;
            top: 0px;
            right: 15px;
            width: 60px;
            height: 40px;
            line-height: 40px;
            border-radius: 15px;
            border: rgb(17, 137, 114) solid 3px;
            background-color: rgb(231, 244, 240);
            text-align: center;
        }

        .connect-button:hover {
            cursor: pointer;
        }

        .header-text {
            margin-left: 15px;
        }

        .header-input {
            margin-left: 5px;
            border-radius: 5px;
            height: 30px;
            font-size: 15px;
            width: 130px;
        }
    }

    .control-body {
        padding: 10px;
        width: 400px;
        height: 400px;
        background-color: rgb(231, 244, 240);
        border-radius: 10px;
        border: rgb(17, 137, 114) solid 3px;

        .row {
            display: flex;
            width: 100%;
            height: 50px;
            margin-bottom: 3px;
            font-weight: 500;
            font-family: Arial, Helvetica, sans-serif;

            .row-content {
                display: flex;
                align-items: center;
                height: 100%;
                flex-grow: 1;

                .content-name {
                    margin-left: 5px;
                }

                .content-data {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    margin-left: 10px;
                    height: 85%;
                    width: 110px;
                    background-color: white;
                    border-radius: 10px;
                    border: 2px solid black;
                }
            }
        }

        .staterow {
            display: flex;
            width: 100%;
            height: 50px;
            margin-bottom: 3px;
            font-weight: 500;
            font-family: Arial, Helvetica, sans-serif;

            .staterow-content {
                display: flex;
                align-items: center;
                flex-grow: 1;
                height: 100%;
                margin-left: 10px;

                .content-name {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 95%;
                    width: 65px;
                    color: white;
                    background-color: rgb(211, 115, 53);
                    border-radius: 10px;
                }

                .content-data {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    margin-left: 10px;
                    height: 85%;
                    width: 80px;
                    background-color: white;
                    border-radius: 10px;
                    border: 2px solid black;
                }

            }
        }

        .footer {
            margin-top: 25px;
            height: 50px;
            width: 100%;
            display: flex;
            justify-content: space-around;

            .button {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 95%;
                border-radius: 10PX;
                border: 2px solid rgb(22, 165, 138);
                background-color: rgb(17, 137, 114);
                color: white;
                width: 180px;
            }

            .button:hover {
                cursor: pointer;
            }
        }
    }
}
</style>