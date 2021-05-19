<template>
  <div id="together" class="wrap">
    <div class="mean">
      <a-row>
        <a-col :span="6">
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
    <Sudoku :config="config" :start="start" :stopped="stopped" :solver="solver" :showMouseHover="showMouseHover"/>
    <a-space direction="vertical" class="buttonsBar">
      <a-upload
          name="file"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :headers="headers"
          :file-list="fileList"
          :disabled="start"
          @change="handleLoadChange"
      >
        <a-button :disabled="start" type="primary" class="paper-btn">
          Upload
        </a-button>
      </a-upload>
      <br/>
      <a-button type="primary" :disabled="!stopped" class="paper-btn" @click="handleSave">
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
import Sudoku from "../../components/Sudoku";

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
    handleLoadChange(info) {
      let fileList = [...info.fileList];

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1);

      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });

      this.fileList = fileList;
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }

    },
    handleSave() {
      fetch('https://img-blog.csdnimg.cn/20181219151114979.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjQ4MTIzNA==,size_16,color_FFFFFF,t_70').then(res => res.blob()).then(blob => {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = 'myfile';
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
      this.$message.warn("Download Log");
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