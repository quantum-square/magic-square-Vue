<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="Matrix Puzzle Solver"
        sub-title="CS 209 final project"
    />
    <RootLayout/>
  </div>
</template>

<script>

// import Sudoku from "./components/Sudoku";
import RootLayout from "./components/RootLayout";

export default {
  name: "App",
  components: {
    // Sudoku
    RootLayout
  },
  data() {
    return {
      config: {
        level: "1"
      },
      start: false,
      value: null,
      showMouseHover: true
    };
  },
  mounted() {
  },
  methods: {
    // moment,
    handleChange(e) {
      console.log(`checked = ${e.target.value}`);
      this.config.level = e.target.value;
    },
    handleStartClick() {
      this.start = true;
    },
    handleEndClick() {
      this.start = false;
    }
  }
};
</script>
<style>
.ant-page-header-heading-title {
  font-weight: bold !important;
  font-size: 24px !important;
}
.ant-page-header-heading-sub-title {
  font-size: 16px !important;
}
</style>


