


// ADD THE SCRIPT TO GET THE DATE ACTUAL DAY IN INDEX.EJS 

$(window).scroll(function () {
  $(".scroll-down").css("opacity", 1 - $(window).scrollTop() / 200);
});

/*TIME SHOW */

var clock = new Vue({
  el: '#clock',
  data: {
      time: '',
      date: ''
  }
});

var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var timerID = setInterval(updateTime, 1000);
updateTime();
function updateTime() {
  var cd = new Date();
  clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
  clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
};

function zeroPadding(num, digit) {
  var zero = '';
  for(var i = 0; i < digit; i++) {
      zero += '0';
  }
  return (zero + num).slice(-digit);
}

//The focus the cursor in the search bar

document.getElementById("realbox").focus();
document.getElementById("realbox").select();


/*//Context no selecction no RIGHT CLICK
document.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);*/
