<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        lazy
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <div>
            <v-btn v-on="on" color="error">Participar</v-btn>
          </div>
        </template>
        <v-date-picker v-model="date" locale="pt-br" type="month" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="modal = false">Fechar</v-btn>
          <v-btn flat color="success" @click="vote">Votar</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: "DataPicker",
  data: () => ({
    date: new Date().toISOString().substr(0, 7),
    modal: false
  }),
  methods: {
    vote() {
      this.modal = false;
      let data = {
        date: this.date
      };
      fetch("https://us-central1-bolsometro-82ae5.cloudfunctions.net/vote", {
        method: "POST",
        mode: "no-cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          this.$emit('voted');
          return response;
        })
        .catch(e => {
          return console.log(e);
        });
    }
  }
};
</script>