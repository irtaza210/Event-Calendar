
/* * * * * * * * * * * * * * * * * * * *\
 *               Module 4              *
 *      Calendar Helper Functions      *
 *                                     *
 *        by Shane Carr '15 (TA)       *
 *  Washington University in St. Louis *
 *    Department of Computer Science   *
 *               CSE 330S              *
 *                                     *
 *      Last Update: October 2017      *
\* * * * * * * * * * * * * * * * * * * */

(function () {
	"use strict";
	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
	Date.prototype.deltaDays = function (n) {
		// relies on the Date object to automatically wrap between months for us
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
	};
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
	"use strict";

	this.sunday = initial_d.getSunday();
		
	
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	
	this.getDates = function () {
		var dates = [];
		for(var i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
	"use strict";
	this.year = year;
	this.month = month;
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	
	this.getWeeks = function () {
		var firstDay = this.getDateObject(1);
		var lastDay = this.nextMonth().getDateObject(0);
		
		var weeks = [];
		var currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
}
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthrn = new Month(2021, 4);
function displaycalendar() {
  let datern=new Date();
  var emptydays = 0;
  for (var i=0; i<monthrn.getWeeks().length; i++){
    for (var j=0; j< monthrn.getWeeks()[i].getDates().length; j++) {
      if (monthrn.getWeeks()[i].getDates()[j].getMonth() != monthrn.month) {
		// counting the number of empty days in each month i.e. boxes with no values in them
        emptydays++;
      } 
      else {
        break;
      }
    }
  }
  // displaying the calendar in grid/card view. we learnt the techniques of displaying using this video: https://www.youtube.com/watch?v=m9OSBJaQTlM
  // and then implemented it in our own style using the calendar functions given on the 330 wiki
  const daysInMonth = new Date(datern.getFullYear(), monthrn.month + 1, 0).getDate();
  console.log(daysInMonth);
  document.getElementById('monthrn').innerText = months[monthrn.month] +' '+ monthrn.year;
  document.getElementById('calendar').innerHTML = '';
  for (let i =1; i<=emptydays; i++) {
    const paddingsquare = document.createElement('div');
    paddingsquare.classList.add('day');
    paddingsquare.classList.add('padding');
    console.log(paddingsquare);
    document.getElementById('calendar').appendChild(paddingsquare);
  }
  console.log(monthrn.month + "has" + daysInMonth);
  for (let i = emptydays+1; i <= daysInMonth+emptydays; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    daySquare.innerText = i - emptydays;
    if (i-emptydays == datern.getDate() && monthrn.month==4 && monthrn.year==2021) {
      daySquare.id = 'dayrn';
    }
    console.log(i);
    document.getElementById('calendar').appendChild(daySquare);
  }
  
}
// citation end


document.getElementById("nextButton").addEventListener("click", nextmonth, false);
document.getElementById("backButton").addEventListener("click", previousmonth, false);
function nextmonth() {
  monthrn = monthrn.nextMonth();
  displaycalendar();
}
function previousmonth() {
  monthrn = monthrn.prevMonth();
  displaycalendar();
}
displaycalendar();
