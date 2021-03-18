App = {
    loading: false,
    contracts: {},
    load: async () => {
      await App.loadWeb3()
      await App.loadContract()
      await App.checkLogin()
      await App.getList()

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

    getList: async () =>{
      const user = parseInt(localStorage.account)
      const task = await App.appVariable.accounts(user)

      const count = task[4].toNumber()
      console.log(count)
      for(var i = count - 1;i >= 0;i--)
      {
        const r = await App.appVariable.getRole(user,i)
        const s = await App.appVariable.getSender(user,i)
        const rc = await App.appVariable.getRecipient(user,i)
        const a = await App.appVariable.getAmount(user,i)

        const sender = s.toNumber()
        const recipient = rc.toNumber()
        const amount = a.toNumber()
        const role = r
        var makeup = "<tr> <td>" +role+"</td><td>"+sender+"</td><td>"+recipient+"</td><td>"+ amount+"</td> <tr>";
        $('#list').append(makeup)
      }  
    },

    
    
  }

  $(() => {
    $(window).load(() => {
      App.load()
    })
  })