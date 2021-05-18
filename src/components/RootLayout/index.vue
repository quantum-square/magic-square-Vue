<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline" :v-model="select_key" @click="select">
        <a-sub-menu key="sudoku">
          <span slot="title"><a-icon type="pie-chart"/><span>Sudoku</span></span>
          <a-menu-item key="Sudoku Game">
            Game
          </a-menu-item>
          <a-menu-item key="Sudoku Rule">
            Rule
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="magic">
          <span slot="title"><a-icon type="appstore-o"/><span>Magic Square</span></span>
          <a-menu-item key="Magic Game">
            Game
          </a-menu-item>
          <a-menu-item key="Magic Rule">
            Rule
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{ $route.name }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view
              class="home-con"
              :default-active="$route.path"
          ></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Matrix Puzzle Solver ©2021
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  name: "index",
  data() {
    return {
      collapsed: false,
      select_key: '1'
    };
  },

  methods: {
    select({item, key, selectedKeys}) { // 选中项
      this.select_key = key;
      if (this.$router.currentRoute.name === key) {
        return;
      }
      switch (key) {
        case "Sudoku Game":
          this.$router.push({path: "/"});
          break;
        case "Sudoku Rule":
          this.$router.push({path: "/sudoku-rule"});
          break;
        case "Magic Game":
          this.$router.replace({path: "/magic"});
          break;
        case "Magic Rule":
          this.$router.push({path: "/magic-rule"});
          break;
        default:
          console.log("Error");
      }
    }
  }
};

</script>

<style>
</style>