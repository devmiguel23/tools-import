<template>
  <v-container>
    <v-card class="pa-4">
      <v-data-table
        @dblclick:row="onAddProductItem"
        :headers="headers"
        :items="desserts"
        dense
        hide-default-footer
        :items-per-page="255"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Listado</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <div class="d-flex align-top">
                  <div style="width: 200px">
                    <v-file-input
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      prepend-icon="mdi-microsoft-excel"
                      label="Importar Excel"
                      v-model="fileInput"
                      @change="readExcel"
                      hide-details
                      small-chips
                      single-line
                      solo
                      dense
                    ></v-file-input>
                  </div>
                  <v-btn
                    @click="imprimir"
                    color="success"
                    dark
                    class="mx-2 mb-2"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                  <v-btn
                    color="info"
                    dark
                    class="mx-2 mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Agregar uno Nuevo
                  </v-btn>
                </div>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Nombre del Producto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.price"
                          label="Precio"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.quantity"
                          label="Cantidad de Etiquetas"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data> No hay datos </template>
      </v-data-table>
    </v-card>
    <!-- <div id="printing">
      <h1>Hola mundo</h1>
    </div> -->
  </v-container>
</template>

<script>
import PHE from "print-html-element";
import readXlsxFile from "read-excel-file";
export default {
  name: "Home",
  data: () => ({
    fileInput: null,
    dialog: false,
    headers: [
      {
        text: "Nombre del Producto",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Precio", value: "price" },
      { text: "Cantidad Etiqueta", value: "quantity" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      price: 0,
      quantity: 0,
    },
    defaultItem: {
      name: "",
      price: 0,
      quantity: 0,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Articulo" : "Editar Articulo";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    onAddProductItem(_, { item }) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.desserts.splice(this.editedIndex, 1);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },

    readExcel() {
      readXlsxFile(this.fileInput).then((rows) => {
        rows.forEach((el) => {
          this.desserts.push({ name: el[0], price: el[1], quantity: el[2] });
        });
      });
    },
    async imprimir() {
      await PHE.printHtml(
        "<div style='display: flex; align-items: center; flex-direction: column; flex-wrap: wrap; margin-left: -40px; margin: 0px; padding: 0px 0px 0px 0px'><h1 style='margin: 0px; margin-bottom: 0px; padding: 0px 0px 0px 0px'>$ 76.70</h1><span style='font-size:18px;text-transform: uppercase; margin: 0px; padding: 0px 0px 0px 0px 0px; text-align: center'>ns hae mul tang myun 125g</span></div>"
      );

      console.log("imprimir");
    },
  },
};
</script>
