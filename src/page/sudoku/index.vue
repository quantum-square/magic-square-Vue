<template>
  <div id="together" class="wrap">
    <div class="mean">
      <a-row>
        <a-col :span="6">
          <a-button type="primary" :disabled="start" size="small" @click="handleStartClick">
            Start
          </a-button>
          <a-button type="primary" :disabled="!start" size="small" @click="handleEndClick">
            End
          </a-button>
        </a-col>

        <a-col :span="8">
          <a-radio-group
              size="small"
              :disabled="start"
              buttonStyle="solid"
              @change="handleChange"
              v-model="config.level"
          >
            <a-radio-button value="1">Easy</a-radio-button>
            <a-radio-button value="2">Normal</a-radio-button>
            <a-radio-button value="3">Hard</a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col :span="5">
          <span>Solver </span>
          <a-switch :defaultChecked="solver" @change="onChangeSolver"/>
        </a-col>
      </a-row>
    </div>
    <Sudoku
        :config="config"
        :start="start"
        :stopped="stopped"
        :solver="solver"
        :showMouseHover="showMouseHover"
        :boardData="boardDataToBoard"
        :indicationToGetCurBoard="indicationToGetCurBoard"
        @eventCurrentBoardFromSudoku="getCurBoardFromSudoku"
        @eventSudokuResult="handleResultEvent"
        :boardDataLoadedToBoard="boardDataLoadedToBoard"
    />
    <a-space direction="vertical" class="buttonsBar">
      <a-button :disabled="!start||!stopped" type="primary" class="paper-btn" @click="handleContinue">
        Continue
      </a-button><br/>
      <a-button :disabled="!start||stopped||result.success" type="primary" class="paper-btn" @click="handleStop">
        Stop
      </a-button><br/>
      <a-button :disabled="!(!solver && start && stopped)" type="primary" class="paper-btn" id="fileImport" @click="handleLoad">
        Load Puzzle
      </a-button>
      <input type="file" id="files" ref="refFile" style="display: none" v-on:change="handleFileChange"/><br/>
      <a-button :disabled="!(!solver && start)" type="primary" class="paper-btn" @click="handleSave">
        Save Puzzle
      </a-button><br/>
      <a-button :disabled="!(!solver && start)" type="primary" class="paper-btn" @click="handleDownload">
        Download Original Puzzle
      </a-button>
    </a-space>
  </div>
</template>

<script>
import Sudoku from "../../components/Sudoku";
import EVENT from "../../components/event";
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default {
  name: "App",
  components: {
    Sudoku
  },
  data() {
    return {
      config: {
        level: "1"
      },
      start: false,
      stopped: false,
      solver: false,
      value: null,
      showMouseHover: true,
      headers: {
        authorization: 'authorization-text',
      },
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'http://www.baidu.com/xxx.png',
        },
      ],
      taskid: -1,
      ws: null,
      backend_wb_path: 'ws://127.0.0.1:8000/syncBoard/',
      boardDataToBoard: null,
      indicationToGetCurBoard: false,
      boardDataFromBoard: null,
      result: null,
      boardDataLoadedToBoard: null,
    };
  },
  watch: {

  },
  mounted() {
    this.taskid = -1;
    this.ws = null;
    this.start = false;
    this.solver = false;
  },
  destroyed() {
    if (this.ws !== null) this.ws.close();
  },
  methods: {
    handleResultEvent(result) {
      //{total: 15, empty: 14, error: 0, success: false}
      this.result = result;
      // console.log(result);
    },
    // moment,
    // TODO: modify the name
    handleChange(e) {
      console.log(`checked = ${e.target.value}`);
      this.config.level = e.target.value;
    },
    onChangeSolver(value) {
      if (!this.start) {
        this.solver = value;
      }
      else {
        if (this.solver) {
          this.solver = value;
          this.taskid = -1;

          // close websocket
          if (this.ws != null) {
            this.ws.close();
            this.ws = null;
          }
        }
        else {
          this.solver = value;
          this.getCurBoard();
          this.$nextTick( function () {
            this.createTask();
          })
        }
      }
    },
    handleStartClick() {
      this.start = true;
      this.stopped = true;

      if (this.solver) {
        this.getCurBoard();
        this.$nextTick( function () {
          this.createTask();
        })
      }
    },
    handleEndClick() {
      this.start = false;
      this.stopped = true;

      if (this.ws != null) {
        this.$axios.post('/stop/', {
          taskId: this.taskid,
        }).then(res =>
        {
          console.log('stop success!');
        }).catch(err =>
        {
          console.log(err);
        });

        this.ws.close();
      }
      this.ws = null;
      this.taskid = -1;
    },
    handleLoad() {
      this.$refs.refFile.dispatchEvent(new MouseEvent('click'))
    },
    handleFileChange() {
      let that = this;
      const selectedFile = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = function() {
        let data = this.result;
        that.boardDataLoadedToBoard = JSON.parse(data);

      }
    },
    handleSave() {
      let that = this;
      this.getCurBoard();
      this.$nextTick(function () {
        let data = JSON.stringify(that.boardDataFromBoard);
        let blob = new Blob([data], {type: 'application/json'});
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = new Date().getTime().toString();
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      })
    },
    handleContinue() {
      if (this.start) {
        this.stopped = false;
        if (this.taskid !== -1) {
          this.$axios.get('/state/'+this.taskid)
              .then(res => {
                console.log(res.data);
                let str = res.data;
                let url = '';
                if (str === 'NEW') url = '/start/';
                else if (str === 'SUSPEND') url = '/resume/';

                this.$axios.post(url, {
                  taskId: this.taskid,
                }).then(res => {
                  console.log('task ' + this.taskid + ' ' + url + ' resume success')
                }).catch(err => {
                  console.log(err);
                })
              })
              .catch(err => {
                console.log(err);
              })
        }
      }
    },
    handleStop() {
      if (this.solver) {
        this.$axios.post('/suspend/', {
          taskId: this.taskid,
        }).then(res => {
          console.log('task ' + this.taskid + ' suspend success!');
        }).catch(err => {
          console.log(err);
        });
      }
      this.stopped = true;
    },
    handleDownload() {
      let that = this;
      this.getCurBoard();
      this.$nextTick(function () {
        let data = that.boardDataFromBoard;
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (data['disable'][i][j] === 0) {
              data['board'][i][j] = 0;
            }
          }
        }
        data = JSON.stringify(data);
        let blob = new Blob([data], {type: 'application/json'});
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = 'Ori' + new Date().getTime().toString();
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      })
    },
    getCurBoard() {
      console.log('getCurBoard start', this.boardDataFromBoard);
      let boardDataFromBoardTemp = this.boardDataFromBoard;
      this.indicationToGetCurBoard = !this.indicationToGetCurBoard;
      console.log('getCurBoard end', this.boardDataFromBoard);
      return this.boardDataFromBoard;
    },
    setCurBoard(data) {
      this.boardDataToBoard = data;
    },
    getCurBoardFromSudoku(BoardData) {
      console.log('trigger getCurBoardFromSudoku')
      this.boardDataFromBoard = BoardData;
    },
    webSocketInit() {
      this.webSocketInitInside();
    },
    startTask() {
      this.$axios.post('/start/', {
        taskId: this.taskid,
      }).then(res => {
        console.log('start task', res);
        console.log('task ' + this.taskid + ' start success');
      }).catch(err => {
        console.log(err);
      })
    },
    webSocketInitInside() {
      console.log('try to connect websocket');
      let self = this;
      this.ws = new WebSocket(this.backend_wb_path + this.taskid);
      this.ws.onopen = function (event) {
        console.log('websocket open:', event);
      }
      this.ws.onmessage = function (event) {
        console.log('onmessage', event);
        let dataUpdate = JSON.parse(event.data);

        if (dataUpdate['board'] !== null) {
          self.boardDataToBoard = dataUpdate['board'];
          console.log('assign boardDataToBoard success in sudoku', self.boardDataToBoard)
        }
        else {
          console.log("it is null")
        }
      }
      this.ws.onclose = function (event) {
        console.log('websocket disconnect', event);
      }
      this.ws.onerror = function (err) {
        console.log(err);
      }
    },
    createTask() {
      let boarddata = this.boardDataFromBoard['board'];

      this.$axios.post('/sdk/create/', {
        board: boarddata,
      }).then(res => {
        console.log('create res', res);

        this.taskid = res.data['taskId'];
        console.log('create task ' + this.taskid + ' success!');

        this.webSocketInit();

        if (!this.stopped) {
          this.startTask();
        }

      }).catch(err => {
        console.log(err);
      });
    },
  }
}
;
</script>
<style lang="scss" scoped>
#together {
}


.mean {
  padding: 20px;
  width: 60%;
}

.wrap {
  padding: 20px;
  margin: 0 auto;
  min-height: calc(100vh - 270px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.buttonsBar {
  position: absolute;
  left: 270px;
  top: 350px;
  width: 100px;
}

.paper-btn {
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  box-shadow: 15px 28px 25px -18px;
  font-family: Neucha, sans-serif;
  font-size: 20px;
  border: 2px solid black;
}
</style>