const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    currencies:[],
    countDown: 5,
    lastUpdated : null,
    activeItem: 'home',
    mainUrl: 'https://blockchain.info/ticker',
    showError: false,
    converter: {
      requestType: 0,
      amount: 0,
      result:0,
      baseCurrency:'BTC',
      to: 'USD',
      canSubmit: false,
    }
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
    getNow() {
      const today = new Date();
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.lastUpdated = date +' '+ time;
    },
    async getExchangeData() {
      let result = await this.fetchData(this.mainUrl);

      if(!result) {
        //generic error
        return false;
      }

        this.getNow();
        this.results = result;
        // Adding all charCodes to currency array
        for (let currency in this.results) {
          this.currencies.push(currency)
        }

      // axios.get(this.mainUrl).then(response => {
      //   if(response.status !== 200){
      //     throw new Error('Generic error')
      //   }
      //   return response.data;
      // }).then(response => {
      //   this.getNow();
      //   this.results = response;
      //   // Adding all charCodes to currency array
      //   for (let currency in this.results) {
      //     this.currencies.push(currency)
      //   }
      // }).catch(error => {
      //   console.log(error);
      // });
    },
    isActive(menuItem) {
      return this.activeItem === menuItem
    },
    setActive(menuItem){
      this.activeItem = menuItem
    },
    async processForm() {
      //reset error
      this.error = false;

      //check if form is submittable
      if(!this.isSubmittable) {
        return this.error = true;
      }

      let result = await this.fetchData(`${this.mainUrl}/tobtc?currency=${this.converter.to}&value=${this.converter.amount}`);

      if(!result) {
        return this.error = true;
      }

      return this.converter.result = result;



      //make api request
      // axios.get(`${this.mainUrl}/tobtc?currency=${this.converter.to}&value=${this.converter.amount}`).then(response => {
      //   if(response.status !== 200){
      //     throw new Error('Generic error')
      //   }
      //   return response.data;
      // }).then(response => {
      //    this.converter.result = response;
      // }).catch(error => {
      //   this.showError = true;
      //   console.log(error);
      // });
    },
    async fetchData (url) {
    return axios.get(url).then(response => {
      if(response.status !== 200){
        throw new Error('Generic error')
      }
      return response.data;
    }).then(response => {
      return response;
    }).catch(error => {
      return false
      console.log(error);
    });
  }

  },
  computed: {
    amountIsNumber() {
      return !isNaN(this.converter.amount);
    },
    isAcceptableValue() {
      return this.converter.amount > 0 && this.converter.amount <= 1000000;
    },
    isSupportedCurrency() {
      return this.currencies.includes(this.converter.to);
    },
    isSubmittable() {
      return this.amountIsNumber && this.isAcceptableValue && this.isSupportedCurrency;
    },
    isErrorVisible() {
      return !this.amountIsNumber || !this.isSupportedCurrency || !this.isAcceptableValue || this.error;
    },
  }
});
