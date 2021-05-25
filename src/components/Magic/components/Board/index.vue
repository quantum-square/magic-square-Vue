<template>
  <div class="board" v-if="dimension<=40">
    <template v-for="(item, i) in dimension+2">
      <div class="row" :key="i">
        <template v-for="(item, j) in dimension+2">
          <Cell
              :control="getCellControl(i,j)"
              :size=(board_size/(dimension+2))
              @eventCellClick="handleCellClickEvent"
              @eventMouseOver="handleCellMouseEvent"
              @eventMouseOut="handleCellMouseEvent"
              :key="`${i}-${j}`"
              :indicationConstraint="indicationConstraint"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import Cell from "./Cell";
import EVENT from "../../../event";

export default {
  components: {
    Cell
  },
  props: {
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
      default: false,
      required: true
    },
    model: {
      type: Object,
      default: function () {
        return {
          level: 1,
          selectCell: null,
          selectBarNumber: null,
          disable:null
        };
      },
      required: true
    },
    dimension: {
      type: Number,
      default: 9,
      required: false
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
    },
    boardDataLoadedToBoard: {
      type: Object,
      default: null,
    },
    indicationConstraint: {
      typr: Boolean,
      default: true,
    }
  },

  data() {
    return {
      cells: [],
      board_size: 600
    };
  },

  created() {
  },
  watch: {
    start(val) {
      if (val === true) {
        this.initGrid();
        this.sendResult();
      }
      else {
        this.gameOver();
      }
    },
    dimension(val) {
      if (1 <= val && val <= 20) {
        this.board_size = 600;
      } else if (val > 20 && val <= 40) {
        this.board_size = 1500;
      }
    },
    model: {
      handler: function () {
        this.cellWriteNumber();
        this.sendResult();
      },
      deep: true
    },
    cells: {
      handler: function () {
        // console.log(newValue);
      },
      deep: true
    },
    boardData: {
      handler: function () {
        console.log('Board know the change', this.boardData);
        if (this.start && this.solver && !this.stopped) {
          this.updateAllCells();
        }
        console.log('Update success');
      },
      deep: true
    },
    indicationToGetCurBoard: {
      handler: function () {
        console.log('want to get current board in Board');

        let BoardData = [];
        let disable = [];
        for (let i = 0; i < this.dimension; i++) {
          BoardData[i] = [];
          disable[i] = [];
          for (let j = 0; j < this.dimension; j++) {
            BoardData[i][j] = this.cells[(i+1)*(this.dimension+2)+j+1].number == null ? 0 : this.cells[(i+1)*(this.dimension+2)+j+1].number;
            disable[i][j] = this.cells[(i+1)*(this.dimension+2)+j+1].disable ? 1 : 0;
          }
        }
        this.makeCellsUnselected();
        let obj = {'board':BoardData, 'disable':disable};
        this.$emit(EVENT.CURRENT_BOARD_FROM_Board, obj);
      }
    },
    boardDataLoadedToBoard: {
      handler: function () {
        console.log('Board know what to load', this.boardDataLoadedToBoard);
        this.makeCellsUnselected();
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            this.cells[(i+1)*(this.dimension+2)+j+1]['disable'] = this.boardDataLoadedToBoard['disable'][i][j] === 1;
            this.cells[(i+1)*(this.dimension+2)+j+1]['number'] = this.boardDataLoadedToBoard['board'][i][j] === 0 ? null : this.boardDataLoadedToBoard['board'][i][j];
          }
        }
        console.log(this.cells)
        this.sendResult();
      }
    }
  },
  methods: {
    //初始化Grid
    initGrid() {
      this.cells = [];
      for (let i = 0; i < this.dimension+2; i++) {
        for (let j = 0; j < this.dimension+2; j++) {
          let cell = {
            number: null,
            hover: false,
            selected: false,
            disable: false,
            x: i,
            y: j
          };
          if (i === 0 || i === this.dimension+1 || j === 0 || j === this.dimension+1)
          {
            cell.number = 0;
            cell.disable = true;
          }
          this.cells.push(cell);
        }
      }

      this.updateMagicSum();
    },
    sendResult() {
      let success = false;
      if (this.getDefectCell() === 0) {
         success = this.updateMagicSum();
      }

      // TODO: total is wrong
      this.$emit(EVENT.SUDOKU_RESULT, {
        total: this.dimension*this.dimension,
        empty: this.getDefectCell(),
        error: !success,
        success: success
      });
    },
    gameOver() {
      this.cells = [];
      for (let i = 0; i < (this.dimension+2) * (this.dimension+2); i++) {
        let cell = {
          number: null,
          hover: false,
          selected: false,
          disable: false,
          x: "-",
          y: "-"
        };
        this.cells.push(cell);
      }

      console.log("gameOver", this.cells);
    },
    updateMagicSum() {
      let result = true, sum = 0, magicSum = (1+this.dimension*this.dimension) * this.dimension / 2;
      for (let i = 0; i < this.dimension; i++) {
        sum = 0;
        for (let j = 0; j < this.dimension; j++) {
          let num = this.cells[(i+1)*(this.dimension+2)+j+1].number !== null ? this.cells[(i+1)*(this.dimension+2)+j+1].number : 0;
          sum += num;
        }
        if (sum !== magicSum)
        {
          console.log(i, sum);
          result = false;
        }
        this.cells[(i+1)*(this.dimension+2)]['number'] = sum;
        this.cells[(i+2)*(this.dimension+2)-1]['number'] = sum;
      }

      for (let i = 0; i < this.dimension; i++) {
        sum = 0;
        for (let j = 0; j < this.dimension; j++) {
          let num = this.cells[(j+1)*(this.dimension+2)+i+1].number !== null ? this.cells[(j+1)*(this.dimension+2)+i+1].number : 0;
          sum += num;
        }
        if (sum !== magicSum) result = false;
        this.cells[i+1]['number'] = sum;
        this.cells[(this.dimension+1)*(this.dimension+2)+(i+1)]['number'] = sum;
      }

      sum = 0;
      for (let i = 0; i < this.dimension; i++) {
        let num = this.cells[(i+1)*(this.dimension+2)+i+1].number !== null ? this.cells[(i+1)*(this.dimension+2)+i+1].number : 0;
        sum += num;
      }
      if (sum !== magicSum) result = false;
      this.cells[0]['number'] = sum;
      this.cells[(this.dimension+2)*(this.dimension+2)-1]['number'] = sum;

      sum = 0;
      for (let i = 0; i < this.dimension; i++) {
        let num = this.cells[(i+2)*(this.dimension+1)].number !== null ? this.cells[(i+2)*(this.dimension+1)].number : 0;
        sum += num;
      }
      if (sum !== magicSum) result = false;
      this.cells[(this.dimension+1)]['number'] = sum;
      this.cells[(this.dimension+1)*(this.dimension+2)]['number'] = sum;


      return result;
    },
    // 更新所有cells
    updateAllCells() {
      console.log("updateAllCells", this.boardData);
      this.makeCellsUnselected();
      if (this.boardData.length === this.dimension
          && this.boardData[0].length === this.dimension) {
        for (let index = this.dimension+1; index < (this.dimension+1)*(this.dimension+2); index++) {
          console.log('hhh')
          let cell = this.cells[index];
          cell.number = (!cell.disable && this.boardData[Math.floor(index/(this.dimension+2))-1][index%(this.dimension+2) - 1]!==0) ? this.boardData[Math.floor(index/(this.dimension+2))-1][index%(this.dimension+2) - 1] : cell.number;
        }
        this.sendResult();
      }
    },
    getCellControl(x, y) {
      return this.cells.find(item => {
        return item.x === x && item.y === y;
      });
    },
    //写入选中号码
    cellWriteNumber() {
      let {cells, model} = this;
      for (let index = 0; index < cells.length; index++) {
        let cell = cells[index];
        let number =
            model.selectBarNumber > 0 ? model.selectBarNumber : null;
        if (this.stopped) {
          if (!this.indicationConstraint) {
            if (cell.x !== 0 && cell.x !== this.dimension + 1 && cell.y !== 0 && cell.y !== this.dimension + 1) {
              cell.number = cell.selected ? number : cell.number;
              if (cell.selected) {
                if (number)
                  cell.disable = true;
                else
                  cell.disable = false;
              }
            }
          }
        }
        else {
          if (!cell.disable) cell.number = cell.selected ? number : cell.number;
        }
      }
      this.updateMagicSum();
    },
    showCellSelect(x, y) {
      let {cells} = this;
      for (let index = 0; index < cells.length; index++) {
        let cell = cells[index];
        cell.selected = cell.x === x && cell.y === y;
      }
    },
    //显示鼠标经过的方格的当前列和当前行
    showCellsMouseHover(x = null, y = null) {
      let {cells} = this;
      for (let index = 0; index < cells.length; index++) {
        let cell = cells[index];
        cell.hover = cell.x === x || cell.y === y;
      }
    },
    getDefectCell() {
      let count = 0;
      for (let i  = 0; i < this.dimension; i++) {
        for (let j = 0; j < this.dimension; j++) {
          if (!this.cells[(i+1)*(this.dimension+2)+j+1]['number']) {
            count++;
          }
        }
      }
      return count;
    },
    handleCellMouseEvent(cell) {
      if (!this.start || this.solver) return;
      if (cell) {
        if (this.showMouseHover) {
          let {x, y} = cell;
          this.showCellsMouseHover(x, y);
        }
      } else {
        this.showCellsMouseHover();
      }
    },
    handleCellClickEvent(cell) {
      if (!this.start || this.solver) return;
      let {x, y} = cell;
      console.log(x,y);
      this.showCellSelect(x, y);
      this.$emit(EVENT.CELL_CLICK, cell);
    },
    makeCellsUnselected() {
      for (let index = 0; index < this.cells.length; index++) {
        let cell = this.cells[index];
        cell.selected = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>


.row {
  display: flex;
}
</style>