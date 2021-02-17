const url = "https://blockchain.info/ticker";

const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    countDown: 5,
  },
  mounted() {

    axios.get(url).then(response => {
      this.results = response.data
    }).then(() => {
      setInterval(() => {
        if(this.countDown === 0) {
          this.countDown = 5
          axios.get(url).then(response => {
            this.results = response.data
          })
        } else if(this.countDown > 0)this.countDown -= 1
      }, 1000)
    });
  },
  method: {
    getData: function () {
      return axios.get(url).then(response => {
        this.results = response.data
      })
    }
  },
});
