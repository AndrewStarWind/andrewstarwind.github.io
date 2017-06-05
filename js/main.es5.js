(function () {
    /**
     * Класс отвечает за отображение и хранение информации о пузырьке
     * @param content {int} - содержимое
     * @param position {int} - номер пузырька
     * @param parent {jQuery} - ссылка на контейнер
     */
    function Bubble( content, position, parent ) {

        this.element = $('<div/>', {
            class: 'bubble',
            text: content
        }).css({
            'top' : 130 + Math.floor(position / 10) * 70 + 'px',
            'left': (25 + 80 * (position % 10)) + 'px'
        }).appendTo(parent)[0];

        this.value = content;
    }

    /**
     * Главный класс
     * @param element {jQuery} - ссылка на элемент
     */
    function Sort( element ) {
        var bubbles = [],
            animations = [],
            isStop = false,
            currentBubbles = [],
            MAX_NUMBER = 999999,
            animationSpeed = 1;

        this.element = element;

        /**
         * Инициализация и отрисовка пузырьков
         */
        this.init = function () {
            var bubble = null,
                elementsCount = $('#elements-count').val(),
                array = [];
            try {
                element.empty().hide();
                $('.old-bubbles-js').remove();

                if (elementsCount < 2 || elementsCount > 500) {
                    throw 'Количество элементов массива должно быть не меньше 2 и не больше 500 ';
                }

                if ($('#generate-array').is(':checked')) {
                    array = _generateArray(elementsCount);
                } else {
                    array = _getArrayFromInput();
                }

                element.css('height', 140 + Math.floor((array.length - 1) / 10) * 80 + 'px');
                animationSpeed = 300;
                bubbles = [];
                for (var i = 0; i < array.length; i++) {
                    bubble = new Bubble(array[i], i, element);
                    bubbles.push(bubble);
                }
                element.prepend('<p>Сгенерированный массив:</p>');
                element.fadeIn();
            }
            catch (err) {
                alert(err);
                $('.buttons__sort').addClass('disabled');
            }
        };

        /**
         * Функция сортировки
         * Выолняет сортировку массива, а так же заполняет цепочку промисов,
         * выполняющих анимацию
         */
        this.sort = function () {
            var originalBubbles = element.clone(),
                len = bubbles.length,
                $bubble1 = null,
                $bubble2 = null,
                temp = 0,
                isSwap = false;

            isStop = false;
            animations = [];
            originalBubbles.hide()
                .addClass('old-bubbles-js');
            element.after(originalBubbles);


            $('.old-bubbles-js').fadeIn(500, function () {
                element.find('p').text('Идёт сортировка...');
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < len - i - 1; j++) {
                        isSwap = false;
                        $bubble1 = $(bubbles[j].element);
                        $bubble2 = $(bubbles[j + 1].element);

                        if (bubbles[j].value > bubbles[j + 1].value) {
                            temp = bubbles[j];
                            bubbles[j] = bubbles[j + 1];
                            bubbles[j + 1] = temp;
                            isSwap = true
                        }
                        animations.push({
                            bubble1: $bubble1,
                            bubble2: $bubble2,
                            isSwap: isSwap
                        });
                    }
                }
                _animateBubbles(animations, 0)
            });

        };

        /**
         * Функция паузы анимации
         */
        this.pauseAnimations = function () {
            currentBubbles[0].pause();
            currentBubbles[1].pause();
        };

        /**
         * Функция продолжения анимации
         */
        this.resumeAnimations = function () {
            currentBubbles[0].resume();
            currentBubbles[1].resume();
        };

        /**
         * Функция отмены анимации
         */
        this.stopAnimations = function () {
            animationSpeed = 0;
            currentBubbles[0].resume();
            currentBubbles[1].resume();
            isStop = true;
            $('.old-bubbles-js').remove();
            $('.bubbles').html('');
        };

        /**
         * Методы ускорения и замедления анимации
         */
        this.increaseAnimationSpeed = function(  ) {
            if (animationSpeed > 150) animationSpeed = animationSpeed /  2;

        };

        this.decreaseAnimationSpeed = function(  ) {
            if (animationSpeed < 1200) animationSpeed = animationSpeed *  2;

        };

        /**
         * Функция вызывается по окончанию либо по прерыванию сортировки
         * @private
         */
        function _afterSort() {
            $('.buttons__generate').removeClass('disabled');
            element.find('p').text('Отсортированный массив:');
            $('.buttons__pause').addClass('disabled');
            $('.buttons__stop').addClass('disabled');
            $('.buttons__pause').addClass('disabled');
            animations = [];
            isStop = false;
        }

        /**
         * Фукнция взаимодействия пузырьков
         * @param animations {Array} - массив с пузырьками
         * @param index {Number} - индекс массива
         * @private
         */
        function _animateBubbles( animations, index ) {
            if (isStop) {
                _afterSort();
                return;
            }
            var $bubble1 = animations[index].bubble1,
                $bubble2 = animations[index].bubble2,
                isSwap = animations[index].isSwap,
                bubble1LeftOffset = $bubble1.css('left'),
                bubble2LeftOffset = $bubble2.css('left'),
                bubble1TopOffset = $bubble1.css('top'),
                bubble2TopOffset = $bubble2.css('top');

            $bubble1.addClass('bubble-current--red');
            $bubble2.addClass('bubble-current--red');

            currentBubbles[0] = $bubble1;
            currentBubbles[1] = $bubble2;
            $bubble2.animate({top: '40px', left: '415px'}, animationSpeed);
            $bubble1.animate({top: '40px', left: '325px'}, animationSpeed, function () {
                if (!isSwap){
                    $bubble1.removeClass('bubble-current--red').addClass('bubble-current--green');
                    $bubble2.removeClass('bubble-current--red').addClass('bubble-current--green');
                }
                $bubble2.animate({top: '40px'}, animationSpeed * 2, function (  ) {
                    if (isSwap) {
                        $bubble1.animate({left: '415px'}, animationSpeed, function () {
                            $bubble1.removeClass('bubble-current--red').addClass('bubble-current--green');
                            $bubble2.removeClass('bubble-current--red').addClass('bubble-current--green');
                            $bubble2.animate({top: '40px'}, animationSpeed * 2, function () {
                                $bubble2.animate({top: bubble1TopOffset, left: bubble1LeftOffset}, animationSpeed);
                                $bubble1.animate({top: bubble2TopOffset, left: bubble2LeftOffset}, animationSpeed, function() {
                                    $bubble1.css({top: bubble2TopOffset, left: bubble2LeftOffset});
                                    $bubble2.css({top: bubble1TopOffset, left: bubble1LeftOffset});
                                    $bubble1.removeClass('bubble-current--green');
                                    $bubble2.removeClass('bubble-current--green');
                                    if (animations[index + 1]) {
                                        _animateBubbles(animations, index + 1)
                                    }
                                });
                            });
                        });
                        $bubble2.animate({left: '325px'}, animationSpeed);
                    } else {
                        $bubble2.animate({top: bubble2TopOffset, left: bubble2LeftOffset}, animationSpeed);
                        $bubble1.animate({top: bubble1TopOffset, left: bubble1LeftOffset}, animationSpeed, function() {
                            $bubble1.removeClass('bubble-current--green');
                            $bubble2.removeClass('bubble-current--green');
                            $bubble2.css({top: bubble2TopOffset, left: bubble2LeftOffset});
                            $bubble1.css({top: bubble1TopOffset, left: bubble1LeftOffset});
                            if (animations[index + 1]) {
                                _animateBubbles(animations, index + 1)
                            }
                        });

                    }
                });
                });

        }

        /**
         * Функция генерирует массив, либо считывает введенный
         * @param amount - количество элементов
         * @returns {Array} - ввденный или сгенерированный массив
         * @private
         */
        function _generateArray( amount ) {
            var array = [],
                rangeBeg = parseInt($('#range-start').val()),
                rangeEnd = parseInt($('#range-end').val());

            if (rangeBeg === Number.NaN || rangeEnd === Number.NaN || rangeBeg >= rangeEnd){
                throw 'Неверный диапазон'
            }

            if (!(_isInRange(rangeBeg) && _isInRange(rangeEnd))){
                throw 'Введенные числа превышают максимальное значение';
            }

            for (var i = 0; i < amount; i++) {
                array.push(_getRandomNumber(rangeBeg, rangeEnd));
            }

            return array;
        }

        /**
         * Функция считывает массив из инпута
         * @returns {Array}
         * @private
         */
        function _getArrayFromInput(){
            var inputValue = $('#array').val(),
                array = inputValue.split(','),
                number = 0;

            if (array.length < 2) {
                throw 'Слишком короткий массив';
            }

            if (array.length > 500) {
                throw 'Слишком длинный массив';
            }

            for (var i = 0; i < array.length; i++) {
                number = parseInt(array[i]);
                if (number !== Number.NaN && _isInRange(number)){
                    array[i] = parseInt(array[i])
                } else {
                    throw 'Одно или несколько из введеных чисел не являются числами,' +
                    ' либо не входят в область допустимых значений'
                }
            }

            return array;
        }

        /**
         * Метод генерации числа
         * @param min - минимальное значение
         * @param max - Максимальное значение
         * @returns {number} - случайное число от min до max
         * @private
         */
        function _getRandomNumber( min, max ) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        /**
         * Функция проверяет, входит ли число в допустимый дипазон
         * @param amount - число
         * @returns {boolean} - результат проверки
         * @private
         */
        function _isInRange( amount ) {
            return !(amount > MAX_NUMBER || amount < -MAX_NUMBER)
        }


    }

    /**
     * Функция вызывается по событию document.ready
     * Вешает обработчики и инициализирует классы
     *
     */
    $(function () {
        var sort = new Sort($('.bubbles'));
        _initHandlers(sort);
    });

    /**
     * Функция вешает обрабочики на события
     * @param sort - ссылка на объект класса Sort
     * @private
     */
    function _initHandlers(sort) {
        $('.buttons__generate').click(function () {
            if (!$(this).hasClass('disabled')) {
                $('.buttons__sort').removeClass('disabled');
                sort.init();
            }
        });

        $('.buttons__sort').click(function () {
            if (!$(this).hasClass('disabled')) {
                $(this).addClass('disabled');
                $('.buttons__generate').addClass('disabled');
                $('.buttons__pause').removeClass('disabled');
                $('.buttons__stop').removeClass('disabled');
                $('.buttons__increase-speed').removeClass('disabled');
                $('.buttons__decrease-speed').removeClass('disabled');
                sort.sort();
            }
        });

        $('.buttons__resume').click(function () {
            if (!$(this).hasClass('disabled')) {
                $(this).addClass('disabled');
                $('.buttons__pause').removeClass('disabled');
                $('.buttons__stop').removeClass('disabled');
                sort.resumeAnimations()
            }
        });

        $('.buttons__pause').click(function () {
            if (!$(this).hasClass('disabled')) {
                $(this).addClass('disabled');
                $('.buttons__resume').removeClass('disabled');
                sort.pauseAnimations();
            }
        });

        $('.buttons__stop').click(function () {
            if (!$(this).hasClass('disabled')) {
                $(this).addClass('disabled');
                $('.buttons__resume').addClass('disabled');
                $('.buttons__pause').addClass('disabled');
                $('.buttons__increase-speed').addClass('disabled');
                $('.buttons__decrease-speed').addClass('disabled');
                sort.stopAnimations();
            }
        });

        $('.buttons__increase-speed').click(function (  ) {
            if (!$(this).hasClass('disabled')) {
                sort.increaseAnimationSpeed();
            }
        });

        $('.buttons__decrease-speed').click(function (  ) {
            if (!$(this).hasClass('disabled')) {
                sort.decreaseAnimationSpeed();
            }
        });

        $('.instructions h4').click(function () {
            $(this).next().slideToggle();
            $(this).find('span')
                .html($(this).find('span').html() == '+' ? '-' : '+')
        });

        $('#generate-array').change(function() {
            $('.form-group--array').slideToggle(!this.checked)
        });
    }
})();
