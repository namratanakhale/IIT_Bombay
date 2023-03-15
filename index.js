var createForm = document.querySelector("#create-form"); 
var allInput = createForm.querySelectorAll("INPUT");
  var addBtn = document.querySelector("#add-row-btn");
  var modal = document.querySelector(".modal");
  var closeBtn = document.querySelector(".close-icon");
  addBtn.onclick = function(){
    modal.classList.add("active");
  }
  closeBtn.addEventListener("click",()=>{
    modal.classList.remove("active");
    var i;
    for(i=0;i<allInput.length;i++){
      allInput[i].value = "";
    }
  })

  // start all global variale
  var userData = [];
  var chemical = document.getElementById("chemical");
  var vendor = document.getElementById("vendor");
  var density = document.getElementById("density");
  var viscosity = document.getElementById("viscosity");
  var packaging = document.getElementById("packaging");
  var packsize = document.getElementById("pack-size");
  var unit = document.getElementById("unit");
  var quantity = document.getElementById("quantity");
  var createBtn = document.querySelector("#register-btn");
  var updateBtn = document.querySelector("#update-btn");
  var createForm = document.querySelector("#create-form"); 

  // end all global variable


  // start create coding
  
  createBtn.onclick = function(e){
    e.preventDefault();
    createData();
    getDataFromLocal();
    createForm.reset('');
    closeBtn.click();
  }

  if(localStorage.getItem("userData") != null){
    userData = JSON.parse(localStorage.getItem("userData"));
  }

  function createData(){
    userData.push({
      chemical : chemical.value,
      vendor : vendor.value,
      density : density.value,
      viscosity : viscosity.value,
      packaging : packaging.value,
      packsize : packsize.value,
      unit : unit.value,
      quantity : quantity.value
    });
    var userString = JSON.stringify(userData);
    localStorage.setItem("userData",userString);
  }

  // start returning data on page from localstorage
  var tableData = document.querySelector("#table-row");
  const getDataFromLocal = () =>{
    tableData.innerHTML = "";
    userData.forEach((data, index)=>{
     tableData.innerHTML += `
     <tr index='${index}'>
            <td> <input type="checkbox" id="checkbox">  ${index+1} ${data.chemical}</td>
            <td>${data.vendor}</td>
            <td>${data.density}</td>
            <td>${data.viscosity}</td>
            <td>${data.packaging}</td>
            <td>${data.packsize}</td>
            <td>${data.unit}</td>
            <td>${data.quantity}</td>
            <td>
               <button class="edit-btn"><i class="fa fa-eye"</button>
            </td>
          </tr>
     `
    });


// start delete code
   var deleteBtn = document.querySelector("#delete");

   // Attach a click event listener to the delete button
  deleteBtn.addEventListener("click", function () {
  // Get a reference to all the checkboxes in the table
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Loop through all the checkboxes
  checkboxes.forEach(function (checkbox) {
    // Check if the checkbox is checked
    if (checkbox.checked) {
      const tr = checkbox.parentElement.parentElement;
      var id = tr.getAttribute("index");
      userData.splice(id,1);
      localStorage.setItem("userData",JSON.stringify(userData));
      tr.remove();
    }
    
  });
});
// end delete code

// start update coding
var i;
  var allEdit = document.querySelectorAll(".edit-btn");
  for(i=0;i<allEdit.length;i++){
    allEdit[i].onclick = function(){
      var tr = this.parentElement.parentElement;
      var td = tr.getElementsByTagName("td");
      var index = tr.getAttribute("index");
       chemical.value = td[0].innerText;
       vendor.value = td[1].innerHTML;
       density.value = td[2].innerHTML;
       viscosity.value = td[3].innerHTML;
       packaging.value = td[4].innerHTML;
       packsize.value = td[5].innerHTML;
       unit.value = td[6].innerHTML;
       quantity.value = td[7].innerHTML;
      addBtn.click();
      createBtn.disabled = true;
      updateBtn.disabled = false;
      updateBtn.onclick = function(e){
        userData[index] = {
          chemical : chemical.value,
          vendor : vendor.value,
          density : density.value,
          viscosity : viscosity.value,
          packaging : packaging.value,
          packsize : packsize.value,
          unit : unit.value,
          quantity : quantity.value,
        }
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    }
  }
  // end update coding
  }
  getDataFromLocal();

  // start move row upNdown
    var index;
    function getSelectedRow() {
      var table = document.getElementById("chemicals-table");
      for(var i=1;i<table.rows.length; i++)
      {
       
        table.rows[i].onclick = function(){
          
          // clear the selected from the previous selected row
          if(typeof index !== "undefined"){
            table.rows[index].classList.toggle("selected");
          }

          index = this.rowIndex;
          this.classList.toggle("selected");
        }
      }
    }
    getSelectedRow();

    function upNdown(direction)
    {
      var rows = document.getElementById("chemicals-table").rows
      parent = rows[index].parentNode;

      if(direction === "up")
      {
        if(index > 1){
          parent.insertBefore(rows[index],rows[index-1]);
        index--;
      }
      }

      if(direction === "down"){
        if(index < rows.length-1){
          parent.insertBefore(rows[index + 1],rows[index]);
        index++;
        }
      }
    }
      
  // start refresh coding
  const refresh = document.getElementById("refresh");
  refresh.addEventListener('click', function(){
    location.reload();
  })

//  start save coding..
 
  var saveBtn = document.getElementById("save");
  let saveData = document.getElementsByClassName("saveData");
  var saveTable = document.getElementById("save-table");

saveBtn.addEventListener("click", function () {
// Get a reference to all the checkboxes in the table
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Loop through all the checkboxes
checkboxes.forEach(function (checkbox) {
  // Check if the checkbox is checked
  if (checkbox.checked) {
    const tr = checkbox.parentElement.parentElement;
   
    localStorage.getItem("userData");
  
    getDataFromLocal();
    saveTable.appendChild(tr);
    
  }
  
});
});


 // start sort table column coding...

 const table = document.getElementById("chemicals-table");
 const headers = table.querySelectorAll('th');
 const rows = table.querySelectorAll('tr');

 headers.forEach((header,headerIndex)=>{
  header.addEventListener('click',()=>{
    sortColumn(headerIndex);
  });
 });

 //Transform the content of given cell in given column
 const transform = function(index, content) {
  //Get the data type of column
  const type = headers[index].getAttribute('type');
  switch(type) {
    case 'number':
      return parseFloat(content);
      case 'string':
        default:
          return content;
  }
 };

 //Track sort directions
 let directions = Array(headers.length).fill("");
//  console.log(directions);

 function sortColumn(headerIndex){

  //Check the direction asc or desc
  const direction = directions[headerIndex] || 'asc';
  const multiplier = (direction=='asc')? 1 : -1;
  changeIcon(direction,headerIndex);
  //lets make new instance of rows
  let arrayRows = Array.from(rows);
  arrayRows.shift();//Exclude header

  let newRows = Array.from(arrayRows);
  newRows.sort(function(rowA,rowB){
    //Get the content of cells
    const cellA = rowA.querySelectorAll('td')[headerIndex].innerHTML;
    const cellB = rowB.querySelectorAll('td')[headerIndex].innerHTML;
    let a = transform(headerIndex,cellA);
    let b = transform(headerIndex,cellB);

    if(a>b)
      return 1*multiplier;
      else if(a<b)
      return -1*multiplier;
      else return 0;

  });
  //Remove old rows
   let tbody = document.getElementsByTagName("tbody");
   rows.forEach((row,index)=>{
    if(index!=0)
        tbody[0].removeChild(row);
   });
   //Append new row
   newRows.forEach((newRow)=>{
        tbody[0].appendChild(newRow);
   });

   //Reverse the direction
   directions[headerIndex] = direction === 'asc' ? 'desc' : 'asc';
  //  console.log(directions);
 }
 function changeIcon(direction,index){

  //inactive all icons
  for(let i=0;i<headers.length;i++){
    headers[i].childNodes[1].className='';//Removing all classes
  }

  let className;
  if(direction == "desc"){
    //headers[index].childNodes[1].add('fa-solid','fa-caret-down','active');
    headers[index].childNodes[1].className = ('fa-solid fa-caret-down active');
  }else{
    headers[index].childNodes[1].className = ('fa-solid fa-caret-up active');
  }
 }