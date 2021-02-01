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
	npx -n '--experimental-vm-modules' jest

# запуск расчета покрытия тестами
test-coverage:
	npx jest -- --coverage --coverageProvider=v8
