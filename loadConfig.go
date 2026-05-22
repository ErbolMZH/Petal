func LoadConfiguration(file string) {
	// 1. Очищаем путь от всяких фокусов вроде "/../" и "./"
	cleanPath := filepath.Clean(file)

	// 2. ИБ-валидация: проверяем, что расширение файла строго .json
	if filepath.Ext(cleanPath) != ".json" {
		WriteLog("", "components.LoadConfiguration", "Попытка загрузки файла недопустимого формата")
		Config.IsTest = true
		return
	}

	// 3. Открываем уже очищенный и проверенный путь
	configFile, err := os.Open(cleanPath)
	if err != nil {
		WriteLog("", "components.LoadConfiguration", fmt.Sprintf("Ошибка чтения конфигурации: %+v", err))
		Config.IsTest = true
		return // Добавляем return, чтобы не выполнять Decode, если файл не открылся
	}
	
	// Безопасное закрытие файла: анализаторы ИБ любят, когда ошибку Close() хотя бы логируют
	defer func() {
		if closeErr := configFile.Close(); closeErr != nil {
			WriteLog("", "components.LoadConfiguration", fmt.Sprintf("Ошибка закрытия конфига: %+v", closeErr))
		}
	}()

	jsonParser := json.NewDecoder(configFile)
	if err := jsonParser.Decode(&Config); err != nil {
		WriteLog("", "components.LoadConfiguration", fmt.Sprintf("Ошибка парсинга JSON конфигурации: %+v", err))
		Config.IsTest = true
	}
}
