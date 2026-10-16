"use strict";

// Конвертация таймера из мс в вид "Минуты:Секунды"
// в формате mm:ss в большую сторону
function ms_to_minutsec(ms) {
  if (ms < 0) {
    ms = 0;
  }
  var my_second = Math.ceil(ms / 1000) % 60;
  var my_minut = Math.floor(Math.ceil(ms / 1000) / 60);

  my_minut = my_minut < 10 ? "0" + String(my_minut) : String(my_minut);
  my_second = my_second < 10 ? "0" + String(my_second) : String(my_second);

  return my_minut + ":" + my_second;
} /* function ms_to_minutsec(ms) */

// Конвертация таймера из мс в объект
function ms_to_object_minutsec(ms) {
  if (ms < 0) {
    ms = 0;
  }
  var my_second = Math.ceil(ms / 1000) % 60;
  var my_minut = Math.floor(Math.ceil(ms / 1000) / 60);

  var my_obj = {
    'minut' : my_minut,
    'second' : my_second
  }

  return my_obj;
} /* function ms_to_minutsec(ms) */

// Удаляем все классы из <body>, чтобы закрыть все попапы и оверлей
function close_all_popups() {
  body.className = '';
}

// Функция сброса временных отметок игроков
function timestamp_reset() {
  timestamp["red"][60] = time["red"] <= 60 * 1000;
  timestamp["blue"][60] = time["blue"] <= 60 * 1000;
  timestamp["red"][30] = time["red"] <= 30 * 1000;
  timestamp["blue"][30] = time["blue"] <= 30 * 1000;
} /* function timestamp_reset() */

// Кнопки 'Старт/Стоп' делает активными или неактивными, взависимости
// от оставшегося времени, и выводит на них нужные надписи
function disabled_toggle_btn_start_stop() {
  for (const key in btn_start_stop) {
    btn_start_stop[key].textContent = btn_start_stop_caption["start"];
    if (time[key] > 0) {
      btn_start_stop[key].removeAttribute("disabled");
    } else {
      btn_start_stop[key].setAttribute("disabled", "");
    }
  }
} /* function disabled_toggle_btn_start_stop() */

// Фуккция сброса времени игроков
function time_reset() {
  time["red"] = time_one_end;
  time["blue"] = time_one_end;

  // Сброс временных отметок игроков
  timestamp_reset();

  time_display["red"].textContent = ms_to_minutsec(time_one_end);
  time_display["blue"].textContent = ms_to_minutsec(time_one_end);

  // Кнопки 'Старт/Стоп' делаю активными и вывожу на них соответствущие надписи
  disabled_toggle_btn_start_stop();
} /* function time_reset() */


// Функция ручного редактирования времени игроков
// Аргумент operation может принимать значения 'dec' или 'inc'
function timer_gamer_edit(color, operation) {
  // Высчитываю милисекунды времни игрока кратно 1000 в бОльшую сторону
  var my_ms_mill = 1000 * Math.ceil(time[color] / 1000);
  my_timer_edit_iteration_count++;
  var my_multiple = (operation=='dec') ? -1 : 1;
  var my_timer_edit_step = 1000 * my_multiple;

  if (my_timer_edit_iteration_count>10) {my_timer_edit_step = 5000 * my_multiple;}
    else if (my_timer_edit_iteration_count>5) {my_timer_edit_step = 2000 * my_multiple;}


  time[color] = my_ms_mill + my_timer_edit_step;
  if(time[color]<0) { time[color] = 0; }
  if(time[color]>time_one_end) { time[color] = time_one_end; }

  // Переформирую врменные отметки и вывожу новое время игрока на монитор
  timestamp[color][60] = time[color] < 60 * 1000;
  timestamp[color][30] = time[color] < 30 * 1000;
  time_display[color].textContent = ms_to_minutsec(time[color]);

  // Кнопку 'Старт/Стоп' делаю активной или неактивной
  if (time[color] > 0) {
      btn_start_stop[color].removeAttribute("disabled");
    } else {
      btn_start_stop[color].setAttribute("disabled", "");
    }

} /* function timer_gamer_edit(color, operation) */


// Инициализация нового матча
function init_new_match() {
  // Обнуляю счет
  score_input["red"].value = 0;
  score_input["blue"].value = 0;
  score_display["red"].textContent = "0";
  score_display["blue"].textContent = "0";
  // Формирую новый выпадающий список для выбора энда
  // и вывожу 'End 1' на табло
  var res_html = "";
  for (var i = 1; i <= end_count; i++) {
    var my_end = `End ${i}`;
    res_html += `<option value='${my_end}'`;
    if (i == 1) {
      res_html += " selected"; // Выделяю 1-й энд в выпадающем списке
      end_display.textContent = my_end; // Вывожу 1-й энд на табло
    }
    res_html += `>${my_end}</option>`;
  }
  res_html += '<option value="Extra End">Extra End</option>';
  end_select.innerHTML = res_html;
  // Вывожу на табло названия команд/игроков
  team_display["red"].textContent = team["red"];
  team_display["blue"].textContent = team["blue"];
  // Сбрасываю игровое время
  time_reset();
  //Вывожу информацию о матче внизу
  info_ends_count_display.textContent = end_count;
  info_time_one_end_display.textContent = ms_to_minutsec(time_one_end);
  // Удаляю сообщения внизу
  message_footer_display.textContent = "";
  //Меняю надпись на кнопке "Разминка"
  btn_warmup.textContent = caption_btn_warmup + ' (' + ms_to_minutsec(time_warmup) + ')';
  //Меняю надпись на кнопке "Перерыв"
  btn_break.textContent = caption_btn_break + ' (' + ms_to_minutsec(time_break) + ')';
  //В меню для пункта "Разминка" меняю надпись
  mnu_warmup.textContent = btn_warmup.textContent; 
  //В меню для пункта "Перерыв" меняю надпись
  mnu_break.textContent = btn_break.textContent;

} /* function init_new_match() */

// Меняю счет на табло при изменении полей в шапке
function score_input_change(color) {
  score_input[color].value = Math.abs(score_input[color].value);
  score_display[color].textContent = score_input[color].value;
} /* function score_input_change(color) */

// Меняю счет при щелчке по кнопкам '+' и '-' на табло
// step - шаг изменения. Может принимать два знначения: 1 и -1
function score_buttons_click(color, step) {
  if (step < 0 && score_input[color].value < 1) {
    return;
  }
  score_input[color].value = Number(score_input[color].value) + step;
  score_display[color].textContent = score_input[color].value;
} /* function score_buttons_click(color, step) */

// Остановка времени игрока
function stop_time_gamer(color) {
  clearInterval(my_timer);
  btn_start_stop[color].textContent = btn_start_stop_caption["start"];
  time[color] = time[color] - (Date.now() - system_time_start);
  if (time[color] < 0) {
    time[color] = 0;
  }
  time_display[color].textContent = ms_to_minutsec(time[color]);
  timer_active = "";
} /* function stop_time_gamer(color) */

// Вывод собщения по коду
function write_message(code, color, hideauto) {
  // hideauto - скрывать или нет сообщение по истечении кого-то времени
  message_footer_display.textContent = code_to_message(code, color);
  if (hideauto) {
    clearTimeout(my_timeout);
    my_timeout = setTimeout(function () {
      message_footer_display.textContent = "";
    }, 3000);
  }
} /* function write_message(code, color) */

// Воспроизвести соответствующий звуковой сигнал
function play_sound(my_file) {
  audio.setAttribute('src', my_file);
  audio.play();
}

// Запуск времени игрока
function start_time_gamer(color) {
  system_time_start = Date.now(); // Время запуска таймера
  btn_start_stop[color].textContent = btn_start_stop_caption["stop"];
  body.className = 'body--time-' + color;
  my_timer = setInterval(function () {
    var time_gamer = time[color] - (Date.now() - system_time_start);
    time_display[color].textContent = ms_to_minutsec(time_gamer);
    for (const key in btn_start_stop) {
      if (time[key] > 0) {
        btn_start_stop[key].removeAttribute("disabled");
      } else {
        btn_start_stop[key].setAttribute("disabled", "");
        btn_start_stop[key].textContent = btn_start_stop_caption["start"];
      }
    }

    if (time_gamer <= 60000 && !timestamp[color][60]) {
      // Достиг отметки 60 секунд
      timestamp[color][60] = true;
      write_message(0, color, true);
      play_sound("sounds/1minute.wav");
    }
    if (time_gamer <= 30000 && !timestamp[color][30]) {
      // Достиг отметки 30 секунд
      timestamp[color][30] = true;
      write_message(1, color, true);
      play_sound("sounds/30seconds.wav");
    }
    if (time_gamer <= 0) {
      // Время вышло
      stop_time_gamer(color, true);
      btn_start_stop[color].setAttribute("disabled", "");
      body.className = '';
      write_message(2, color, true);
      play_sound("sounds/timeover.wav");
    }
  }, 100);
} /*function start_time_gamer(color) */

// Щелчок по кнопке 'Старт/Стоп'
function start_stop_time_gamer_click(color) {
  if (timer_active === color) {
    // Нажата кнопка 'Стоп'. Останавливаю время игрока
    stop_time_gamer(timer_active);
    timer_active = '';
    body.className = '';
  } else {
    if (timer_active.length > 0) {
      // Нажата кнопка 'Старт' при запущенном таймере соперника
      stop_time_gamer(timer_active);
      timer_active = color;
      start_time_gamer(timer_active);
    } else {
      // Нажата кнопка 'Старт' при НЕзапущенных таймерах игроков
      timer_active = color;
      start_time_gamer(timer_active);
    }
  }
} /* function start_stop_time_gamer_click(color) */

// Щелчок по пункту "Новый матч (Параметры)" из раскрывающегося меню
// и показ popup-окна для ввода параметров нового матча
function show_settings_new_match() {
  body.className = 'body--new-match-open body--overlay';
  // Поля с именами команд
  newmatch_input_team['red'].value = team_default['red'];
  setTimeout(function() {
    newmatch_input_team['red'].focus();
    newmatch_input_team['red'].select();
  }, 500);  
  newmatch_input_team['blue'].value = team_default['blue'];
  // Поля для указания игрового времени в энде для каждого участника
  newmatch_input_time_end['minut'].value = ms_to_object_minutsec(time_one_end)['minut'];
  newmatch_input_time_end['second'].value = ms_to_object_minutsec(time_one_end)['second'];
  // Поле для указания количества эндов
  newmatch_input_end_count.value = end_count;
  // Поля для указания времени предыгровой разминки для каждого участника
  newmatch_input_time_warmup['minut'].value = ms_to_object_minutsec(time_warmup)['minut'];
  newmatch_input_time_warmup['second'].value = ms_to_object_minutsec(time_warmup)['second'];
  // Поля для указания времени перерыва между эндами
  newmatch_input_time_break['minut'].value = ms_to_object_minutsec(time_break)['minut'];
  newmatch_input_time_break['second'].value = ms_to_object_minutsec(time_break)['second'];
} /* function show_settings_new_match() */

// Обработка щелчка по кнопке "Начать матч" в popup-окне "Новый матч (Параметры)"
function newmatch_btnnewmatch_click() {
  // Вносим в переменные все параметры матча
  team['red'] = newmatch_input_team['red'].value;
  team['blue'] = newmatch_input_team['blue'].value;
  time_one_end = 1000 * (Number(newmatch_input_time_end['minut'].value)*60 + Number(newmatch_input_time_end['second'].value));
  end_count = Number(newmatch_input_end_count.value);
  time_warmup = 1000 * (Number(newmatch_input_time_warmup['minut'].value)*60 + Number(newmatch_input_time_warmup['second'].value));
  time_break = 1000 * (Number(newmatch_input_time_break['minut'].value)*60 + Number(newmatch_input_time_break['second'].value));
  init_new_match();
  close_all_popups();
} /* function newmatch_btnnewmatch_click() */

// Функция остановки времени разминки или перерыва и скрытия соотсветствующих элементов
function stop_timebreak() {
  clearInterval(my_timer);
  body.className = '';
  message_footer_display.textContent = "";
} /* function stop_timebreak() */

// Функция обрабоотки щелчка по кнопкам "Разминка" или "Перерыв"
// Открытие окна со временем разминки или перерыва и запуск обратного отсчета
function start_timebreak(code) {
  clearInterval(my_timer);
  if (code===10) {}
  body.className = 'body--break-time-open';
  write_message(code,'',false);

  system_time_start = Date.now(); // Время запуска таймера
  const
    time_size = (code==10) ? time_warmup : time_break;

  my_timer = setInterval(function () {
    var time_my = time_size - (Date.now() - system_time_start);
    breaktime_display.textContent = ms_to_minutsec(time_my);
    if (time_my <= 0) {
      // Время вышло
      setTimeout( function() {
        stop_timebreak()
      },1000);
    }
  }, 100);
} /* function start_timebreak(code) */


// Фукация показа popup-окна "О приложении"
function show_popup_about() {
  body.className = 'body--about-open body--overlay';
} /* function show_popup_about() */