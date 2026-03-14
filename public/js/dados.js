async function carregarClientes(){

 const res = await fetch("/api/clientes");
 const dados = await res.json();

 console.log(dados);

}
