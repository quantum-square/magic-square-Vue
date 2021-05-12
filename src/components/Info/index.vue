<template>
  <div class="info" v-if="result && start">
    <span v-if="0 !== result.empty">{{result.empty}}/{{result.total}}</span>
    <template v-if="0 === result.empty">
      <span v-if="result.success">恭喜通关</span>
      <span v-if="result.error">有错误</span>
    </template>
  </div>
  <div class="info" v-else>
    <span>Wait Start</span>
  </div>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      default: function() {
        return { total: 0, empty: 0, error: null, success: null };
      },
      required: false
    },
    start: {
      type: Boolean,
      default: false,
      required: true
    }
  }
};

</script>

<style lang="scss" scoped>
.info {
  position: absolute;
  left: 120px;
  top: 0px;
  font-size: 18px;
  font-weight: bold;
  color: #228cbd;
}
</style>