﻿import app = require("teem");

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

	public async login(req: app.Request, res: app.Response) {
		res.render("index/login");
	}

	public async embarcacoes(req: app.Request, res: app.Response) {
		res.render("index/embarcacoes");
	}

	@app.http.post()
	// Configuração adicional para poder receber FormData e/ou arquivos.
	@app.route.formData()
	public async criarEmbarcacao(req: app.Request, res: app.Response) {
		// Os dados enviados via POST ficam dentro de req.body
		let embarcacao = req.body;

		// É sempre muito importante validar os dados do lado do servidor,
		// mesmo que eles tenham sido validados do lado do cliente!!!
		if (!embarcacao) {
			res.status(400);
			res.json("Dados inválidos");
			return;
		}

		if (!embarcacao.nome) {
			res.status(400);
			res.json("Nome inválido");
			return;
		}

		embarcacao.tamanho = parseInt(embarcacao.tamanho);
		if (isNaN(embarcacao.tamanho) || embarcacao.tamanho <= 0) {
			res.status(400);
			res.json("Tamanho inválido");
			return;
		}

		// Verifica se a foto foi enviada
		if (!req.uploadedFiles || !req.uploadedFiles.foto) {
			res.status(400);
			res.json("Foto inválida");
			return;
		}

		await app.sql.connect(async (sql) => {
			await app.fileSystem.saveUploadedFile("public/img/embarcacoes/" + 1 + ".jpg", req.uploadedFiles.foto);

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().
			await sql.beginTransaction();

			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			await sql.query("INSERT INTO pessoa (nome, email) VALUES (?, ?)", [embarcacao.nome, embarcacao.email]);

			const idembarcacao: number = await sql.scalar("SELECT last_insert_id()");

			await app.fileSystem.saveUploadedFile("public/img/embarcacoes/" + idembarcacao + ".jpg", req.uploadedFiles.foto);

			await sql.commit();
		});

		res.json(true);
	}
}

export = IndexRoute;
