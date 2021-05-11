<template>
  <div
      class="botton"
      @click="handleClick()"
      @mouseover="handleMouseOver()"
      @mouseout="handleMouseOut()"
      :style="{height: scrollerSize, width: scrollerSize, lineHeight: scrollerSize, fontsize:scrollerFontSize}"
      :class="[{able:control.disable,hover:control.hover && !control.selected,selected:control.selected}]"
  >
    <template v-if="control.number">{{ control.number }}</template>
    <!-- <template v-else>
      <p class="font-12">{{control&&control.x}}{{control&&control.y}},{{control&&control.box}}</p>
    </template>-->
  </div>
</template>

<script>
import EVENT from "../../../event";

export default {
  props: {
    control: {
      type: Object,
      default: function () {
        return {
          number: null,
          hover: false,
          selected: false,
          disable: false,
          box: null,
          x: "-",
          y: "-"
        };
      },
      required: true
    },
    size: {
      type: Number,
      default: 50,
      required: false
    },
  },
  computed: {
    scrollerSize: function () {
      return this.size + 'px';
    },
    scrollerFontSize: function () {
      return this.size / 2 + 'px';
    }
  },

  data() {
    return {
      empty: true
    };
  },
  methods: {
    handleClick() {
      if (this.control.disable) return;
      this.$emit(EVENT.CELL_CLICK, this.control);
      // console.log(EVENT.CELL_CLICK, this.title, this.position);
    },
    handleMouseOver() {
      if (this.control.disable) return;
      this.$emit(EVENT.CELL_MOUSE_OVER, this.control);
      //console.log(EVENT.CELL_MOUSE_OVER, this.title, this.position);
    },
    handleMouseOut() {
      if (this.control.disable) return;
      this.$emit(EVENT.CELL_MOUSE_OUT);
      // console.log(EVENT.CELL_MOUSE_OUT);
    }
  }
};
</script>

<style lang="scss" scoped>
$background: #dadada;
$borderColor: #6d6d6d;
$borderlightColor: #bebebe;
$backgroundHover: #a5a5a552;
//Selected
$borderselectedcolor: #5ac4d6b2;
$backgroundselected: #52e2fcb2;
.botton {
  // pointer-events: auto;
  border: 1px solid $borderlightColor;
  background: $background;
  font-weight: bold;
  text-align: center;

  color: rgb(26, 26, 26);
  -webkit-user-select: none; /* Chrome/Safari/Opera */

  &.selected {
    border: 1px solid $borderselectedcolor;
    background: $backgroundselected;
  }

  //
  &.hover {
    cursor: pointer;
    // color: rgb(255, 255, 255);
    border: 1px solid $borderlightColor;
    background: $backgroundHover;
  }

  &.able {
    cursor: default;
    color: rgb(128, 128, 128);
    background: #d6d6d6b2;
    border: 1px solid $borderlightColor;

    &.hover {
      // color: rgb(255, 255, 255);
      // border: 1px solid $borderlightColor;
      background: $backgroundHover;
    }

    // &:hover {
    //   border: 1px solid $borderlightColor;
    // }
  }
}
</style>