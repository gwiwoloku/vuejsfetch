const url = "https://blockchain.info/ticker";

const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    currencies:[],
    countDown: 5,
    lastUpdated : null,
    activeItem: 'home'
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.getExchangeData();
    setInterval(() => {
      if(this.countDown === 0) {
        this.countDown = 5
        this.getExchangeData()
      } else if(this.countDown > 0)this.countDown -= 1
    }, 1000)
  },
  methods: {
    getNow: function() {
      const today = new Date();
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.lastUpdated = date +' '+ time;
    },
    getExchangeData() {
      axios.get(url).then(response => {
        if(!response.ok){
          throw new Error('Generic error')
        }
        return response.data;
      }).then(response => {
        this.getNow();
        this.results = response;
        // Adding all charCodes to currency array
        for (let currency in this.results) {
          this.currencies.push(currency)
        }
      });
    },
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    }
  }
});
