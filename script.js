
function saveConfig(){
  localStorage.setItem('dbUrl', document.getElementById('dbUrl').value.trim());
  alert("URL disimpan (secret tidak).");
}
function resetConfig(){
  document.getElementById("dbUrl").value="";
  document.getElementById("dbSecret").value="";
}

function loadData(){
  let url=document.getElementById('dbUrl').value.trim();
  let secret=document.getElementById('dbSecret').value.trim();
  if(!url){alert("Isi URL!");return;}
  fetch(url + ".json?auth=" + secret)
  .then(r=>r.json())
  .then(d=>{
    if(!d){document.getElementById("userList").innerHTML="Tidak ada data";return;}
    let out="";
    Object.keys(d).forEach(k=>{
      if(typeof d[k]==="object"){
         out+=`<div class="userRow">
           <input type="checkbox" class="ck" data-key="${k}">
           <div>${k}</div>
         </div>`;
      }
    });
    document.getElementById("userList").innerHTML=out;
  });
}

function getSelected(){
  return [...document.querySelectorAll(".ck:checked")].map(c=>c.dataset.key);
}

function openMultiEdit(){
  if(getSelected().length===0){alert("Pilih data!");return;}
  document.getElementById("multiModal").classList.add("show");
}

function closeMulti(){
  document.getElementById("multiModal").classList.remove("show");
}

function applyMultiEdit(){
  let url=document.getElementById('dbUrl').value.trim();
  let secret=document.getElementById('dbSecret').value.trim();

  let u=document.getElementById('multi_username').value.trim();
  let p=document.getElementById('multi_password').value.trim();
  let e=document.getElementById('multi_expiry').value.trim();

  let sel=getSelected();
  if(sel.length===0){alert("Tidak ada data dipilih");return;}

  sel.forEach(k=>{
    let update={};
    if(u!=="") update.username=u;
    if(p!=="") update.password=p;
    if(e!=="") update.expiry=e;

    fetch(`${url}/${k}.json?auth=${secret}`,{
      method:"PATCH",
      body:JSON.stringify(update)
    });
  });

  alert("Edit massal selesai!");
  closeMulti();
  loadData();
}
