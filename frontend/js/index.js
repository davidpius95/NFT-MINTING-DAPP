
"use strict";

let web3n
 let finalAmount
 
 

const sendEthButton = document.querySelector('#sendEthButton');

$('.mintBtn').hide()
let currenctEthPrice = 0.07
let totalAmount = currenctEthPrice

$('#amount').text(currenctEthPrice)

 

 const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

 let web3Modal

 let provider;


 let selectedAccount;
 
function init() {

  console.log("Initializing example");
  

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
   });

}


sendEthButton.addEventListener('click', async () => {
  
    let quantity = $('#noOfRoom'),
    value = quantity.val();
    finalAmount = totalAmount
    finalAmount = web3n.utils.toWei(totalAmount.toString(), 'ether')    
    const contract = await getContract(web3n)
        console.log(contract);
      await contract.methods.mint(value).send({from:selectedAccount,value: finalAmount}).then(res => {
        console.log(res);
       
      }).catch(err => {
        console.log(err);
      })
    

});

const getContract = async (web3) => {
  let contract
  const data = await $.getJSON("abi.json");
  contract = new web3.eth.Contract(
        data,
        '0xe6036135BdCDFf2e27A910AA6fc7f4fB6d75455E'
      );
      return contract
};


 
async function fetchAccountData() {

   const web3 = new Web3(provider);
    web3n  = web3
  console.log("Web3 instance is", web3);
  $('.mintBtn').show()

   const chainId = await web3.eth.getChainId();
 
   const accounts = await web3.eth.getAccounts();

   console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  document.querySelector("#selected-account").textContent = selectedAccount;

 
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
 
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
  
   });
 
  await Promise.all(rowResolvers);

   document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}

 
async function refreshAccountData() {
 
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

 
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


 
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

   provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

   provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

   provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}



$(function(){

    $('#adds').on('click',add);
    $('#subs').on('click',remove);
  
  });
  
  
  function add(){
  
    var input = $('#noOfRoom'),
        value = input.val();
        
    input.val(++value);
    console.log(value * currenctEthPrice);
    totalAmount = value * currenctEthPrice
    $('#amount').text(value * currenctEthPrice)
    if(value > 1){
      $('#subs').removeAttr('disabled');
    }
  
  }
  
  
  function remove(){
  debugger
     var input = $('#noOfRoom'),
         value = input.val();
        
     if(value > 1){
        if(value == '1'){
            totalAmount = currenctEthPrice
        }
        totalAmount = totalAmount - currenctEthPrice
        $('#amount').text(totalAmount.toFixed(2))

       input.val(--value);
       if(value == '1'){
        $('#subs').attr('disabled','disabled');
       }
     }
  
  }
 
async function onDisconnect() {
    $('.mintBtn').hide()

  console.log("Killing the wallet connection", provider);

   if(provider.close) {
    await provider.close();
 
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

   document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

 
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});