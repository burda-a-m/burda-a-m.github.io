'use strict';

// Элементы DOM на странице
const body = document.querySelector('body');
const btn_burger = document.querySelector('#js__btn-burger');
const
  mnu_break = document.querySelector('#js__nav-btn-break'),
  mnu_warmup = document.querySelector('#js__nav-btn-warmup');

const score_input = {
    'red': document.querySelector('#js__score-input--red'),
    'blue': document.querySelector('#js__score-input--blue'),
  },
  score_display = {
    'red': document.querySelector('#js__score-display--red'),
    'blue': document.querySelector('#js__score-display--blue'),
  };

const end_select = document.querySelector('#js__end-select'),
  end_display = document.querySelector('#js__end-display'),
  info_ends_count_display = document.querySelector('#js__info-ends-count'),
  info_time_one_end_display = document.querySelector('#js__info-time-one-end'),
  message_footer_display = document.querySelector('#js__footer-message');

const 
  btn_break = document.querySelector('#js__btn-break'),
  btn_warmup = document.querySelector('#js__btn-warmup');

const team_display = {
  'red': document.querySelector('#js__team-display--red'),
  'blue': document.querySelector('#js__team-display--blue'),
};

const time_display = {
    'red': document.querySelector('#js__time-display--red'),
    'blue': document.querySelector('#js__time-display--blue'),
  },
  btn_start_stop = {
    'red': document.querySelector('#js__button-start-stop--red'),
    'blue': document.querySelector('#js__button-start-stop--blue'),
  },
  //кнопки для редактирования времени игроков
  btn_time_edit_gamer = {
    'red':  {
      'inc': document.querySelector('#js__btn-time-edit--inc-red'),
      'dec': document.querySelector('#js__btn-time-edit--dec-red')
    },
    'blue': {
      'inc': document.querySelector('#js__btn-time-edit--inc-blue'),
      'dec': document.querySelector('#js__btn-time-edit--dec-blue')
    }
  }  ;

const
  newmatch_input_team = {
    'red': document.querySelector('#js__input-team--red'),
    'blue': document.querySelector('#js__input-team--blue'),
  },
  newmatch_input_time_end = {
    'minut': document.querySelector('#js__input-time-end--minut'),
    'second': document.querySelector('#js__input-time-end--second')
  },
  newmatch_input_end_count = document.querySelector('#js__end-count'),
  newmatch_input_time_warmup = {
    'minut': document.querySelector('#js__input-time-warmup--minut'),
    'second': document.querySelector('#js__input-time-warmup--second')
  },
  newmatch_input_time_break = {
    'minut': document.querySelector('#js__input-time-break--minut'),
    'second': document.querySelector('#js__input-time-break--second')
  };

const 
  breaktime_display = document.querySelector('#js__break-time-value');

const 
  audio = document.querySelector('.audio');

// Глобальные переменные

var team = {
  // Названия команд
  'red': team_default['red'],
  'blue': team_default['blue']
};

var time = {
  // Оставшееся игровое время для каждого игрока на один энд в милисекундах
  'red': time_one_end,
  'blue': time_one_end,
};

var timestamp = {
  // Временные отметки для звукового сигнала и текстовых оповещений (ключи в секундах).
  // true - пройденные, false - непройденные
  'red': {
    60: false,
    30: false,
  },
  'blue': {
    60: false,
    30: false,
  },
};

var timer_active = ''; // Какой таймер включен:
//'red', 'blue', 'pre', 'break'.
// Если никакой, то пустая строка
var system_time_start = Date.now(); // Системное время старта таймера в мс. Меняется каждый раз при запуске таймера
var my_timer = null; // Глобальная переменная для setInterval под отсчет обратного времени игроков и перерывов

var my_timer_edit = null; // Глобальная переменная для setInterval под редактировния времени игроков
var my_timeout_edit = null; // Глобальная переменная для setTimeout под редактировния времени игроков
var my_timer_edit_iteration_count = 0; // Кол-во итераций при нажатых кнопках редактирования времени игроков


var my_timeout = null; // Глобальная переменная для setTimeout (погасить сообщения внизу)

// Страница загуржена полностью
document.addEventListener('DOMContentLoaded', function () {
  init_new_match();

  // В шапке по клику на бургер открываю/закрываю меню
  btn_burger.addEventListener('click', function () {
    body.classList.toggle('body--menu-open');
    body.classList.toggle('body--overlay');
  });

  // При выборе в выпадающем списке энда меняется энд и на табло
  end_select.addEventListener('change', function () {
    end_display.innerHTML = this.value;
  });

  /*****************************
   * Обработка событий при взаимодействии с кнопками для редактирования времени игроков
   *****************************/

  // Взаимодействие с кнопкой "+" для красных
    btn_time_edit_gamer['red']['inc'].addEventListener('mousedown', function () {
      timer_gamer_edit('red','inc');
      my_timeout_edit = setTimeout(function() {
        my_timer_edit = setInterval(function () {
          timer_gamer_edit('red','inc');
        }, 100);
        clearTimeout(my_timeout_edit);
      }, 1000);
    });
    ///////////
    btn_time_edit_gamer['red']['inc'].addEventListener('mouseup', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['red']['inc'].addEventListener('mouseout', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['red']['inc'].addEventListener('mouseleave', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
  
  // Взаимодействие с кнопкой "-" для красных
    btn_time_edit_gamer['red']['dec'].addEventListener('mousedown', function () {
      timer_gamer_edit('red','dec');
      my_timeout_edit = setTimeout(function() {
        my_timer_edit = setInterval(function () {
          timer_gamer_edit('red','dec');
        }, 100);
        clearTimeout(my_timeout_edit);
      }, 1000);
    });
    ///////////
    btn_time_edit_gamer['red']['dec'].addEventListener('mouseup', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['red']['dec'].addEventListener('mouseout', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['red']['dec'].addEventListener('mouseleave', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });

    // Взаимодействие с кнопкой "+" для синих
    btn_time_edit_gamer['blue']['inc'].addEventListener('mousedown', function () {
      timer_gamer_edit('blue','inc');
      my_timeout_edit = setTimeout(function() {
        my_timer_edit = setInterval(function () {
          timer_gamer_edit('blue','inc');
        }, 100);
        clearTimeout(my_timeout_edit);
      }, 1000);
    });
    ///////////
    btn_time_edit_gamer['blue']['inc'].addEventListener('mouseup', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['blue']['inc'].addEventListener('mouseout', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['blue']['inc'].addEventListener('mouseleave', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
  
  // Взаимодействие с кнопкой "-" для синих
    btn_time_edit_gamer['blue']['dec'].addEventListener('mousedown', function () {
      timer_gamer_edit('blue','dec');
      my_timeout_edit = setTimeout(function() {
        my_timer_edit = setInterval(function () {
          timer_gamer_edit('blue','dec');
        }, 100);
        clearTimeout(my_timeout_edit);
      }, 1000);
    });
    ///////////
    btn_time_edit_gamer['blue']['dec'].addEventListener('mouseup', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['blue']['dec'].addEventListener('mouseout', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
    ///////////
    btn_time_edit_gamer['blue']['dec'].addEventListener('mouseleave', function () {
      clearInterval(my_timer_edit);
		  clearTimeout(my_timeout_edit);
      my_timer_edit_iteration_count = 0;
    });
  
  /*****************************
   * /////////// Обработка событий при взаимодействии с кнопками для редактирования времени игроков
   *****************************/

}); /* document.addEventListener('DOMContentLoaded'...) */
