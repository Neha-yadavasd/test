'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
 movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/*const displayMovements =function(movements){

  containerMovements.innerHTML='';
  movements.forEach(function(mov, i){
    const type = mov > 0 ? 'deposite' : 'withdrwal';

    const html=`
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1}${type}</div>
    <div class="movements__value">${mov}</div>
  </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin',html);
  });
};
displayMovements(account1.movements);*/

const displayMovements = function(movements,sort=false){
  containerMovements.innerHTML='';

  const movs= sort ? movements.slice().sort((a,b)=>a-b):movements;

  movs.forEach(function(mov,i){
const type=mov>0?'deposit':'withdrawal';
const html=`  <div class="movements__row">
<div class="movements__type movements__type--${type}">${i+1}${type}</div>
<div class="movements__value">${mov}💲</div>
</div>`;
containerMovements.insertAdjacentHTML('afterbegin',html);
  });
};

// convert eur in dollar
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd= 1.1;
//const movementsUSD=movements.map(function(mov){
 // return mov*eurToUsd;
//});
/*const movementsUSD=movements.map(mov=>mov*eurToUsd);
console.log(movements);
console.log(movementsUSD);

const movementsUSDfor=[];
for( const mov of movements) movementsUSDfor.push(mov*eurToUsd);
console.log(movementsUSDfor);

const movmentsDescription = movements.map((mov,i,arr) =>{
  if(  mov>0){
    return`Movment ${i+1}: you  deposited${mov}`;
  }else{
    return`Movment ${i+1}:  you Withdrew ${Math.abs(mov)}`;
  }

})
console.log(movmentsDescription);*/

const calcDisplayBalance= function(acc){
acc.balance=acc.movements.reduce((acc,mov)=>acc+mov,0);
 labelBalance.textContent=`${acc.balance} 💲`;
}

const calcDisplaySummary= function(acc){
const incomes= acc.movements.filter(mov=>mov>0).
reduce((acc,mov)=>acc+mov,0);
labelSumIn.textContent=`${incomes}💲`

const out= acc.movements.filter(mov=>mov<0).
reduce((acc,mov)=> (acc+mov),0);
labelSumOut.textContent=`${ Math.abs(out)}💲`;


const interest= acc.movements.filter(mov=>mov>0).
map(deposits=>(deposits*acc.interestRate)/100).
filter((int,i,arr)=>{
console.log(arr);
return int>=1;
})
.reduce((acc,int)=>acc+int,0);
labelSumInterest.textContent=`${interest}💲`
};
// map method in array
// map method create a new array username creation
const createUserName= function(accs){
  accs.forEach(function(acc){
    acc.username=acc.owner
    .toLowerCase()
    .split(' ')
    .map(name=>name[0])
    .join('');
  });
};
createUserName(accounts);


const updateUI=function(acc){
  //Display Movements
displayMovements(acc.movements);
//Display Balance
calcDisplayBalance(acc);
//Display Summary
calcDisplaySummary(acc);
}



// Event Handler
 let currentAccount;
btnLogin.addEventListener( 'click' ,function(e)
{
  // preventForm  from Submmiting
  e.preventDefault();

  currentAccount =accounts.find(
    acc=>acc.username ===
    inputLoginUsername.value );
    console.log(currentAccount);

if(currentAccount?.pin === Number(inputLoginPin.value))
{
  //Display Ui Message
labelWelcome.textContent=`Welcome Back,
${currentAccount.owner.split(' ')[0]}`;
containerApp.style.opacity = 100;

// clear inputField
inputLoginUsername.value= inputLoginPin.value='';
inputLoginPin.blur();
//update UI
 updateUI(currentAccount);

}
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount= Number(inputTransferAmount.value);
  const receiverAcc= accounts.find(acc=>acc.username===
  inputTransferTo.value);
  inputTransferAmount.value=inputTransferTo.value='';
  
  if(amount>0
  && currentAccount.balance>=amount &&
    receiverAcc?.username !==currentAccount.username){
      // doing Transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      //update UI
 updateUI(currentAccount);
    }
  });

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1)){
    // AddMOvement
    currentAccount.movements.push(amount); 
    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value='';

});

  btnClose.addEventListener('click',function(e){
    e.preventDefault();
    if(inputCloseUsername.value===currentAccount.username
      && Number(inputClosePin.value)===currentAccount.pin){
      const index=accounts.findIndex
  (
acc=>acc.username === currentAccount.username
  );
  console.log(index);
// Delelet Accounts
accounts.splice(index,1);
//Hide UI
containerApp.style.opacity = 0;
      }
      inputCloseUsername.value= inputClosePin.value='';
  });
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted=!sorted;
});

//every 
//console.log(account4.movements.every(mov=>mov>0));

//console.log(accounts);
//filter method in array
// filter method create a new array after the filter out and check the condtion

/*const deposits=movements.filter(function(mov,i,arr){
  return mov>0;
});
console.log(movements);
console.log(deposits);

const depositeFor=[];
for(const mov of movements) if(mov>0)depositeFor.push(mov);
console.log(depositeFor);
const withdrawals= movements.filter(mov=>mov<0);
console.log(withdrawals);*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);*/

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


//reduce method
// reduce method add all the elements
//accumulater --> snowball
/*const balance= movements.reduce( function(acc, curr,i,arr){
  console.log(`Iteration ${i}:${acc}`);
  return acc+curr;
},0);
console.log(balance);*//*
const balance= movements.reduce((acc,curr)=>acc+curr,0);
console.log( balance);

 let balance2=0;
 for(const mov of movements) balance2+=mov;
 console.log(balance2);

 //Maximum values
 const max= movements.reduce((acc,mov)=>{
  if(acc>mov) return acc;
  else return mov;
 },movements[0]);
 console.log(max);

// find method :- the goal of find method is find only one elemenet we setup the condtion
//where only one condition is statisfies;

const firstWithdrawal= movements.find(mov=> mov<0);
console.log(movements);
console.log(firstWithdrawal);
console.log(accounts);
const account= accounts.find(acc=>acc.owner==='Jessica Davis');
console.log(account);*/

 // Array Method practices
//1
 const bankDepositSum= accounts.flatMap(acc=>acc.movements)
.filter(mov=>mov>0).reduce((sum,curr)=>sum+curr,0)
console.log(bankDepositSum);
//2
const numDeposite1000=accounts.flatMap(acc=>acc.movements).
filter(mov=>mov>=1000).length
console.log(numDeposite1000);
// prefix operator
let a=10;
console.log(++a);
console.log(a);


//3
const sum=accounts.flatMap(acc=>acc.movements).
reduce((sum,curr)=>{
  curr>0?(sum.deposits+=curr):(sum.withdraws+=curr);
  return sum;
},
{deposits:0,withdraws:0}
);
console.log(sum);