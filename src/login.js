App = {
    loading: false,
    contracts: {},
    load: async () => {
      await App.loadWeb3()
      await App.loadContract()

    },
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          await ethereum.enable()
          web3.eth.sendTransaction({/* ... */ })
        } catch (error) {
        }
      }
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        web3.eth.sendTransaction({/* ... */ })
      }
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
    
    loadAccount: async () => {
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      const bank = await $.getJSON('Bank.json')
      App.contracts.Bank = TruffleContract(bank)
      App.contracts.Bank.setProvider(App.web3Provider)
  
      App.appVariable = await App.contracts.Bank.deployed()

     
    },


    logIn: async () => {
      var usr= $('#username').val()
      const pwd = $('#password').val()
      const user = parseInt(usr)
      const value = await App.appVariable.loginAuthenticate(user,pwd);
      console.log(value)
      const truth = parseInt(value)
      try{
        if(truth == 1){
          localStorage.account = usr
          localStorage.login = "1"
          window.location.href = "dashboard.html"
        }
        else{
          throw 'Invalid Username or Password';
        }
      }
      catch(error)
      {
        alert(error)
      }
    },

    
    
  }

  $(() => {
    $(window).load(() => {
      App.load()
    })
  })