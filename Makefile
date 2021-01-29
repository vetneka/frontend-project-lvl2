# установка зависимостей для проекта
install:
	npm install

# запуск генератора различий
brain-games:
	node bin/gendiff.js

# публикация пакета игры
publish:
	npm publish --dry-run

# проверка линтером
lint:
	npx eslint .
