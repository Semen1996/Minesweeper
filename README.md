# Проект: Сапёр
Сайт на GitHub Pages: https://semen1996.github.io/Minesweeper/ 

«Сапер» – это несложная игра, цель которой открыть все ячейки на поле так, чтобы не “взорвать” ни одну мину.

## Функционал:

* Поле 16х16, на котором в рандомном порядке располагаются 40 мин
* Слева счетчик мин от 40 до нуля, справа секундомер
* Мины расставляются случайно
* Первый клик никогда не бывает по мине
* Если рядом с открытым полем есть другие поля без мин поблизости, они открываются автоматически
* Правая клавиша ставит флажок - так отмечается, где предполагается мина
* Если кликнуть правой кнопкой по флажку, ставится вопрос, еще раз - выделение снимается
* Клик по смайлику перезапускает игру;
* После проигрыша смайлик заменяется на грустный, пользователю раскрывается карта мин
* После того, как пользователь открыл все поля кроме мин, смайлик надевает солнечные очки

## Технологии: 

* HTML
* CSS
* JS

## Инструкция по установке: 


Скопируйте проект к себе с помощью команды

```
git clone git@github.com:Semen1996/Minesweeper.git
```

Затем запустите файл ***index.html***


## Что необходимо доработать:

* Улучшить файл index.js (его можно существенно оптимизировать и сделать более понятным)
* Добавить функционал отключения секундомера после проигрыша или выигрыша
* Добавить испуганного смайлика, когда пользователь нажал на поле, но еще не отпустил кнопку мыши
* Сделать разные уровни (новичок, любитель, профессионал, особый)
* Сделать меню под настройку уровней