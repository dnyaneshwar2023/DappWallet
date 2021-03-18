App = {
    loading: false,
    contracts: {},
    load: async () => {
      await App.loadWeb3()
      await App.loadContract()
      await App.checkLogin()

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
    
    checkLogin: async () =>{

      value = parseInt(localStorage.login)

      if(value == 0)
      {
        await alert('You are not logged in !!')
        window.location.href = "login.html"
      }
      const u = localStorage.account;
      const user = parseInt(u)
      const b = await App.appVariable.getBalance(user)
      const balance = b.toNumber();

      $('#bal').html(balance)


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


    SendMoney: async () => {
      console.log(localStorage.account)
      
      const sender = parseInt(localStorage.account)  
      const receiver = $('#to').val()
      const amount = $('#amount').val()
      await App.appVariable.sendMoney(sender,receiver,amount);
      alert('Transaction Successful !!')
    },

    
    
    
  }

  $(() => {
    $(window).load(() => {
      App.load()
    })
  })