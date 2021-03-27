# установка зависимостей для проекта
setup:
	npm ci

# установка gendiff cli
install:
	npm link

# удаление gendiff cli
uninstall:
	npm unlink

# запуск генератора различий
gendiff $(filepath1) $(filepath2):
	bin/gendiff.js $(filepath1) $(filepath2)

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
