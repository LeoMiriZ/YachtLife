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

	public async login(req: app.Request, res: app.Response) {
		res.render("index/login");
	}

	public async embarcacoes(req: app.Request, res: app.Response) {
		let lista: any[];

		await app.sql.connect(async (sql) => {

			lista = await sql.query("SELECT e.idembarcacao, e.nome, e.tamanho, e.peso, e.tripulantes, e.cabines, e.ano, e.preco, m.nome modalidade FROM embarcacao e INNER JOIN modalidade m ON m.idmodalidade = e.idmodalidade ORDER BY e.nome ASC");

		});

		const opcoes = {
			lista: lista
		};

		res.render("index/embarcacoes", opcoes);
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

		embarcacao.peso = parseInt(embarcacao.peso);
		if (isNaN(embarcacao.peso) || embarcacao.peso <= 0) {
			res.status(400);
			res.json("Peso inválido");
			return;
		}

		embarcacao.tripulantes = parseInt(embarcacao.tripulantes);
		if (isNaN(embarcacao.tripulantes) || embarcacao.tripulantes <= 0) {
			res.status(400);
			res.json("Número de tripulantes inválido");
			return;
		}

		embarcacao.cabines = parseInt(embarcacao.cabines);
		if (isNaN(embarcacao.cabines) || embarcacao.cabines <= 0) {
			res.status(400);
			res.json("Número de cabines inválido");
			return;
		}

		embarcacao.ano = parseInt(embarcacao.ano);
		if (isNaN(embarcacao.ano) || embarcacao.ano <= 0 || embarcacao.ano > 2023) {
			res.status(400);
			res.json("Ano de fabricação inválido");
			return;
		}

		embarcacao.preco = parseInt(embarcacao.preco);
		if (isNaN(embarcacao.preco) || embarcacao.preco <= 0) {
			res.status(400);
			res.json("Preço inválido");
			return;
		}

		// Verifica se a foto foi enviada
		if (!req.uploadedFiles || !req.uploadedFiles.foto) {
			res.status(400);
			res.json("Foto inválida");
			return;
		}

		await app.sql.connect(async (sql) => {

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().
			await sql.beginTransaction();

			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			await sql.query("INSERT INTO embarcacao (nome, tamanho, peso, tripulantes,cabines,ano,preco, idmodalidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
			[embarcacao.nome, embarcacao.tamanho,embarcacao.peso,embarcacao.tripulantes,
			embarcacao.cabines,embarcacao.ano,embarcacao.preco, embarcacao.idmodalidade]);

			const idembarcacao: number = await sql.scalar("SELECT last_insert_id()");

			await app.fileSystem.saveUploadedFile("public/img/embarcacoes/" + idembarcacao + ".jpg", req.uploadedFiles.foto);

			await sql.commit();
		});

		res.json(true);
	}
}

export = IndexRoute;
