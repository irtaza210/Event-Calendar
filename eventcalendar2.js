var username;
var password;
var session_token;
var session_user;
// this function is used to check if an account exists of the user and if it does, it logs you in
function loginuser(event){
    event.preventDefault();
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    const data = {'username':username, 'password':password};
    fetch('login.php', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("You've been Logged In!");
            all.checked = "checked";
            ischecked();
            // only if user is logged in can they see and interact with addevent, addgroupevent, displayevent and eventcategory buttons.
            // also the login and signup buttons are hidden and the logout button is shown
            document.getElementById('login').style.display="none";
            document.getElementById('signup').style.display="none";
            document.getElementById("addevent").style.display="block";
		    document.getElementById('logoutbutton').style.display="block";
		    document.getElementById('groupevent').style.display="block";
            document.getElementById('displayevents').style.display="block";
            document.getElementById('categorybuttons').style.display="block";
            console.log("login success");
            session_token = data.token;
            session_user = data.username;
            ischecked();
        }
        else {
            alert(`Invalid Username or Password`);
        }
    })
    .catch(err => console.error(err));
}
document.getElementById("loginbutton").addEventListener("click",loginuser,false);

// this function is used to make an account for the user
function signupuser() {
    const username = document.getElementById("signupusername").value;
    const password = document.getElementById("signupassword").value;
    const data = {'username':username, 'password':password};
    fetch('signup.php', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(alert("Data recieved"))
    .then(data => {
        if (data.success) {
            alert("You've been registered, please log in!");
            console.log("register success");
        }
        else {
            alert(`Username or Password not valid`);
        }
    })
    .catch(err => console.error(err));
}
document.getElementById("signupbutton").addEventListener("click",signupuser,false);


// this function is used to make sure the user stays logged in upon refresh
document.addEventListener("DOMContentLoaded", checklogin, false);
function checklogin() {
    fetch("getuser.php", {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })
        .then(res => res.json())
        .then(data=>{
            if(data.success) {
                // only if user is logged in can they see and interact with addevent, addgroupevent, displayevent and eventcategory buttons.
            // also the login and signup buttons are hidden and the logout button is shown
                document.getElementById('login').style.display="none";
                document.getElementById('signup').style.display="none";
                document.getElementById('addevent').style.display="block";
		        document.getElementById('logoutbutton').style.display="block";
		        document.getElementById('groupevent').style.display="block";
                document.getElementById('displayevents').style.display="block";
                document.getElementById('categorybuttons').style.display="block";
                session_token = data.token;
                ischecked();
            }
            else {
                console.log("user not logged in");
            }
        })
        .then();
}

// if user is logged in, add event button is visible, and when clicked a form will then display to add event details
var addeventbutton = document.getElementById('addevent');
addeventbutton.addEventListener("click",showform,false);
function showform() {
    document.getElementById('addevents').style.display="block";
}

// this function is used to create an event in the calendar
function createEvent(event){
    event.preventDefault();
    const eventtitle = document.getElementById("eventtitle").value; 
    const eventdate = document.getElementById("eventdate").value;
    const eventtime = document.getElementById("eventtime").value;
    var eventcategory = document.getElementById("eventcategory").value;
    console.log(eventtitle);
    console.log(eventdate);
    console.log(eventtime);
    console.log(eventcategory);
    if (eventcategory.length == 0) {
        eventcategory = "None";
    }
    // event cannot be added if title, date, or time field are empty all are required
    if (eventtitle.length == 0 || eventdate.length == 0 || eventtime.length == 0) {
        alert(`Add Event Failed: title, date, and time are required`);
        document.getElementById('addevents').style.display = 'none';
        ischecked();
    }
    else {
        const data = {'eventtitle': eventtitle, 'eventdate': eventdate, 'eventtime': eventtime, 'eventcategory': eventcategory, 'token':session_token};
        fetch("createevent.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
            .then(response => response.text())
            .then(data => check = data)
            .then(()=>{
                console.log(check)
                if(check.includes("Add Success")){
                    alert("Event Added");
                    ischecked();
                }
            });
        ischecked();
        document.getElementById("addeventsform").reset();
        document.getElementById('addevents').style.display="none";
    }
}
document.getElementById("addeventbutton").addEventListener("click", createEvent, false); 
// if cancel event button is clicked, form is no longer shown
document.getElementById('canceleventbutton').addEventListener("click",hideform,false);
function hideform() {
    document.getElementById('addevents').style.display="none";
    document.getElementById("addeventsform").reset();
}


// creative feature: Users can create group events that display on multiple users calendars

// the user is asked what other group members they want in the group event, if they input a user that
// doesnt exist, they are notifed that the user doesnt exist, but the event is still added for all other valid
// users and the user themself.
function groupEvent(event) {
	event.preventDefault();
    const eventtitle = document.getElementById("groupeventtitle").value; 
    const eventdate = document.getElementById("groupeventdate").value;
	const eventtime = document.getElementById("groupeventtime").value;
    var eventcategory = document.getElementById("groupeventcategory").value
    // event cannot be added if title, date, or time field are empty all are required
    if (eventcategory.length == 0) {
        eventcategory = "None";
    }
    if (eventtitle.length == 0 || eventdate.length == 0 || eventtime.length == 0) {
        alert(`Add Group Event Failed: title, date, and time are required`);
        document.getElementById('groupevents').style.display = 'none';
        ischecked();
    }
    else {
        var group = prompt("How many additional group members","");
        var group_number= parseInt(group);
        for(var i = 0; i < group_number; i++){
            var member = prompt("Username of a group member","");
            const data = {'eventtitle': eventtitle, 'eventdate': eventdate, 'eventtime': eventtime, 'eventcategory': eventcategory, 'user':member, 'token':session_token};
            fetch("group_event.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
            .then(response => response.text())
            .then(data => check = data)
            .then(()=>{
                console.log(check)
                if(check.includes("User does not exist")){
                    alert("One or more users do not exist");
                    ischecked();
                }
            });
        }
    
        const data = {'eventtitle': eventtitle, 'eventdate': eventdate, 'eventtime': eventtime, 'eventcategory': eventcategory,'token':session_token};
        fetch("createevent.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
            .then(response => response.text())
            .then(data => check = data)
            .then(()=>{
                console.log(check)
                if(check.includes("Add Success")){
                    alert("Event Added");
                    ischecked();
                }
            });
        ischecked();
        document.getElementById("addgroupeventsform").reset();
        document.getElementById('groupevents').style.display="none";	
    }
}
document.getElementById("addgroupeventbutton").addEventListener("click", groupEvent, false);
// event listeners to display/hide group event input form when add group event button is clicked
var groupeventbutton = document.getElementById('groupevent');
groupeventbutton.addEventListener("click",showgroupform,false);
function showgroupform() {
    document.getElementById('groupevents').style.display="block";
}
var groupclosebutton = document.getElementById('cancelgroupeventbutton');
groupclosebutton.addEventListener("click",hidegroupform,false);
function hidegroupform() {
    document.getElementById('groupevents').style.display="none";
    document.getElementById("addgroupeventsform").reset();
}

// this function is used to delete an event
function deleteevent(event) {
    console.log(event.target.id);
    var eventid = event.target.id;
    var deleteidbeta = parseInt(eventid);
    var deleteidbeta2 = deleteidbeta/10;
    var deleteid = deleteidbeta2.toString();
    const data = {'deleteid':deleteid, 'token':session_token};
    fetch('deleteevents.php', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Delete success`);
            ischecked();
        }
        else {
            alert(`Delete failure`);
        }
    })
    .catch(err => console.error(err));
}

// this function is divided into two subfunctions. it used to edit an event. 
// the first event called editeventsfirst gets the id of the event the user wants to edit and then displays the edit form. the second function
// actually does the work by sending the edited data to the database and outputting a success or error message.
var editid;
function editEventsfirst(event) {
    var eventid = event.target.id;
    var editidbeta = parseInt(eventid);
    var editidbeta2 = editidbeta/100;
    editid = editidbeta2.toString();
    document.getElementById('editevents').style.display = 'block';
    
}
document.getElementById("editeventbutton").addEventListener("click", editEvents, false);
function editEvents(){
    const edittitle = document.getElementById("editeventtitle").value; 

    const editdate = document.getElementById("editeventdate").value;

    const edittime = document.getElementById("editeventtime").value;

    var editcategory = document.getElementById("editeventcategory").value
    if (editcategory.length == 0) {
        editcategory = "None";
    }
    //event cannot be edited if title, date, or time field are empty all are required
    if (edittitle.length == 0 || editdate.length == 0 || edittime.length == 0) {
        alert(`Edit Event Failed`);
        document.getElementById('editevents').style.display = 'none';
    }
    else {
        const data = {'editid': editid, 'edittitle': edittitle, 'editdate': editdate, 'edittime': edittime, 'editcategory': editcategory, 'token':session_token};
        fetch("editevents2.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
            .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Event Edited!`);
                ischecked();
            }
            else {
                alert(`Edit Event Failed`);
            }
        })
        .catch(err => alert(`Edit Event Failed`));
        ischecked();
        document.getElementById('editevents').style.display = 'none';
    }
}
document.getElementById('cancelediteventbutton').addEventListener("click", hideeditform, false);
function hideeditform() {
    document.getElementById('editevents').style.display = 'none';
}




// creative feature: Users can share their calendar with additional users. 
function shareevent(event) {
	console.log(event.target.id);
	var name = prompt("Please enter the username to share with", "");
    var shareid = event.target.id;
    var shareidbeta = parseInt(shareid);
    var shareidbeta2 = shareidbeta/1000;
    var shareid = shareidbeta2.toString();
    const data = {'shareid':shareid, 'name':name, 'token':session_token};
    if (name != null) {
        fetch('shareevents.php', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Event Shared!`);
                ischecked();
            }
            else {
                alert(`Share Event Failed`);
            }
        })
        // if user inputs a user that doesnt exist, output message is shown which tells them user doesnt exist
        .catch(err => alert(`Share Event Failed, user doesnt exist`));
    }
    // if no input is given in the prompt, share event failed message is output
    else {
        alert(`Share Event Failed`);
    }
}

// this function is used to display events of the user if theyre logged in
function displayEvent() {
    const data = {'token': session_token};
    $('#displayevents').find('tr:gt(0)').remove();
    fetch('fetchevents.php', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then((response) => {
        response.json()
        .then((data)=>{
            var html = "";
            for(var a = 0; a < data.length; a++) {
                var name1 = data[a].name;
                var day1 = data[a].date;
                var time = data[a].time;
                var id = data[a].id;
                var deleteid = id * 10;
                var editid = id*100;
                var shareid = id*1000;

                // displaying the events and delete, edit, share buttons
                html += "<tr>" + "<td>" + name1 + "</td>"+"<td>" + day1 + "</td>"+"<td>" + time.substring(0,5) + "</td>"+"</tr>";
                html+="<button class='deleteclass' id = '" + deleteid + "'>Delete Event</button>";
                html+="<button class='editclass' id = '" + editid + "'>Edit Event</button>";
                html+="<button class='shareclass' id = '" + shareid + "'>Share Event</button>";  
            }
            document.getElementById("data").innerHTML = "";
            document.getElementById("data").innerHTML += html;
            var deleteclassarray = Array.from(document.getElementsByClassName('deleteclass'));
            var editclassarray = Array.from(document.getElementsByClassName('editclass'));
            var shareclassarray = Array.from(document.getElementsByClassName('shareclass'));
            // adding event listeners for each delete, edit, share button
            for (var i=0; i<deleteclassarray.length; i++) {
                deleteclassarray[i].addEventListener("click", deleteevent, false);
            }
            for (var i=0; i<editclassarray.length; i++) {
                editclassarray[i].addEventListener("click", editEventsfirst, false);
            }
            for (var i=0; i<editclassarray.length; i++) {
                shareclassarray[i].addEventListener("click", shareevent, false);
            } 
        });
        
    })
}

// creative feature: Users can tag an event with a particular category and enable/disable those tags in the calendar view.
function displayCategory(category){
    console.log(category);
    $('#displayevents').find('tr:gt(0)').remove();
    const data = {'category': category, 'token': session_token};
    	fetch("fetchcategoryevents.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then((response) => {
            response.json()
            .then((data)=>{
                console.log(data);
                var html = "";
                for(var a = 0; a < data.length; a++) {
                    var name1 = data[a].name;
                    var day1 = data[a].date;
                    var time = data[a].time;
                    var id = data[a].id;
                    var deleteid = id * 10;
                    var editid = id*100;
                    var shareid = id*1000;
            // displaying the events and delete, edit, share buttons
                    html += "<tr>" + "<td>" + name1 + "</td>"+"<td>" + day1 + "</td>"+"<td>" + time.substring(0,5) + "</td>"+"</tr>";
                    html+="<button class='deleteclass' id = '" + deleteid + "'>Delete Button</button>";
                    html+="<button class='editclass' id = '" + editid + "'>Edit Button</button>";
                    html+="<button class='shareclass' id = '" + shareid + "'>Share Event</button>";   
                }
                document.getElementById("data").innerHTML = "";
                document.getElementById("data").innerHTML += html;
                var deleteclassarray = Array.from(document.getElementsByClassName('deleteclass'));
                var editclassarray = Array.from(document.getElementsByClassName('editclass'));
                var shareclassarray = Array.from(document.getElementsByClassName('shareclass'));
                // adding event listeners for each delete, edit, share button
                for (var i=0; i<deleteclassarray.length; i++) {
                    deleteclassarray[i].addEventListener("click", deleteevent, false);
                }
                for (var i=0; i<editclassarray.length; i++) {
                    editclassarray[i].addEventListener("click", editEventsfirst, false);
                }
                for (var i=0; i<editclassarray.length; i++) {
                    shareclassarray[i].addEventListener("click", shareevent, false);
                }
            });
            
        })
}
// logging the user out by destroying the session
function logoutuser(event) {
    event.preventDefault();
    fetch('logout.php', {
        method: "POST",
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // because the user is now logged out, they can no longer interact with add event, add group event, display event,
            // event categories so they are all hidden. login and signup buttons are shown again because user is logged out
            console.log("logout success");
            document.getElementById('login').style.display="block";
            document.getElementById('signup').style.display="block";
			document.getElementById('addevent').style.display="none";
            document.getElementById('groupevent').style.display="none";
			document.getElementById('displayevents').style.display="none";
            document.getElementById('logoutbutton').style.display="none";
            document.getElementById('categorybuttons').style.display="none";
            hideeditform();
            hidegroupform();
            hideform();
            alert("You've been Logged Out!");
        }
        else {
            alert("You were not logged out.  " + jsonData.message);
        }
    })
    .catch(err => console.error(err));
}
document.getElementById("logoutbutton").addEventListener("click", logoutuser, false);




// this is part of the creative feature. first it checks which radio button has been clicked by using event listeners
var all = document.getElementById('all');
all.addEventListener("click",ischecked,false);
var work = document.getElementById('work');
work.addEventListener("click",ischecked,false);
var school = document.getElementById('school');
school.addEventListener("click",ischecked,false);
var social = document.getElementById('social');
social.addEventListener("click",ischecked,false);
// then this function is used to display the appropriate category. if the "all" radio button is checked that means
// user wants to see all events and so all events are shown. if the "work" radio button is checked that means the 
// user wants to see events related to work and so only work events are shown and so on. 
function ischecked(){
    if(all.checked){
        displayEvent();
        displayEvent();
    }else if(work.checked){
        displayCategory(work.value);
        displayCategory(work.value);
    }else if(school.checked){
        displayCategory(school.value);
        displayCategory(school.value);
    }else if(social.checked){
        displayCategory(social.value);
        displayCategory(social.value);
    }
}