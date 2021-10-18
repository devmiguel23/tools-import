<template>
  <v-app>
    <v-sistem-bar title="Herramientas JJ" />
    <v-app-bar app dense color="primary" dark>
      <v-app-bar-title>Herramienta - Importadora J y J</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <footer-component title="Herramientas JJ" />
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {
    VSistemBar: () => import("@/components/SistemBarComponent.vue"),
    FooterComponent: () => import("@/components/FooterComponent.vue"),
  },
  data: () => ({
    //
  }),
};
</script>
