import app = require("teem");

app.run({
	root: "/yatchlife",
	// Configurações de acesso ao banco de dados.
	// Mais informações: https://www.npmjs.com/package/mysql2#using-connection-pools
	sqlConfig: {
		connectionLimit: 30,
		waitForConnections: true,
		charset: "utf8mb4",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "root",
		database: "embarcacoes"
	}
});
