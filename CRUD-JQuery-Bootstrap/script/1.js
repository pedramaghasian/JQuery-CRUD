$(document).ready(function () {
  let alldata = [];

  callAjax(urlGenerator(1));
  callAjax(urlGenerator(2));

  let data = alldata;

  fillingThePage(data);

  $('#btn-create').on('click', function (e) {
    createNewUser(data);
  });

  $('#row').on('click', '.more', function (e) {
    getEditModal(data, e);
  });

  $('#btn-edit').on('click', function (e) {
    editeChange(e, data);
  });

  $('#btn-delete').on('click', function (e) {
    let inputs = $('#form-create :input');
    data = data.filter((el) => el.id !== +inputs[0].value);
    fillingThePage(data);
    $('#exampleModal').modal('toggle');
  });

  $('#navbar-create-btn').on('click', function () {
    createStyle();
  });

  //************************************************************ */
  //                        Functions
  //*********************************************************** */

  // fetch data from Given API
  function callAjax(url) {
    $.ajaxSetup({
      async: false,
    });
    $.getJSON(url, {
      format: 'json',
    })
      .done(function (res) {
        let data = res.data;
        alldata.push(...data);
      })
      .fail(function () {
        alert('something went Wrong for fetchin User List !');
      });
  }

  // Generate API url
  function urlGenerator(page) {
    return `https://reqres.in/api/users?page=${page}`;
  }

  // clear inputs
  function clearInput(inputs) {
    $.each(inputs, function (index, item) {
      item.value = '';
    });
  }

  // create style for the create Modal
  function createStyle() {
    $('#exampleModalLabel')
      .removeClass('text-warning')
      .addClass('text-success');
    $('#exampleModalLabel').text('Create New User !');

    $('#btn-close').removeClass('d-none');
    $('#btn-create').removeClass('d-none');
    $('#btn-edit').addClass('d-none');
    $('#btn-delete').addClass('d-none');
    clearInput($('#exampleModal :input'));
  }

  //get the edit Modal
  function getEditModal(data, e) {
    $('#exampleModalLabel')
      .removeClass('text-success')
      .addClass('text-warning');
    $('#exampleModalLabel').text('Edit User Information');
    let inputs = $('#exampleModal :input');
    let findItem = data.find(function (item, index) {
      return item.id === +e.target.id;
    });
    inputs[1].value = findItem['id'];
    inputs[2].value = findItem['first_name'];
    inputs[3].value = findItem['last_name'];
    inputs[4].value = findItem['email'];
    // inputs[5].files[0] = findItem['avatar'];
    $('#exampleModal input:file').data('imageUrl', findItem['avatar']);
    inputs[5].value = '';
    $('#btn-close').addClass('d-none');
    $('#btn-create').addClass('d-none');
    $('#btn-edit').removeClass('d-none');
    $('#btn-delete').removeClass('d-none');
    $('#exampleModal').modal('toggle');
  }

  // edite handler
  function editeChange(e, data) {
    let inputs = $('#form-create :input');
    let currentImageUrl = $('#form-create input:file').data('imageUrl');
    var createImagePath = '';
    if (inputs[4].value !== ''.trim()) {
      createImagePath = URL.createObjectURL(inputs[4].files[0], {
        autoRevoke: false,
      });
    } else if (inputs[4].value === ''.trim()) {
      createImagePath = currentImageUrl;
    }

    data.find(function (item, index) {
      if (item.id === +inputs[0].value) {
        item.first_name = inputs[1].value;
        item.last_name = inputs[2].value;
        item.email = inputs[3].value;
        item.avatar = createImagePath;
        $('#exampleModal').modal('toggle');
        return fillingThePage(data);
      }
    });
  }

  //create New User
  function createNewUser(data) {
    let inputs = $('#form-create :input');

    var createImagePath = URL.createObjectURL(inputs[4].files[0], {
      autoRevoke: false,
    });

    let newObj = {
      id: new Date().getUTCMilliseconds(),
      email: inputs[3].value,
      first_name: inputs[1].value,
      last_name: inputs[2].value,
      avatar: createImagePath,
    };
    data.unshift(newObj);
    fillingThePage(data);
    $('#exampleModal').modal('toggle');
    clearInput($('#exampleModal :input'));
  }

  //template for the card
  function simpleTemplating(data) {
    $('#row').empty();
    let html = '';
    $.each(data, function (index, item) {
      html += `
              <div class="mt-3 col-12 col-md-6 col-lg-4 ">
                <div class="card" >
                  <img src="${item.avatar}" class="img-fluid card-img-top" style="height:350px"/>
                  <div class='card-header'>
                  <h5> ${item.first_name} ${item.last_name}</h5>
                  </div>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item"><span class="h6">${item.email}</span> </li>
                      <li class="list-group-item"><span class="h6">${item.id}</span></li>
                    </ul>
                  <div class='card-footer bg-primary text-center text-white more' id=${item.id}>More!</div>
                </div>
              </div>
    
            `;
    });

    return html;
  }

  // filling the page with pagination
  function fillingThePage(data) {
    $('#pagination-container').pagination({
      dataSource: data,
      pageSize: 6,
      showPrevious: false,
      showNext: false,
      ulClassName: 'paginationUl',
      callback: function (data, pagination) {
        var html = simpleTemplating(data);
        $('#row').html(html);
      },
    });
  }
});
