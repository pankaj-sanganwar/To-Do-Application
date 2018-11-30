var url = new URL(window.location.href);
var username = url.searchParams.get('username');
var toDoId = (url.searchParams.get('edit_id')) ? url.searchParams.get('edit_id') : '';
var userDetails = JSON.parse(localStorage.getItem(username));

if (toDoId) {
	addEditToDoPage();
}

function editprofile() {
	window.location.href = 'profile.html?username=' + username;
}

function logOut() {
	window.location.href = "index.html";
}

function loadToDoList() {
	userDetails = (userDetails) ? userDetails : JSON.parse(localStorage.getItem(username));
	var toDoList = (userDetails.toDoList) ? userDetails.toDoList : [];
	var toDoHTML = '';
	var id = 0;

	toDoList.forEach(function (toDo) {

		id = (toDo.id) ? toDo.id : id;

		toDoHTML += '<tr class="todolist" ><td style="text-align:center;vertical-align: middle;"><input class="bulk_delete" type="checkbox" id="' + id + '"></td><td>' + toDo.name +
			'</td><td>' + toDo.date + '</td><td>' + toDo.category + '</td><td>' + toDo.status +
			'</td><td><input type="button" value="edit" onclick="editToDo(' + id +
			')">&nbsp;&nbsp;&nbsp;<input type="button" onclick="deleteToDo(' + id + ')" value="delete"></td></tr>';
	});
	document.getElementById('todo').insertAdjacentHTML('beforeend', toDoHTML);
}

function cancel() {
	window.location.href = 'home.html?username=' + username;
}

function loadProfileData() {
	var userDetails = JSON.parse(localStorage.getItem(username))

	document.getElementById('firstname').value = userDetails.firstName;
	document.getElementById('lastname').value = userDetails.lastName;
	document.getElementById('userid').value = userDetails.userid;
	document.getElementById('userpassword').value = userDetails.password;
	document.getElementById('Address').value = userDetails.Address;
	document.getElementById(userDetails.gender).checked = true;
	document.getElementById('img').src = userDetails.photo;

	console.log(userDetails);
}

function addEditToDoPage() {
	if (toDoId) {
		var toDoList = JSON.parse(localStorage.getItem(username)).toDoList;
		toDoList.forEach(function (toDo) {

			if (toDoId == toDo.id) {
				document.getElementById('todo').value = toDo.name;
				document.getElementById('date').value = toDo.date;
				document.getElementById('status').value = toDo.status;
				document.getElementsByName('category').forEach(function (category) {
					if (toDo.category.includes(category.value)) {
						category.checked = true;
					}
				})
			}
		});
	} else {
		window.location.href = 'addEditToDo.html?username=' + username;
	}
}


function addToDo() {
	var categories = document.getElementsByName('category');
	var toDo = new Object();

	toDo.name = document.getElementById('todo').value;
	toDo.date = document.getElementById('date').value;
	toDo.status = document.getElementById('status').value;
	toDo.is_reminder = document.getElementById('is_reminder').checked;
	toDo.id = '';
	toDo.category = '';
	toDo.reminderDate = '';

	if (toDo.is_reminder) {
		toDo.reminderDate = document.getElementById('date_reminder').value;
	}

	categories.forEach(function (category_checkbox) {
		if (category_checkbox.checked && '' != toDo.category) {
			toDo.category = toDo.category + ',' + category_checkbox.value;
		} else if (category_checkbox.checked) {
			toDo.category = category_checkbox.value;
		}
	});

	if (undefined === userDetails.toDoList) {
		userDetails.toDoList = [];
	}

	if ('' === toDo.name) {
		alert('Please enter valid name');
		return;
	}

	if ('' === toDo.category) {
		alert('Please enter valid category');
		return;
	}

	if ('' === toDo.date) {
		alert('Please enter valid date');
		return;
	}

	if (toDoId) {
		userDetails.toDoList.forEach(function (oldToDo, index) {
			if (toDoId == oldToDo.id) {
				toDo.id = oldToDo.id;
				userDetails.toDoList[index] = toDo;
			}
		});
		alert('Updated Successfully id = ' + toDo.id);
	} else {

		var toDoMaxId = userDetails.toDoList.length - 1;

		toDo.id = (0 <= toDoMaxId) ? userDetails.toDoList[toDoMaxId].id + 1 : 1;
		userDetails.toDoList.push(toDo);

		alert('To Do Added Successfully' + ' id = ' + toDo.id);
	}

	localStorage.setItem(username, JSON.stringify(userDetails));
	window.location.href = 'home.html?username=' + username;
}

function editToDo(id) {
	window.location.href = 'addEditToDo.html?username=' + username + '&edit_id=' + id;
}

function deleteToDo(id) {
	var toDoList = userDetails.toDoList;
	var toDoIndex = '';

	toDoList.forEach(function (toDo, index) {
		if (id === toDo.id) {
			toDoIndex = index;
		}
	});

	toDoList.splice(toDoIndex, 1);
	userDetails.toDoList = toDoList;
	console.log(userDetails.toDoList);
	localStorage.setItem(username, JSON.stringify(userDetails));
	cancel();
}

function bulkDelete() {

	var delete_checkboxes = document.getElementsByClassName('bulk_delete');
	var toDoList = userDetails.toDoList;
	var delete_indexes = [];

	for (var i = 0; i < delete_checkboxes.length; i++) {
		if (delete_checkboxes[i].checked) {
			toDoList.forEach(function (toDo, index) {
				if (toDo.id == delete_checkboxes[i].id) {
					delete_indexes.push(index);
				}
			});
		}
	}
	delete_indexes.reverse();

	delete_indexes.forEach(function (delete_index) {
		toDoList.splice(delete_index, 1);
	});

	userDetails.toDoList = toDoList;
	localStorage.setItem(username, JSON.stringify(userDetails));
	cancel();
}

function searchToDo() {
	var filter = document.getElementById('filter').value.toLowerCase();
	var toDoList = userDetails.toDoList;
	var toRows = document.getElementsByClassName('todolist');
	var result = [];
	var toDoHTML = '';
	var toDoCategory = '';

	for (var i = toRows.length - 1; i >= 0; i--) {
		document.getElementsByClassName('todolist')[0].remove();
	}

	toDoList.forEach(function (toDo) {
		toDoCategory = toDo.category.toLowerCase();
		if (toDoCategory.includes(filter)) {
			toDoHTML += '<tr class="todolist" ><td style="text-align:center;vertical-align: center;"><input class="bulk_delete" type="checkbox" id="' + toDo.id + '"></td><td>' + toDo.name +
				'</td><td>' + toDo.date + '</td><td>' + toDo.category + '</td><td>' + toDo.status +
				'</td><td><input type="button" value="edit" onclick="editToDo(' + toDo.id +
				')">&nbsp;&nbsp;&nbsp;<input type="button" onclick="deleteToDo(' + toDo.id + ')" value="delete"></td></tr>';
		}
	});
	document.getElementById('todo').insertAdjacentHTML('beforeend', toDoHTML);
}

function setReminderDate() {
	if (document.getElementById('is_reminder').checked) {
		document.getElementById('reminder_date').style = 'vertical-align: inherit;';
	} else {
		document.getElementById('reminder_date').style = 'display:none;';
	}
}