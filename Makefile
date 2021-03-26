# установка зависимостей для проекта
install:
	npm install

# запуск генератора различий
gendiff $(filepath1) $(filepath2):
	node bin/gendiff.js $(filepath1) $(filepath2)

# публикация пакета игры
publish:
	npm publish --dry-run

# проверка линтером
lint:
	npx eslint .

# запуск тестов
test:
	npm test

# запуск расчета покрытия тестами
test-coverage:
	npm test -- --coverage --coverageProvider=v8
