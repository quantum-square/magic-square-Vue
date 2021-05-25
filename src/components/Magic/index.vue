<template>
  <div class="main">
    <a-row>
      <a-col :span="5">
        <Timer :start="start" :stopped="stopped" :result="result" class="timer"/>
      </a-col>
      <a-col :span="13">
        <Info :start="start" :result="result" class="info"/>
      </a-col>
      <a-col :span="3">
        <div class="info-select">
          <span>Select:</span>
        </div>
      </a-col>
      <a-col :span="2">
        <a-input-number class="selectBar" :disabled="!(start&&!solver)" :min="0"
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
        :boardData="boardData"
        :indicationToGetCurBoard="indicationToGetCurBoard"
        @eventCurrentBoardFromBoard="getCurBoardFromBoard"
        :boardDataLoadedToBoard="boardDataLoadedToBoard"
        :indicationConstraint="indicationConstraint"
    />

  </div>
</template>

<script>
import Info from "../Info";
import Timer from "../Timer";
import Board from "./components/Board";
import EVENT from "../event";


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
        level:1,
        disable:false
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
    },
    boardData: {
      type: Array,
      required: false,
    },
    indicationToGetCurBoard: {
      type: Boolean
    },
    boardDataLoadedToBoard: {
      type:Object,
      default: null
    },
    indicationConstraint: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    start(val) {
      if (val === true) {
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
      this.result = result;
      this.$emit(EVENT.SUDOKU_RESULT, this.result);
    },
    handleCellClickEvent(cell) {
      this.boardModel.selectCell = cell;
      this.boardModel.selectBarNumber = cell.number;
    },
    handleButtonClick(number) {
      this.boardModel.selectBarNumber = number;
    },
    handleNumberChange(value) {
      // TODO
      if (value === "" || 1 <= value && value <= this.dimension * this.dimension) {
        this.number = value;
      }
      this.boardModel.selectBarNumber = this.number;
      this.boardModel.disable = this.stopped;
    },
    getCurBoardFromBoard(BoardData) {
      console.log('trigger getCurBoardFromBoard in Magic')
      this.$emit(EVENT.CURRENT_BOARD_FROM_Magic, BoardData);
    },
  }
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  width: 600px;
  height: 800px;
}

.info-select {
  //position: absolute;
  padding-left: 80px;
  left: 0;
  top: 0;
  font-size: 18px;
  font-weight: bold;
  color: #228cbd;
}
.selectBar{
  margin-left: 80px;
}

.timer {
  position: relative;
  left: 80px;
  top: 0;

  font-size: 18px;
  color: #a8a7a7;
}

.line {
  top: -15px;
  left: 50px;
  width: 800px;
}

.board {
  position: absolute;

  left: 200px;
  top: 50px;
  width: 800px;
  height: 800px;
  -webkit-transform: scale(0.875);
  background: #e6e6e6;
}

.big-board {
  position: relative;
  left: -400px;
  top: -630px;
  width: 2000px;
  height: 2000px;
  background: #e6e6e6;
  -webkit-transform: scale(0.35);

}


</style>
