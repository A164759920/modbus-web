<template>
    <div class="container">
        <div class="body">
            <div class="header">
                <div class="header-text">当前发酵罐</div>
                <input type="text" class="header-input" v-model="client.deviceName">
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
                        <div class="content-data">1</div>
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
            temperature: "",
            oxygen: "",
            pH: "",
            foam: "",
            controlState: "",
            hotState: "",
            coldState: "",
            acidState: "",
            baseState: "",
            whiskState: "",
            DOMAIN: "http://127.0.0.1:8888",
            client: {
                pid: "583419",
                deviceID: "1059893029",
                deviceName: "mqtt-can1",

            },
        }
    },
    computed: {
        setControlState: function () {
            return this.controlState === "1" ? "远程控制" : "本地控制"
        },

    },
    methods: {
        setStateText: function (stateName) {
            return stateName === "1" ? "ON" : "OFF"
        },
        /**
         * 更新控制状态
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
                if (res.data.code === "0") {
                    this.controlState = stateCode
                } else {
                    console.log("切换控制状态失败-1", res.data.data)
                }
            } catch (error) {
                console.log("切换控制状态失败-2", error)
            }
        }
    },

    mounted: function () {
        // axios.get(`${this.DOMAIN}/mqtt/getDevice`,
        //     {
        //         params: {
        //             deviceName: this.client.deviceName
        //         }
        //     }
        // ).then((res) => {
        //     console.log('结果', res.data.data)
        // }, err => {
        //     console.log("错误", err)
        // })

        // axios.get(`${this.DOMAIN}/mqtt/getDataStream`,
        //     {
        //         params: {
        //             deviceID: this.client.deviceID
        //         }
        //     }
        // ).then((res) => {
        //     const { foam, temperature, pH, oxygen } = res.data.data
        // }, err => {
        //     console.log("错误", err)
        // })

        // axios.post(`${this.DOMAIN}/mqtt/updateImageState`, {
        //     deviceID: this.client.deviceID,
        //     newStates: {
        //         "controlState": "0",
        //         "coldState": "0"
        //     }
        // }).then((res) => {
        //     const {data} = res.data
        //     console.log("返回值", data)
        // }, err => {
        //     console.log("错误", err)
        // })
    }

}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    background-color: whitesmoke;
    display: flex;
    justify-content: center;

    .body {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        width: 450px;
        height: 500px;
        border: 1px solid black;
    }

    .header {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
        margin-bottom: 10px;

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