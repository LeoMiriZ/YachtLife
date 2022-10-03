"use strict";

// Isso é só um helper para podermos descobrir quantos fetch() estão em execução!
//
// Ele funciona da mesma forma que a Fetch API original, só que cria uma variável
// global fetchAtivo, para contar quantos fetch() estão em execução :)
//
// Documentação da Fetch API original:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

(function () {
	const fetchOriginal = window.fetch;
	if (fetchOriginal) {
		window.fetch = function () {
			window.fetchAtivo++;

			const thisOriginal = this,
				argumentsOriginal = arguments;

			return new Promise(function (resolve, reject) {
				fetchOriginal.apply(thisOriginal, argumentsOriginal).then(function () {
					window.fetchAtivo--;
					resolve.apply(thisOriginal, arguments);
				}, function () {
					window.fetchAtivo--;
					reject.apply(thisOriginal, arguments);
				});
			});
		};
		window.fetchAtivo = 0;
	}
})();
