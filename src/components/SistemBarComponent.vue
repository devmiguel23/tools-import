<template>
  <v-system-bar style="-webkit-app-region: drag" window app color="primary">
    <div class="d-flex align-center">
      <div>
        <v-img
          width="19"
          height="19"
          lazy-src="@/assets/logo/logo_96px.png"
          src="@/assets/logo/logo_96px.png"
        ></v-img>
      </div>
      <div
        class="mx-2 grey--text text--lighten-2 font-weight-normal"
        v-text="title"
      ></div>
    </div>
    <v-spacer></v-spacer>
    <v-btn
      @click="minimizeWindows"
      class="d-flex align-center pl-2 mx-1"
      small
      tile
      icon
      style="-webkit-app-region: no-drag"
    >
      <v-icon class="white--text">mdi-minus</v-icon>
    </v-btn>
    <v-btn
      style="-webkit-app-region: no-drag"
      @click="maximizeWindows"
      class="d-flex align-center pl-2 mx-1"
      small
      tile
      icon
    >
      <v-icon class="white--text">mdi-checkbox-blank-outline</v-icon>
    </v-btn>
    <v-btn
      style="-webkit-app-region: no-drag"
      @click="closeWindowsApp"
      class="d-flex align-center pl-2 mx-1"
      small
      tile
      icon
    >
      <v-icon class="white--text">mdi-close</v-icon>
    </v-btn>
  </v-system-bar>
</template>
<script>
import { ipcRenderer } from "electron";
export default {
  name: "Sistem-Bar",
  props: {
    title: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    //
  }),

  methods: {
    minimizeWindows() {
      ipcRenderer.send("MinimizeWindows");
    },
    maximizeWindows() {
      ipcRenderer.send("MaximizeWindows");
    },
    closeWindowsApp() {
      this.$swal
        .fire({
          title: "Esta seguro que quiere cerrar la aplicacion?",
          showCancelButton: true,
          confirmButtonText: "Si",
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            ipcRenderer.send("closeWindowsApp");
          }
        });
    },
  },
};
</script>