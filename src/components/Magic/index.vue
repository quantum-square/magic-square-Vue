<template>
  <div class="main">
    <a-row>
      <a-col :span="5">
        <Timer :start="start" :stopped="stopped" :result="result" class="timer"/>
      </a-col>
      <a-col :span="10">
        <Info :start="start" :result="result" class="info"/>
      </a-col>
      <a-col :span="3">
        <div class="info">
          <span>Select:</span>
        </div>
      </a-col>
      <a-col :span="2">
        <a-input-number class="selectBar" :disabled="!(start&&!stopped&&!solver)" :min="0"
                        :max="dimension*dimension"
                        @change="handleNumberChange"/>
      </a-col>
    </a-row>
    <a-divider class="line"/>

    <Board
        class="board"
        :start="start"
        :stopped="stopped"
        :solver="solver"
        :showMouseHover="showMouseHover"
        :model="boardModel"
        :dimension="dimension"
        @eventCellClick="handleCellClickEvent"
        @eventSudokuResult="handleResultEvent"
    />

  </div>
</template>

<script>
import Info from "../Info";
import Timer from "../Timer";
import Board from "./components/Board";


export default {
  components: {
    Board,
    Timer,
    Info
  },
  data() {
    return {
      result: null,
      number: '',
      boardModel: {
        selectCell: null,
        selectBarNumber: null,
        level:1
      },
      selectBarModel: {
        able: false
      }
    };
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {
          level: 1
        };
      },
      required: false
    },
    start: {
      type: Boolean,
      default: false,
      required: true
    },
    stopped: {
      type: Boolean,
      default: false,
      required: true
    },
    solver: {
      type: Boolean,
      default: false,
      required: true
    },
    showMouseHover: {
      type: Boolean,
      default: true,
      required: false
    },
    dimension: {
      type: Number,
      default: 9,
      required: false
    }
  },
  watch: {
    start(val) {
      if (val == true) {
        this.boardModel.level = this.config.level;
      }
    },
    dimension(val) {
      var board = document.getElementsByClassName("board")[0];
      var big_board = document.getElementsByClassName("big-board")[0];
      if (1 <= val && val <= 20 && big_board != null) {
        big_board.setAttribute("class", "board");
      } else if (val > 20 && val <= 40 && board != null) {
        board.setAttribute("class", "big-board");
      }
    }
  },
  beforeCreate() {
  },
  mounted() {
  },
  methods: {
    handleResultEvent(result) {
      //{total: 15, empty: 14, error: 0, success: false}
      this.result = result;
      // console.log(result);
    },
    handleCellClickEvent(cell) {
      this.boardModel.selectCell = cell;
      this.boardModel.selectBarNumber = cell.number;
    },
    handleButtonClick(number) {
      this.boardModel.selectBarNumber = number;
    },
    handleNumberChange(value) {
      if (value == "" || 1 <= value && value <= this.dimension * this.dimension) {
        this.number = value;
      }
      this.boardModel.selectBarNumber = this.number;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  width: 600px;
  height: 800px;
}

.info {
  //position: absolute;
  left: 0px;
  top: 0px;
  font-size: 18px;
  font-weight: bold;
  color: #228cbd;
}

.timer {
  position: relative;
  left: 0px;
  top: 0px;

  font-size: 18px;
  color: #a8a7a7;
}

.line {
  top: -10px;
  left: 0px;
  width: 800px;
}

.board {
  position: absolute;

  left: 50px;
  top: 30px;
  width: 600px;
  height: 600px;
  -webkit-transform: scale(0.875);
  background: #e6e6e6;
}

.big-board {
  position: relative;
  left: -400px;
  top: -500px;
  width: 1500px;
  height: 1500px;
  background: #e6e6e6;
  -webkit-transform: scale(0.35);

}


</style>