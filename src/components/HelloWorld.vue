<template>
  <div class="container">
    <div class="box">
      <div class="title">
        <div>Modbus 应 用</div>
        <div class="connect-status" :class="setConnectStatus"></div>
        <div class="connect-port">
          COM:<input type="text" v-model="inputPort">
          <div class="connect-button" @click="connectSerialPort"> 连 接 </div>
        </div>
      </div>
      <div class="row1">
        <div class="row1-left">设备地址</div>
        <div class="row1-right">
          <input type="text" v-model="deviceAdd">
        </div>
      </div>
      <div class="row1">
        <div class="row1-left">【读】寄存器长度</div>
        <div class="row1-right">
          <input type="text" v-model="readLength">
        </div>
      </div>
      <div class="row1">
        <div class="row1-left">【读/写】寄存器地址</div>
        <div class="row1-right">
          <input type="text" v-model="rwStartAdd">
        </div>
      </div>
      <div class="row1">
        <div class="row1-left">【写】写入寄存器的值</div>
        <div class="row1-right">
          <input type="text" v-model="writeData">
          <button class="button-30" @click="readRegister" role="button">读取</button>
          <button class="button-30" @click="writeRegister" role="button">写入</button>
        </div>
      </div>
      <div class="messageList" v-for="(item, index) in messageList" :key="index">
        <div>{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data: function () {
    return {
      DOMAIN: "http://127.0.0.1:8888",
      deviceAdd: "2",
      rwStartAdd: "0",
      readLength: "3",
      writeStartAdd: "5",
      writeData: "123",
      inputPort: "0",
      connectedPort: "",
      messageList: []
    }
  },
  computed: {
    setConnectStatus: function () {
      if (this.connectedPort !== "") {
        return `connected`
      }
      else {
        return ``
      }
    }
  },
  methods: {
    readRegister: async function () {
      // port,address,reStart,reLength
      const that = this
      const reStart = this.rwStartAdd
      const reLength = this.readLength
      const port = this.connectedPort
      const address = this.deviceAdd
      try {
        const res = await axios.post(`${this.DOMAIN}/read`, {
          port,
          address,
          reStart,
          reLength
        })
        if (res.data.code === 0) {
          console.log("读数据成功", res.data)
          that.messageList.push(`【读成功】位置:${port}-${address}-[${reStart}~${Number(reStart) + Number(reLength) - 1}] 读入数据:${res.data.data}`)
        } else {
          console.log("读数据失败", res.data)
        }
      } catch (error) {
        console.log("读数据失败", error)
      }
    },
    writeRegister: async function () {
      const that = this
      const port = this.connectedPort
      const address = this.deviceAdd
      const reStart = this.rwStartAdd
      const reData = Number(this.writeData)
      try {
        const res = await axios.post(`${this.DOMAIN}/write`, {
          port,
          address,
          reStart,
          reData
        })
        if (res.data.code === 0) {
          console.log("写数据成功", res.data)
          that.messageList.push(`【写成功】位置:${port}-${address}-[${reStart}~${Number(reStart) + Number(reStart + 1) - 1}] 写入数据:${reData}`)
        } else {
          console.log("写数据失败", res.data)
        }
      } catch (error) {
        console.log("写数据失败", error)
      }
    },
    connectSerialPort: async function () {
      // 从input中读入的值
      const port = `COM${this.inputPort}`
      const address = this.deviceAdd
      const that = this
      try {
        const res = await axios.post(`${this.DOMAIN}/connect`, {
          port,
          address
        })
        if (res.data.code === 0) {
          console.log(`${port}-连接成功`)
          // 将连接好的串口加入连接池
          that.connectedPort = port
        } else {
          console.log(`${port}-连接失败`, res)
        }
      } catch (error) {
        console.log(`${port}-连接失败`, error)
      }

    },

  },
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  .box {
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    min-width: 500px;
    min-height: 350px;
    background-color: whitesmoke;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    padding-right: 5px;

    .title {
      position: relative;
      border-radius: 5px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      width: 100%;
      font-weight: 550;
      background-color: #03A9F4;
      color: white;
      margin-bottom: 5px;
      margin-top: 10px;

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

      .connect-port {
        display: flex;
        width: 150px;
        position: absolute;
        top: 3px;
        right: 10px;
        justify-content: center;
        align-items: center;

        input {
          margin-left: 3px;
          width: 20px;
          height: 20px;
        }

        .connect-button {
          background-color: #FCFCFD;
          margin-left: 10px;
          color: #36395A;
          font-size: 14px;
          width: 50px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          font-weight: 400;
          border-radius: 10px;
        }

        .connect-button:hover {
          cursor: pointer;
          box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px
        }
      }
    }

    .row1 {
      width: 100%;
      height: 60px;
      background-color: whitesmoke;
      display: flex;
      margin-bottom: 5px;

      .row1-left {
        font-size: 14px;
        width: 150px;
        line-height: 60px;
        text-align: center;
        height: 100%;
        background-color: lightgray;
        font-weight: 500;
      }

      .row1-right {
        padding-top: 2.5px;
        padding-left: 10px;
        display: flex;

        input {
          font-size: 18px;
          width: 100px;
          height: 50px;
        }

        .button-30 {
          margin-top: 2.5px;
          margin-left: 5px;
          width: 100px;
          align-items: center;
          appearance: none;
          background-color: #FCFCFD;
          border-radius: 4px;
          border-width: 0;
          box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
          box-sizing: border-box;
          color: #36395A;
          cursor: pointer;
          display: inline-flex;
          font-family: "JetBrains Mono", monospace;
          height: 48px;
          justify-content: center;
          line-height: 1;
          list-style: none;
          overflow: hidden;
          padding-left: 16px;
          padding-right: 16px;
          position: relative;
          text-align: left;
          text-decoration: none;
          transition: box-shadow .15s, transform .15s;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          white-space: nowrap;
          will-change: box-shadow, transform;
          font-size: 18px;
        }

        .button-30:focus {
          box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
        }

        .button-30:hover {
          box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
          transform: translateY(-2px);
        }

        .button-30:active {
          box-shadow: #D6D6E7 0 3px 7px inset;
          transform: translateY(2px);
        }
      }
    }
  }
}
</style>

