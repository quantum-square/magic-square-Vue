<template>
  <div className="timer">
    <div ref="startTimer"></div>
  </div>
</template>

<script>
export default {
  name: "Timer",
  data() {
    return {
      timer: "",
      content: "",
      hour: 0,
      minutes: 0,
      seconds: 0,
      millisecond: 0
    };
  },
  props: {
    result: {
      type: Object,
      default: function () {
        return {total: 0, empty: 0, error: null, success: null};
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
    }
  },
  watch: {
    result: {
      handler: function (newValue) {
        console.log("handler", newValue);
        if (newValue.success) this.pause();
        else if (this.stopped) this.pause();
        else this.action();
        // this.switchState();
      },
      deep: true
    },
    start(val) {
      console.log("start", val);
      // this.switchState();
      if (val === true) {
        this.action();
      } else {
        this.reset();
      }
    },
    stopped(val) {
      console.log("stopped", val);
      if (val === true) {
        this.pause();
      } else {
        this.action();
      }
      // this.switchState();
    }
  },
  created() {
  },
  destroyed() {
    this.reset();
  },
  methods: {
    switchState() {
      if (!this.start) {
        this.reset();
      } else {
        if (this.stopped) {
          this.pause();
        } else {
          if (this.result.success) {
            this.pause();
          } else {
            this.action();
          }
        }
      }
    },
    action() {
      console.log('action');
      if (this.timer) {
        return;
      }
      this.timer = setInterval(this.startTimer, 100);
    },
    pause() {
      console.log('pause');
      clearInterval(this.timer);
      this.timer = null;
    },
    reset() {
      clearInterval(this.timer);
      this.timer = null;

      if (this.$refs.startTimer != null) {
        this.$refs.startTimer.innerHTML = null;
      }
      this.hour = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.millisecond = 0;
    },
    startTimer() {
      this.millisecond += 1;
      if (this.millisecond >= 10) {
        this.millisecond = 0;
        this.seconds = this.seconds + 1;
      }

      if (this.seconds >= 60) {
        this.seconds = 0;
        this.minutes = this.minutes + 1;
      }

      if (this.minute >= 60) {
        this.minutes = 0;
        this.hour = this.hour + 1;
      }
      this.$refs.startTimer.innerHTML =
          (this.hour < 10 ? "0" + this.hour : this.hour) +
          ":" +
          (this.minutes < 10 ? "0" + this.minutes : this.minutes) +
          ":" +
          (this.seconds < 10 ? "0" + this.seconds : this.seconds) +
          "." +
          (this.millisecond < 10 ? this.millisecond : this.millisecond) +
          parseInt(Math.random() * 10) + "0";
    }
  }
};
</script>
<style lang="scss" scoped>
.timer {
  padding-left: 40px;
}
</style>
