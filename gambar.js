// Memampatkan gambar di browser menjadi JPEG (maks 1200 px) sebelum diunggah. Keluaran: teks base64.
window.packImage=file=>new Promise((ok,no)=>{
 if(!file||!/^image\//.test(file.type))return no(new Error("File harus berupa gambar."));
 const u=URL.createObjectURL(file),im=new Image();
 im.onerror=()=>no(new Error("Gambar tidak bisa dibaca."));
 im.onload=()=>{URL.revokeObjectURL(u);let side=1200,d;
  for(let t=0;t<4;t++){const k=Math.min(1,side/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");
   c.width=Math.max(1,Math.round(im.naturalWidth*k));c.height=Math.max(1,Math.round(im.naturalHeight*k));
   const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
   let q=.82;do{d=c.toDataURL("image/jpeg",q);q-=.08}while(d.length>620000&&q>.4);
   if(d.length<=900000)return ok(d.split(",")[1]);side*=.75}
  no(new Error("Gambar terlalu besar, coba gambar lain."))};
 im.src=u});
window.imgUrl=(id,t)=>window.WRITING_API+"?a=img&id="+id+(t?"&t="+t:"");
