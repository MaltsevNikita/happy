'use client';

import { useState, useEffect } from 'react';

// Система дизайна
const designSystem = {
  colors: {
    primary: "#0d2b56",
    secondary: "#c4a35a",
    accent: "#e6c78d",
    background: "#000000",
    textPrimary: "#ffffff",
    textSecondary: "#c4a35a",
    success: "#4caf50",
    error: "#f44336",
    disabled: "#555555"
  },
  typography: {
    fontFamily: "var(--font-roboto), 'Roboto', sans-serif",
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "#c4a35a",
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    },
    question: {
      fontSize: "1.8rem",
      fontWeight: "500",
      color: "#ffffff",
      lineHeight: "1.4"
    },
    answerOption: {
      fontSize: "1.4rem",
      fontWeight: "500",
      color: "#ffffff",
      padding: "1rem 1.5rem"
    },
    prizeLabel: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#c4a35a"
    },
    body: {
      fontSize: "1rem",
      fontWeight: "normal",
      color: "#e0e0e0"
    }
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem"
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "16px"
  },
  shadows: {
    default: "0 4px 12px rgba(0, 0, 0, 0.7)",
    hover: "0 6px 20px rgba(196, 163, 90, 0.5)"
  },
  buttons: {
    primary: {
      backgroundColor: "#c4a35a",
      color: "#0d2b56",
      border: "none",
      borderRadius: "8px",
      padding: "0.75rem 1.5rem",
      fontSize: "1.2rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    secondary: {
      backgroundColor: "transparent",
      color: "#c4a35a",
      border: "2px solid #c4a35a",
      borderRadius: "8px",
      padding: "0.75rem 1.5rem",
      fontSize: "1.2rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    disabled: {
      backgroundColor: "#5555",
      color: "#888888",
      cursor: "not-allowed"
    }
  },
  components: {
    questionBox: {
      backgroundColor: "#0d2b56",
      padding: "2rem",
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
      marginBottom: "2rem"
    },
    answerOption: {
      backgroundColor: "#1a3d6d",
      border: "2px solid transparent",
      borderRadius: "12px",
      marginBottom: "1rem",
      transition: "border-color 0.3s ease, background-color 0.3s ease"
    },
    answerOptionHover: {
      borderColor: "#c4a35a",
      backgroundColor: "#22487e"
    },
    answerOptionSelected: {
      backgroundColor: "#c4a35a",
      color: "#0d2b56"
    },
    prizeLadder: {
      itemHeight: "3rem",
      itemPadding: "0.5rem 1rem",
      guaranteedLevelColor: "#4caf50",
      currentLevelColor: "#c4a35a",
      defaultColor: "#aaaaaa"
    },
    lifelineButton: {
      width: "4rem",
      height: "4rem",
      borderRadius: "50%",
      backgroundColor: "#1a3d6d",
      color: "#c4a35a",
      fontSize: "1.2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      margin: "0 0.5rem"
    }
  },
  animations: {
    fadeIn: "opacity 0.5s ease-in-out",
    pulseGold: "pulse 2s infinite"
  },
  breakpoints: {
    mobile: "max-width: 767px",
    tablet: "min-width: 768px and max-width: 1023px",
    desktop: "min-width: 1024px"
  }
};

const QuizComponent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    phoneAFriend: false,
    askTheAudience: false
  });
  const [quizData, setQuizData] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizList, setQuizList] = useState([]);

  // Получаем список викторин при загрузке компонента
  useEffect(() => {
    // Создаем список викторин из доступных файлов
    const quizzes = [];
    for (let i = 1; i <= 11; i++) {
      const numStr = i.toString().padStart(2, '0');
      quizzes.push({
        id: `quiz${numStr}`,
        name: `Викторина ${i}`
      });
    }
    setQuizList(quizzes);
  }, []);

  const currentQuestion = quizData?.quiz[currentQuestionIndex];
  const totalQuestions = quizData?.quiz.length || 0;

 // Призовая сетка
  const prizeLevels = [
    { level: 1, amount: "100", guaranteed: false },
    { level: 2, amount: "200", guaranteed: false },
    { level: 3, amount: "300", guaranteed: false },
    { level: 4, amount: "500", guaranteed: false },
    { level: 5, amount: "1,000", guaranteed: true }, // первый гарантированный приз
    { level: 6, amount: "2,000", guaranteed: false },
    { level: 7, amount: "4,000", guaranteed: false },
    { level: 8, amount: "8,000", guaranteed: false },
    { level: 9, amount: "16,000", guaranteed: false },
    { level: 10, amount: "32,000", guaranteed: true }, // второй гарантированный приз
    { level: 11, amount: "64,000", guaranteed: false },
    { level: 12, amount: "125,000", guaranteed: false },
    { level: 13, amount: "250,000", guaranteed: false },
    { level: 14, amount: "500,000", guaranteed: false },
    { level: 15, amount: "1,000,000", guaranteed: true } // максимальный приз
  ];

  // Функция для загрузки выбранной викторины
  const loadQuiz = async (quizId) => {
    try {
      // Импортируем нужный файл викторины
      const quizModule = await import(`../data/${quizId}.json`);
      setQuizData(quizModule.default);
      setSelectedQuiz(quizId);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(null);
      setUsedLifelines({
        fiftyFifty: false,
        phoneAFriend: false,
        askTheAudience: false
      });
    } catch (error) {
      console.error(`Ошибка загрузки викторины ${quizId}:`, error);
    }
  };

  // Функция для обработки выбора ответа
  const handleAnswerSelect = (option) => {
    if (selectedAnswer || !currentQuestion) return; // Запрет повторного выбора
    
    setSelectedAnswer(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    // Переход к следующему вопросу через 1.5 секунды
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  // Функция использования подсказки 50/50
  const useFiftyFifty = () => {
    if (usedLifelines.fiftyFifty || !currentQuestion) return;
    
    setUsedLifelines(prev => ({ ...prev, fiftyFifty: true }));
    
    // Оставляем только правильный ответ и один неправильный
    const incorrectOptions = currentQuestion.options.filter(
      option => option !== currentQuestion.correctAnswer
    );
    
    // Выбираем случайный неправильный ответ
    const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
    
    const updatedQuiz = {...quizData};
    updatedQuiz.quiz[currentQuestionIndex] = {
      ...currentQuestion,
      options: [currentQuestion.correctAnswer, randomIncorrect].sort(() => Math.random() - 0.5)
    };
    setQuizData(updatedQuiz);
  };

  // Сброс игры и возврат к выбору викторины
  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setUsedLifelines({
      fiftyFifty: false,
      phoneAFriend: false,
      askTheAudience: false
    });
  };

  // Определяем стиль для варианта ответа
  const getAnswerStyle = (option) => {
    if (!currentQuestion) return {};
    
    let style = {
      ...designSystem.components.answerOption,
      ...designSystem.typography.answerOption,
      cursor: selectedAnswer ? 'default' : 'pointer',
      width: '100%',
      textAlign: 'left'
    };

    if (selectedAnswer) {
      if (option === currentQuestion.correctAnswer) {
        style.backgroundColor = designSystem.colors.success;
        style.color = designSystem.colors.textPrimary;
      } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
        style.backgroundColor = designSystem.colors.error;
        style.color = designSystem.colors.textPrimary;
      }
    } else if (selectedAnswer === option) {
      style = {
        ...style,
        ...designSystem.components.answerOptionSelected
      };
    }

    return style;
  };

  // Если викторина не выбрана, показываем экран выбора
  if (!selectedQuiz) {
    return (
      <div style={{ 
        backgroundColor: designSystem.colors.background, 
        minHeight: '100vh', 
        padding: designSystem.spacing.xxl,
        fontFamily: designSystem.typography.fontFamily
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            ...designSystem.typography.heading,
            marginBottom: designSystem.spacing.xl
          }}>
            Кто хочет стать миллионером?
          </h1>
          
          <div style={{
            backgroundColor: designSystem.components.questionBox.backgroundColor,
            padding: designSystem.components.questionBox.padding,
            borderRadius: designSystem.components.questionBox.borderRadius,
            boxShadow: designSystem.components.questionBox.boxShadow,
            marginBottom: designSystem.spacing.xl
          }}>
            <h2 style={{
              ...designSystem.typography.question,
              marginBottom: designSystem.spacing.lg
            }}>
              Выберите викторину
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: designSystem.spacing.md }}>
              {quizList.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => loadQuiz(quiz.id)}
                  style={{
                    ...designSystem.buttons.secondary,
                    width: '100%',
                    padding: designSystem.spacing.lg
                  }}
                >
                  {quiz.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если результаты, показываем их
  if (showResult && quizData) {
    return (
      <div style={{ 
        backgroundColor: designSystem.colors.background, 
        minHeight: '100vh', 
        padding: designSystem.spacing.xxl,
        fontFamily: designSystem.typography.fontFamily
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            ...designSystem.typography.heading,
            marginBottom: designSystem.spacing.xl
          }}>
            Результаты викторины
          </h1>
          
          <div style={{
            backgroundColor: designSystem.components.questionBox.backgroundColor,
            padding: designSystem.components.questionBox.padding,
            borderRadius: designSystem.components.questionBox.borderRadius,
            boxShadow: designSystem.components.questionBox.boxShadow,
            marginBottom: designSystem.spacing.xl
          }}>
            <p style={{
              ...designSystem.typography.question,
              fontSize: '2rem',
              marginBottom: designSystem.spacing.lg
            }}>
              Вы набрали {score} из {totalQuestions} очков!
            </p>
            
            <p style={{
              ...designSystem.typography.body,
              fontSize: '1.5rem',
              color: score === totalQuestions ? designSystem.colors.success : 
                     score >= totalQuestions / 2 ? designSystem.colors.textSecondary : 
                     designSystem.colors.error
            }}>
              {score === totalQuestions ? 'Отлично! Вы настоящий миллионер!' :
               score >= totalQuestions / 2 ? 'Хорошая работа! Не плохой результат!' :
               'Попробуйте еще раз!'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: designSystem.spacing.md, justifyContent: 'center' }}>
            <button
              onClick={resetQuiz}
              style={{
                ...designSystem.buttons.primary,
                fontSize: '1.2rem',
                padding: '1rem 2rem'
              }}
            >
              Выбрать другую викторину
            </button>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowResult(false);
                setIsCorrect(null);
                setUsedLifelines({
                  fiftyFifty: false,
                  phoneAFriend: false,
                  askTheAudience: false
                });
                // Восстанавливаем исходные вопросы без изменений от подсказок
                loadQuiz(selectedQuiz);
              }}
              style={{
                ...designSystem.buttons.secondary,
                fontSize: '1.2rem',
                padding: '1rem 2rem'
              }}
            >
              Играть снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Основной экран викторины
  return (
    <div style={{ 
      backgroundColor: designSystem.colors.background, 
      minHeight: '100vh', 
      padding: designSystem.spacing.xxl,
      fontFamily: designSystem.typography.fontFamily
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Заголовок */}
        <h1 style={{
          ...designSystem.typography.heading,
          textAlign: 'center',
          marginBottom: designSystem.spacing.xl
        }}>
          Кто хочет стать миллионером?
        </h1>
        
        <div style={{ display: 'flex', gap: designSystem.spacing.xl }}>
          {/* Призовая лестница */}
          <div style={{ 
            flex: '0 0 200px',
            display: 'flex',
            flexDirection: 'column-reverse', // Изменено на column-reverse для отображения снизу вверх
            alignItems: 'center'
          }}>
            {prizeLevels.map((level, index) => (
              <div
                key={level.level}
                style={{
                  height: designSystem.components.prizeLadder.itemHeight,
                  padding: designSystem.components.prizeLadder.itemPadding,
                  backgroundColor: 
                    index === currentQuestionIndex 
                      ? designSystem.components.prizeLadder.currentLevelColor
                    : index < currentQuestionIndex
                      ? level.guaranteed 
                        ? designSystem.components.prizeLadder.guaranteedLevelColor
                        : designSystem.colors.disabled
                      : level.guaranteed
                        ? designSystem.components.prizeLadder.guaranteedLevelColor
                        : designSystem.components.prizeLadder.defaultColor,
                  color: designSystem.colors.background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: designSystem.borderRadius.small,
                  marginBottom: '2px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  minWidth: '80px'
                }}
              >
                {level.amount}
              </div>
            ))}
          </div>
          
          {/* Основная область викторины */}
          <div style={{ flex: 1 }}>
            {/* Информационная панель */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: designSystem.spacing.lg
            }}>
              <div style={{
                ...designSystem.typography.body,
                color: designSystem.textSecondary,
                fontSize: '1.2rem'
              }}>
                Вопрос {currentQuestionIndex + 1} из {totalQuestions} | {selectedQuiz.replace('quiz', 'Викторина №')}
              </div>
              
              {/* Кнопки подсказок */}
              <div style={{
                display: 'flex',
                gap: designSystem.spacing.sm
              }}>
                <button
                  onClick={useFiftyFifty}
                  disabled={usedLifelines.fiftyFifty}
                  style={{
                    ...designSystem.components.lifelineButton,
                    backgroundColor: usedLifelines.fiftyFifty 
                      ? designSystem.colors.disabled 
                      : designSystem.components.lifelineButton.backgroundColor,
                    cursor: usedLifelines.fiftyFifty ? 'not-allowed' : 'pointer'
                  }}
                  title="50/50"
                >
                  50/50
                </button>
                <button
                  disabled
                  style={{
                    ...designSystem.components.lifelineButton,
                    backgroundColor: designSystem.colors.disabled,
                    cursor: 'not-allowed'
                  }}
                  title="Звонок другу"
                >
                  ТФ
                </button>
                <button
                  disabled
                  style={{
                    ...designSystem.components.lifelineButton,
                    backgroundColor: designSystem.colors.disabled,
                    cursor: 'not-allowed'
                  }}
                  title="Спросить аудиторию"
                >
                  СА
                </button>
              </div>
            </div>
            
            {/* Блок вопроса */}
            <div style={designSystem.components.questionBox}>
              <h2 style={{
                ...designSystem.typography.question,
                marginBottom: designSystem.spacing.lg
              }}>
                {currentQuestion?.question}
              </h2>
              
              <div style={{ marginTop: designSystem.spacing.lg }}>
                {currentQuestion?.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                    style={getAnswerStyle(option)}
                    onMouseEnter={(e) => {
                      if (!selectedAnswer) {
                        e.target.style.borderColor = designSystem.components.answerOptionHover.borderColor;
                        e.target.style.backgroundColor = designSystem.components.answerOptionHover.backgroundColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedAnswer) {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.backgroundColor = designSystem.components.answerOption.backgroundColor;
                      }
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
