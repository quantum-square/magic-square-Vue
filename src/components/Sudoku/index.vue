<template>
  <div class="main">
    <Timer :start="start" :stopped="stopped" :result="result" class="timer"/>
    <Info :start="start" :result="result" class="info"/>
    <a-divider/>
    <Board
        class="board"
        :start="start"
        :stopped="stopped"
        :solver="solver"
        :showMouseHover="showMouseHover"
        :model="boardModel"
        :boardData="boardData"
        @eventCellClick="handleCellClickEvent"
        @eventSudokuResult="handleResultEvent"
        :indicationToGetCurBoard="indicationToGetCurBoard"
        @eventCurrentBoardFromBoard="getCurBoardFromBoard"
    />
    <SelectBar :dimension="9" :start="start&&!stopped&&!solver" @eventNumberClick="handleButtonClick" class="selectBar"/>

  </div>
</template>

<script>
import Info from "../Info";
import Timer from "../Timer";
import SelectBar from "./components/SelectBar";
import Board from "./components/Board";
import EVENT from "../event";

export default {
  components: {
    SelectBar,
    Board,
    Timer,
    Info
  },
  data() {
    return {
      result: null,
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
  created() {
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
      default: true,
      required: true
    },
    solver: {
      type: Boolean,
      default: true,
      required: true
    },
    showMouseHover: {
      type: Boolean,
      default: true,
      required: false
    },
    boardData: {
      type: Array,
      required: false,
    },
    indicationToGetCurBoard: {
      type: Boolean
    }
  },
  watch: {
    start(val) {
      if (val == true) {
        this.boardModel.level = this.config.level;
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
    getCurBoardFromBoard(BoardData) {
      console.log('trigger getCurBoardFromBoard')
      this.$emit(EVENT.CURRENT_BOARD_FROM_Sudoku, BoardData);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  width: 600px;
  height: 480px;
  //   border: 1px solid rgb(209, 207, 207);
}

.info {
  position: absolute;
  left: 120px;
  top: 0px;
  font-size: 18px;
  font-weight: bold;
  color: #228cbd;
}

.timer {
  position: absolute;
  left: 0px;
  top: 0px;

  font-size: 18px;
  color: #a8a7a7;
}

.board {
  position: absolute;
  left: 40px;
  top: 50px;
  width: 450px;
  //   border: 1px solid #757575;
  background: #e6e6e6;
}

.selectBar {
  position: absolute;
  right: -25px;
  top: 50px;
  width: 100px;

  //  background: #e6e6e6;
}
</style>