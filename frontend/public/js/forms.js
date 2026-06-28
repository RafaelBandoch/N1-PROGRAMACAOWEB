async function enviarFormulario(form, endpoint){

  const alert = document.querySelector("#alert");

  const formData = new FormData(form);
  const dados = Object.fromEntries(formData.entries());

  try{

    const res = await fetch("/api/" + endpoint,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(dados)
    });

    const data = await res.json();

    if(res.ok){

      alert.textContent="✓ "+data.mensagem;
      alert.className="mb-6 p-4 rounded text-sm bg-green-50 text-green-700";

      form.reset();

    }else{

      alert.textContent="✗ "+data.erro;
      alert.className="mb-6 p-4 rounded text-sm bg-red-50 text-red-700";

    }

  }catch(e){

    alert.textContent="✗ Erro ao conectar";
    alert.className="mb-6 p-4 rounded text-sm bg-red-50 text-red-700";

  }

}
