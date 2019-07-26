<template>
  <v-app>
    <v-toolbar app>
      <v-avatar>
        <img src="./assets/icon.png" alt="Bolsonaro" />
      </v-avatar>
      <h6 class="title"> Bolsômetro</h6>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout row wrap m-4>
          <v-flex xs12 sm6>
            <h1 class="header pt-4">Tempo</h1>
            <h1 class="title">Restante</h1>
            <v-layout row wrap>
              <v-flex>
                <h1 class="display-4 teal--text text-xs-center pt-5">
                  {{days}}
                  <span class="display-1">dias</span>
                </h1>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex>
                <h1 class="display-2 teal--text text-xs-center">
                  {{hours}}
                  <small>h</small>
                  {{minutes}}
                  <small>m</small>
                  {{seconds}}
                  <small>s</small>
                </h1>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <h1 class="title pt-5">Passado</h1>
                <h1 class="display-4 red--text text-xs-center pt-5">
                  {{daysPassed}}
                  <span class="display-1">dias</span>
                </h1>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm6>
            <h1 class="header pt-4">Pesquisa</h1>
            <p>
              Quando você acha que
              <b>Bolsonaro</b> deixa a presidência?
              <data-picker @voted="rebuild" />
            </p>
            <canvas id="myChart" width="400" height="200"></canvas>
          </v-flex>
        </v-layout>
        <br />
        <v-divider></v-divider>
        <br />
        <v-layout>
          <v-flex>
            <h1 class="header pt-4">Notícias</h1>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-timeline aling-top dense v-if="$vuetify.breakpoint.smAndDown">
            <v-timeline-item v-for="(post, i) in news" :key="i" :color="post.color" small>
              <div class="py-3">
                <p :class="`headline font-weight-bold ${post.color}--text`" v-text="post.date"></p>
                <a :href="post.link" target="_blank">
                  <h2 :class="`headline font-weight-light mb-3 ${post.color}--text`">{{post.title}}</h2>
                </a>
                <p>{{post.text}}</p>
                <p class="caption">Fonte: {{post.font}}</p>
              </div>
            </v-timeline-item>
          </v-timeline>
          <v-timeline aling-top v-if="!$vuetify.breakpoint.smAndDown">
            <v-timeline-item v-for="(post, i) in news" :key="i" :color="post.color" small>
              <template v-slot:opposite>
                <span :class="`headline font-weight-bold ${post.color}--text`" v-text="post.date"></span>
              </template>
              <div class="py-3">
                <a :href="post.link" target="_blank">
                  <h2 :class="`headline font-weight-light mb-3 ${post.color}--text`">{{post.title}}</h2>
                </a>
                <p>{{post.text}}</p>
                <p class="caption">Fonte: {{post.font}}</p>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { setInterval } from "timers";
import Chart from "chart.js";
import DataPicker from "./components/DataPicker";
import moment from "moment";

export default {
  name: "app",
  components: {
    DataPicker
  },
  data: function() {
    return {
      daysPassed: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      chart: null,
      news: [
         {
          title:
            "Bolsonaro anuncia que quer dar fim à Ancine",
          text:
            "O presidente Jair Bolsonaro (PSL) anunciou, nesta quinta-feira 25, que buscará a extinção da Agência Nacional do Cinema (Ancine). A afirmação se deu em transmissão ao vivo em sua rede social.",
          link:
            "https://www.cartacapital.com.br/politica/bolsonaro-anuncia-que-quer-dar-fim-a-ancine",
          font: "Revista Forum",
          color: "red",
          date: "25/07/19"
        },
        {
          title:
            "Bolsonaro novamente transparece preconceito contra nordestinos e chama assessor de “pau de arara”",
          text:
            "Em vídeo divulgado pelo Twitter “Museu da Direita Histérica”, Bolsonaro aparece mais uma vez transparecendo preconceitos contra a população do Nordeste. Após áudio em que chama nordestinos de “paraíba”, ele debochou de assessor.",
          link:
            "https://revistaforum.com.br/bolsonaro-novamente-transparece-preconceito-contra-nordestinos-e-chama-assessor-de-pau-de-arara/",
          font: "Revista Forum",
          color: "blue",
          date: "22/07/19"
        },
        {
          title:
            "Bolsonaro diz que divulgação de dados sobre desmatamento prejudica o Brasil",
          text:
            "Dados do Inpe apontam que o desmatamento na Amazônia aumentou 88% em comparação com o ano passado. Presidente acusou o órgão de mentir e de estar 'agindo a serviço de uma ONG'. Ricardo Magnus Osório Galvão, diretor do Inpe, negou as acusações de Bolsonaro.",
          link:
            "https://g1.globo.com/politica/noticia/2019/07/21/bolsonaro-diz-que-divulgacao-de-dados-sobre-desmatamento-prejudica-o-brasil.ghtml",
          font: "G1",
          color: "orange",
          date: "21/07/19"
        },
        {
          title: "Daqueles governadores de ‘paraíba’, o pior é o do Maranhão",
          text:
            "Captada por microfones, uma declaração do presidente Jair Bolsonaro nesta sexta-feira (19) provocou reações dos governadores do Maranhão, Flávio Dino (PCdoB), e da Paraíba, João Azevêdo (PSB).",
          link:
            "https://ultimosegundo.ig.com.br/politica/2019-07-19/bolsonaro-em-vazamento-dos-governadores-de-paraiba-o-pior-e-o-do-maranhao.html",
          font: "Último Segundo - iG",
          color: "cyan",
          date: "19/07/19"
        }
      ]
    };
  },
  methods: {
    countdown() {
      setInterval(() => {
        let today = new Date();
        let sadDay = new Date(2019, 0, 1, 1);
        let bigDay = new Date(2023, 0, 1, 1);
        let msPerDay = 24 * 60 * 60 * 1000;
        let timeLeft = bigDay.getTime() - today.getTime();
        let timePassed = today.getTime() - sadDay.getTime();
        let e_daysLeft = timeLeft / msPerDay;
        let e_daysPassed = timePassed / msPerDay;
        let e_hrsLeft = (e_daysLeft - this.days) * 24;
        this.daysPassed = Math.floor(e_daysPassed);
        this.days = Math.floor(e_daysLeft);
        this.hours = this.minTwoDigits(Math.floor(e_hrsLeft));
        this.minutes = this.minTwoDigits(
          Math.floor((e_hrsLeft - this.hours) * 60)
        );
        this.seconds = this.minTwoDigits(Math.floor(timeLeft / 1000) % 60);
      }, 1000);
    },
    minTwoDigits(n) {
      return (n < 10 ? "0" : "") + n;
    },
    rebuild() {
      this.chart.destroy();
      this.chartjs();
    },
    chartjs() {
      fetch("https://us-central1-bolsometro-82ae5.cloudfunctions.net/votes")
        .then(response => {
          return response.json();
        })
        .then(json => {
          let { length, docs } = json;
          let labels = [];
          let data = [];
          let backgroundColor = [];
          let borderColor = [];
          Object.keys(docs).forEach(element => {
            labels.push(moment(element).format("MMM/YY"));
            data.push(docs[element]);
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            backgroundColor.push("rgba(" + r + "," + g + "," + b + ",0.2)");
            borderColor.push("rgba(" + r + "," + g + "," + b + ",1)");
          });
          var ctx = document.getElementById("myChart").getContext("2d");
          this.chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: `${length} votos`,
                  data: data,
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                  borderWidth: 1
                }
              ]
            },
            options: {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              }
            }
          });
        })
        .catch(e => {
          return e;
        });
    }
  },
  mounted() {
    this.countdown();
    this.chartjs();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a {
  text-decoration: none;
}
</style>
