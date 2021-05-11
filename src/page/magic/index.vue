<template>
  <div id="together" class="wrap">
    <div class="mean">
      <a-row>
        <a-col :span="5">
          <a-button
              type="primary"
              :disabled="start"
              size="small"
              @click="handleStartClick"
          >Start
          </a-button
          >
          <a-button
              type="primary"
              :disabled="!start"
              size="small"
              @click="handleEndClick"
          >End
          </a-button
          >
        </a-col>

        <a-col :span="5">
          <a-radio-group
              size="small"
              buttonStyle="solid"
              v-model="config.level"
              :disabled="start"
              @change="handleChange"
          >
            <a-radio-button value="1">Easy</a-radio-button>
            <a-radio-button value="2">Normal</a-radio-button>
            <a-radio-button value="3">Hard</a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col :span="5">
          <span>Dimension </span>
          <a-input-number :disabled="start" :default-value="dimension.value" size="small" :min="0" :max="20"
                          @change="handleDimensionChange"/>
        </a-col>
        <a-col :span="5">
          <span>Solver </span>
          <a-switch :defaultChecked="solver" @change="onChangeSolver"/>
        </a-col>
      </a-row>
    </div>
    <br/>
    <Magic :config="config" :start="start" :stopped="stopped" :solver="solver" :dimension="dimension.value"
           :showMouseHover="showMouseHover"/>

    <a-space direction="vertical" class="buttonsBar">
      <a-button :disabled="start" type="primary" class="paper-btn" @click="handleLoad">
        Load
      </a-button>
      <br/>
      <a-button type="primary" class="paper-btn" @click="handleSave">
        Save
      </a-button>
      <br/>
      <a-button :disabled="!start||!stopped" type="primary" class="paper-btn" @click="handleContinue">
        Continue
      </a-button>
      <br/>
      <a-button :disabled="!start||stopped" type="primary" class="paper-btn" @click="handleStop">
        Stop
      </a-button>
      <br/>
      <a-button :disabled="!start||!solver" type="primary" class="paper-btn" @click="handleFix">
        Fix
      </a-button>
    </a-space>
  </div>
</template>

<script>
import Magic from "../../components/Magic";

function validateDimensionNumber(number) {
  if (0 <= number && number <= 20) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: 'The dimension must be between 0 and 20',
  };
}

export default {
  name: "App",
  components: {
    Magic
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
      dimension: {
        value: 11,
      },
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
    onChangeSolver(value) {
      this.solver = value;
    },
    handleStartClick() {
      this.start = true;
      this.stopped = false;
    },
    handleEndClick() {
      this.start = false;
      this.stopped = true;
    },
    handleLoad() {
      // this.start = false;
    },
    handleSave() {
      // this.start = false;
    },
    handleContinue() {
      if (this.start) {
        this.stopped = false;
      } else {
        this.stopped = true;
      }
    },
    handleStop() {
      this.stopped = true;
    },
    handleFix() {
    },

    handleDimensionChange(value) {
      this.dimension = {
        ...validateDimensionNumber(value),
        value,
      };
    },
  }
};
</script>
<style lang="scss" scoped>
#together {
}


.mean {
  padding: 20px;
  width: 100%;
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