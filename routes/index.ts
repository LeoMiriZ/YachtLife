import app = require("teem");

//**********************************************************************************
// Se por acaso ocorrer algum problema de conexão, autenticação com o MySQL,
// por favor, execute este código abaixo no MySQL e tente novamente!
//
// ALTER USER 'USUÁRIO'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SENHA';
//
// * Assumindo que o usuário seja root e a senha root, o comando ficaria assim:
//
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
//
//**********************************************************************************

class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		res.render("index/index");
	}

	@app.http.post()
	// Configuração adicional para poder receber FormData e/ou arquivos.
	@app.route.formData()
	public async criarPessoa(req: app.Request, res: app.Response) {
		// Os dados enviados via POST ficam dentro de req.body
		let pessoa = req.body;

		// É sempre muito importante validar os dados do lado do servidor,
		// mesmo que eles tenham sido validados do lado do cliente!!!
		if (!pessoa) {
			res.status(400);
			res.json("Dados inválidos");
			return;
		}

		if (!pessoa.nome) {
			res.status(400);
			res.json("Nome inválido");
			return;
		}

		if (!pessoa.email) {
			res.status(400);
			res.json("E-mail inválido");
			return;
		}

		// Verifica se a foto foi enviada
		if (req.uploadedFiles && req.uploadedFiles.foto) {
			console.log("Foto enviada! Tamanho: " + req.uploadedFiles.foto.size);
		} else {
			console.log("Foto não enviada!");
		}

		await app.sql.connect(async (sql) => {

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().

			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			await sql.query("INSERT INTO pessoa (nome, email) VALUES (?, ?)", [pessoa.nome, pessoa.email]);

		});

		res.json(true);
	}
}

export = IndexRoute;
