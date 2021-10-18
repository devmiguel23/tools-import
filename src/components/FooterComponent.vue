<template>
  <v-footer color="primary while--text" dark app>
    <div class="caption">
      &copy; {{ new Date().getFullYear() }} <span v-text="title"></span>,
      <span v-text="versionApp"></span>
    </div>
    <v-spacer></v-spacer>
    <span class="caption" v-text="message"></span>
  </v-footer>
</template>
<script>
import { ipcRenderer } from "electron";
export default {
  name: "Footer",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  components: {},
  data: () => ({
    versionApp: null,
    message: null,
  }),
  created() {
    this.autoUpdate();
    this.version();
  },
  methods: {
    autoUpdate() {
      ipcRenderer.on("message", (event, text) => {
        this.message = text;
      });
    },
    version() {
      ipcRenderer.send("app_version");
      ipcRenderer.on("app_version", (event, arg) => {
        this.versionApp = `Versión ${arg.version}`;
      });
    },
  },
};
</script>