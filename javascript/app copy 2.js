let studentsData;
let id;
let pos;
let uri = 'http://127.0.0.1:8000/api/student/';
const authentication = 'Basic YmFycnk6MQ==';

const displayStudents = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: uri,
      headers: { Authorization: authentication },
    });

    studentsData = response.data;

    studentContainer = document.querySelector('#studentContainer');
    html = `<table id="table" style="width:50%" class="table table-success table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
          <th scope="col">Number</th>  
          <th scope="col">Update</th> 
        </tr>
      </thead>
      <tbody>
      `;

    response.data.forEach((element) => {
      html += `      
        <tr>
          <th scope="row">${element.id}</th>
          <td>${element.first_name}</td>
          <td>${element.last_name}</td>
          <td>${element.number}</td>
          <td><input type="radio" name="radioGroup"></td>
        </tr>`;
    });

    html += ' </tbody></table>';
    studentContainer.innerHTML = html;

    const table = document.getElementById('table');
    table.addEventListener('click', (event) => {
      if (event.target.type === 'radio') {
        id = event.target.parentNode.parentNode.childNodes[1].textContent;

        for (let i = 0; i < studentsData.length; i++)
          if (studentsData[i].id == id) {
            pos = i;
            break;
          }
        document.getElementById('name').value = studentsData[pos].first_name;
        document.getElementById('lastname').value = studentsData[pos].last_name;
        document.getElementById('number').value = studentsData[pos].number;
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

displayStudents();

const resetForm = function () {
  document.getElementById('name').value = '';
  document.getElementById('lastname').value = '';
  document.getElementById('number').value = '';
};

const displayMessages = function (message, type) {
  const messageElement = document.querySelector('#message');
  let msg = message;
  if (type === 'danger') {
    const errors = Object.entries(message).reduce(
      (acc, element) => acc + element[0] + ' ' + element[1][0] + ' <br />',
      ''
    );
    msg = errors;
  }
  messageElement.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
};

let form = document.getElementById('form');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  let data = new FormData();

  data.append('first_name', document.getElementById('name').value);
  data.append('last_name', document.getElementById('lastname').value);
  data.append('number', document.getElementById('number').value); // 3

  try {
    const response = await axios({
      method: 'post',
      url: uri,
      headers: { Authorization: 'Basic YmFycnk6MQ==' },
      data: data,
    });
    displayMessages(response.data.message, 'success');
    displayStudents();
  } catch (err) {
    console.log(err.message);
    displayMessages(err.response.data.message, 'danger');
  }
});

const updateDelete = async function (event) {
  let method;
  let data = {};
  if (event.target.outerText === 'Update') {
    console.log('update');
    data = new FormData();

    data.append('first_name', document.getElementById('name').value);
    data.append('last_name', document.getElementById('lastname').value);
    data.append('number', document.getElementById('number').value); // 3
    method = 'put';
  } else if (event.target.outerText === 'Delete') {
    console.log('delete', id, uri);
    method = 'delete';
  }
  try {
    const response = await axios({
      method: method,
      url: uri + id + '/',
      headers: { Authorization: 'Basic YmFycnk6MQ==' },
      data: data,
    });
    displayMessages(response.data.message, 'success');
    displayStudents();
  } catch (err) {
    console.log(err.message);
    displayMessages(err.response.data.message, 'danger');
  }
};

document.getElementById('updateBtn').addEventListener('click', updateDelete);
document.getElementById('deleteBtn').addEventListener('click', updateDelete);
