let studentsData;
let id;
let uri = 'http://127.0.0.1:8000/api/student/';
const apiGet = async (url) => {
  let headers = new Headers();

  // headers.append('Content-Type', 'application/json');
  // headers.append('Accept', 'application/json');
  // headers.append('Origin', url);
  // headers.append(
  //   'Access-Control-Allow-Methods',
  //   'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  // );
  // headers.append('Access-Control-Allow-Headers', '*');
  headers.append('Authorization', 'Basic YmFycnk6MQ==');
  // headers.entries().forEach((element) => console.log(element));
  for (var pair of headers.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
  console.log(headers.get('Authorization'));

  try {
    // const response = await axios.get(url);
    // axios({ method: 'get', url: 'your URL', headers: { Authorization: `Bearer ${token}` } })
    // const response = await axios.get(url, { headers: headers });
    const response = await axios({
      method: 'get',
      url: url,
      headers: { Authorization: 'Basic YmFycnk6MQ==' },
    });

    body = document.querySelector('#container');
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
    studentsData = response.data;
    response.data.forEach((element) => {
      line = `      
          <tr>
              <th scope="row">${element.id}</th>
              <td>${element.first_name}</td>
              <td>${element.last_name}</td>
              <td>${element.number}</td>
              <td><input type="radio" name="radioGroup"></td>
          </tr>`;
      html += line;
    });
    html += ' </tbody></table>';
    body.innerHTML = html;
    const table = document.getElementById('table');
    table.addEventListener('click', (event) => {
      if (event.target.type === 'radio') {
        id = event.target.parentNode.parentNode.childNodes[1].textContent;
        console.log(id);
        document.getElementById('name').value = studentsData[id - 1].first_name;
        document.getElementById('lastname').value =
          studentsData[id - 1].last_name;
        document.getElementById('number').value = studentsData[id - 1].number;
      }

      // console.log(event);
      // const t2 = document.getElementById('t2');
      // t2.textContent = t2.textContent === 'two' ? 'three' : 'two';
      // // console.log(table.children[0].children[0].children[0].firstChild.nodeValue);
      // console.log(
      //   table.childNodes[1].childNodes[0].childNodes[1].childNodes[0].nodeValue
      // );
      // table.childNodes[1].childNodes[0].childNodes[1].childNodes[0].nodeValue =
      //   table.childNodes[1].childNodes[0].childNodes[1].childNodes[0].nodeValue ===
      //   'one'
      //     ? 'zero'
      //     : 'one';
    });
  } catch (err) {
    console.log(err.message);
  }
};

const apiPost = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    // , {
    //   headers: headers,
    // });
    body = document.querySelector('#message');

    body.innerHTML = response.data.message;
  } catch (err) {
    console.log(err.message);
  }
};

apiGet(uri);

// apiPost('http://localhost:8000/api/student/', {
//   first_name: 'veysel',
//   last_name: 'veysel',
//   number: 1002,
// });

let form = document.getElementById('form'); // selecting the form

form.addEventListener('submit', async function (event) {
  // 1
  event.preventDefault();
  console.log('form submit');
  console.log(event.target);

  let data = new FormData(); // 2

  data.append('first_name', document.getElementById('name').value);
  data.append('last_name', document.getElementById('lastname').value);
  data.append('number', document.getElementById('number').value); // 3

  try {
    const response = await axios.post(
      'http://localhost:8000/api/student/',
      data
    );

    body = document.querySelector('#message');

    body.innerHTML = response.data.message;
    apiGet('http://localhost:8000/api/student/');
    document.getElementById('name').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('number').value = '';
  } catch (err) {
    console.log(err.message);
    Object.entries(err.response.data.message).forEach((element) =>
      console.log(element[0], element[1])
    );
    let errors = Object.entries(err.response.data.message).reduce(
      (acc, element) => acc + element[0] + ' ' + element[1][0] + ' <br />',
      ''
    );
    body = document.querySelector('#message');
    body.innerHTML = `<div class="alert alert-danger">${errors}</div>`;
  }

  //   axios
  //     .post('http://localhost:8000/api/student/', data) // 4
  //     .then((res) => alert('Form Submitted')) // 5
  //     .catch((errors) => console.log(errors)); // 6
});

const updateDelete = async function (event) {
  let method;
  let data = {};
  if (event.target.outerText === 'Update') {
    console.log('update');
    data = new FormData(); // 2

    data.append('first_name', document.getElementById('name').value);
    data.append('last_name', document.getElementById('lastname').value);
    data.append('number', document.getElementById('number').value); // 3
    method = 'put';
  } else if (event.target.outerText === 'Delete') {
    console.log('delete');
    method = 'delete';
  }
  try {
    const response = await axios({
      method: method,
      url: uri + id,
      headers: { Authorization: 'Basic YmFycnk6MQ==' },
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    Object.entries(err.response.data.message).forEach((element) =>
      console.log(element[0], element[1])
    );
    let errors = Object.entries(err.response.data.message).reduce(
      (acc, element) => acc + element[0] + ' ' + element[1][0] + ' <br />',
      ''
    );
    body = document.querySelector('#message');
    body.innerHTML = `<div class="alert alert-danger">${errors}</div>`;
  }
};

document.getElementById('updateBtn').addEventListener('click', updateDelete);
document.getElementById('deleteBtn').addEventListener('click', updateDelete);
