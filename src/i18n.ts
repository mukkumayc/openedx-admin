import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
	ru: {
		translation: {
			'Get a list of student grades': 'Получить список оценок студентов',
			'Get a list of students': 'Получить список студентов',
			'Enroll a student in a course': 'Зачислить студента на курс',
			'Unenroll a student from a course': 'Отчислить студента с курса',
			'Get list of student courses': 'Получить список курсов студента',
			"Get a list of student's files in a course":
				'Получить список файлов учащегося в курсе',
			'Register new users': 'Зарегистрировать новых пользователей',
			Success: 'Успешно',
			'Enrolling a student in a course': 'Зачисление студента на курс',
			'Unenrolling a student from a course': 'Отчисление студента с курса',
			Username: 'Имя пользователя',
			Course: 'Курс',
			Submit: 'Отправить',
			'Return to home': 'Вернуться домой',
			'Page not found': 'Страница не найдена',
			pageNotFound: 'Извините, страница <1>{{path}}</1> не найдена.',
			'Back to Home': 'К домашней странице',
			'List of student courses': 'Список курсов студента',
			"User didn't enrolled in any courses":
				'Пользователь не был зачислен ни на какие курсы',
			'No grades': 'Нет оценок',
			'There are no students for this course': 'У этого курса нет студентов',
			'Course users and grades': 'Пользователи и оценки курса',
			'Select course': 'Выберите курс',
			'Specify user': 'Указать пользователя',
			'Get grades': 'Получить оценки',
			'Web app for an online course platform management':
				'Веб приложение для управления онлайн курсами',
			Loading: 'Загрузка',
			'Get additional user files': 'Получить дополнительные файлы пользователя',
			'No files found for this user and course':
				'Файлы не найдены для данных пользователя и курса',
			'Enter email or username':
				'Введите электронную почту или имя пользователя',
			'Write course name and select to "List students" or to "Add a student"':
				'Напишите имя курса и выберите "Вывести список студентов" или "Добавить студента"',
			'List students': 'Вывести список студентов',
			'Add a student': 'Добавить студента',
			Delete: 'Удалить',
			'Nobody enrolled in this course': 'Никто не зачислен на данный курс',
			addingStudentToCourse: 'Добавление студента в курс "{{courseName}}"',
			Close: 'Закрыть',
			'Enter username': 'Введите имя пользователя',
			'': ''
		}
	}
}

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: 'ru', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
		// you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
		// if you're using a language detector, do not define the lng option

		interpolation: {
			escapeValue: false // react already safes from xss
		}
	})

export default i18n
