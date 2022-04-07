
var userListData = [];
$(document).ready(function () {
  if (window.location.pathname === '/admin') {
    adminRendering();
  } else {
    userRendering();
  }
});
function adminRendering() {
  
  populateTable();
  
  $('.userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  
  $('#btnAddUser').on('click', addUser);
  
  $('.userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
}
function populateTable() {
  
  var tableContent = '';
  
  $.getJSON('/users/userlist', function (data) {
    
    userListData = data;
    
    $.each(data, function () {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });
    
    $('.userList table tbody').html(tableContent);
  });
};
function showUserInfo(event) {
  
  event.preventDefault();
  
  var thisUserName = $(this).attr('rel');
  
  var arrayPosition = userListData.map(function (arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
  
  var thisUserObject = userListData[arrayPosition];
  
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoCard').text(thisUserObject.card);
  $('#userInfoLocation').text(thisUserObject.location);
};
function addUser(event) {
  event.preventDefault();
  
  var errorCount = 0;
  $('#addUser input').each(function (index, val) {
    if ($(this).val() === '') { errorCount++; }
  });
  
  if (errorCount === 0) {
    
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'card': $('#addUser fieldset input#inputUserCard').val(),
      'password': $('#addUser fieldset input#inputUserName').val()
    }
    
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function (response) {
      
      if (response.msg === '') {
        
        $('#addUser fieldset input').val('');
        
        populateTable();
      }
      else {
        
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    
    alert('Please fill in all fields');
    return false;
  }
};
function deleteUser(event) {
  event.preventDefault();
  
  var confirmation = confirm('Are you sure you want to delete this user?');
  
  if (confirmation === true) {
    
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function (response) {
      
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }
      
      populateTable();
    });
  }
  else {
    
    return false;
  }
};function userRendering() {
  $('#btnLogin').on('click', loginUser);
  $('#btnLogout').on('click', logoutUser);
  $('#btnModify').on('click', modifyUser);
  initUserSession();
}
function initUserSession() {
  $.ajax({
    type: 'POST',
    data: {},
    url: '/users/session',
    dataType: 'JSON'
  }).done(function (response) {
    if (response.user) {
      setLogin();
    } else {
      reset();
    }
  });
}
function loginUser() {
  event.preventDefault();
  var user = {
    'username': $('#login fieldset input#loginUserName').val(),
    'password': $('#login fieldset input#loginPassword').val(),
  }
  
  $.ajax({
    type: 'POST',
    data: user,
    url: '/users/session',
    dataType: 'JSON'
  }).done(function (response) {
    
    
    if (response && response.username) {
      setLogin();
    } else {
      
      alert('Error: ' + response.msg);
    }
  });
};
function logoutUser() {
  event.preventDefault();
  $.ajax({
    type: 'DELETE',
    url: '/users/session'
  }).done(function () {
    reset();
  });
}
function setLogin() {
  
  $('#login .userList fieldset input').hide();
  
  $('#btnLogin').hide();
  $('#btnLogout').show();
  $('#modifyList').show();
  populateUserInfo();
}
function reset() {
  
  $('#login .userList fieldset input').show();
  
  $('#btnLogin').show();
  $('#btnLogout').hide();
  
  $('#myInfoName').text('');
  $('#myInfoAge').text('');
  $('#myInfoCard').text('');
  $('#myInfoLocation').text('');
  $('#modifyList').hide();
}
function populateUserInfo() {
  
  $.getJSON('/users', function (data) {
    
    $('#myInfoName').text(data.user.fullname);
    $('#myInfoAge').text(data.user.age);
    $('#myInfoCard').text(data.user.card);
    $('#myInfoLocation').text(data.user.location);
  });
};
function modifyUser() {
  event.preventDefault();
  var modifyUser = {
    'password': $('#modifyPassword').val(),
    'email': $('#modifyUserEmail').val(),
    'fullname': $('#modifyUserFullname').val(),
    'age': $('#modifyUserAge').val(),
    'location': $('#modifyUserLocation').val(),
    'card': $('#modifyUserCard').val(),
  }
  
  Object.keys(modifyUser).forEach((key) => { (modifyUser[key] === "") && delete modifyUser[key] });
  $.ajax({
    type: "PUT",
    data: modifyUser,
    url: '/users/modify',
    dataType: 'JSON',
  }).done(function (response) {
    
    if (response.msg === '') {
      
      setLogin();
      $('#modifyPassword').val('');
      $('#modifyUserEmail').val('');
      $('#modifyUserFullname').val('');
      $('#modifyUserAge').val('');
      $('#modifyUserLocation').val('');
      $('#modifyUserCard').val('');
    }
    else {
      
      alert('Error: ' + response.msg);
    }
  });
}