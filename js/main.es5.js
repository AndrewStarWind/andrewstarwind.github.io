(function () {

    /**
     *Класс отвечает за отображение и хранение информации о пузырьке
     * @param content {int} - содержимое
     * @param position {int} - номер пузырька
     * @param parent {Object} - ссылка на контейнер
     */
    function Bubble( content, position, parent ) {

        this.element = $('<div/>', {
            class: 'bubble',
            text: content
        }).css({
            'left': (25 + 80 * position) + 'px'
        }).appendTo(parent)[0];

        this.value = content;
    }

    /**
     * Главный класс
     * @param element {jQuery} - ссылка на контейнер
     */
    function Sort( element ) {
        var bubbles = [],
            animations = [],
            isStop = false,
            currentBubbles = [];

        this.element = element;

        /**
         * Инициализация и отрисовка пузырьков
         */
        this.init = function () {
            var number = null,
                bubble = null,
                elementsCount = $('#elementsCount').val();

            element.empty().hide();
            $('.old-bubbles-js').remove();
            bubbles = [];
            for (var i = 0; i < elementsCount; i++) {
                number = _getRandomNumber(0, 999);
                bubble = new Bubble(number, i, element);
                bubbles.push(bubble);
            }
            element.prepend('<p>Сгенерированный массив:</p>');
            element.fadeIn();
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

        this.pauseAnimations = function () {
            currentBubbles[0].pause();
            currentBubbles[1].pause();
        };

        this.resumeAnimations = function () {
            currentBubbles[0].resume();
            currentBubbles[1].resume();
        };

        this.stopAnimations = function () {
            isStop = true;
            $('.old-bubbles-js').remove();
            $('.bubbles').html('');
        };

        function _afterSort() {
            $('.buttons__generate').removeClass('disabled');
            element.find('p').text('Отсортированный массив:');
        }

        /**
         * Фукнция взаимодействия пузырьков
         * @param animations {Array} - массив с пузырьками
         * @param index {Number} - индекс массива
         * @private
         */
        function _animateBubbles( animations, index ) {
            var $bubble1 = animations[index].bubble1,
                $bubble2 = animations[index].bubble2,
                isSwap = animations[index].isSwap,
                bubble1LeftOffset = $bubble1.css('left'),
                bubble2LeftOffset = $bubble2.css('left');

            $bubble1.addClass('bubble-current');
            $bubble2.addClass('bubble-current');

            currentBubbles[0] = $bubble1;
            currentBubbles[1] = $bubble2;

            $bubble1.animate({top: '40px'}, 700, function () {
                if (isSwap) {
                    $bubble1.animate({top: '-10px'}, 150, function () {
                        $bubble1.animate({left: bubble2LeftOffset}, 150, function () {
                            $bubble2.animate({top: '40px'}, 150);
                            $bubble1.animate({top: '40px'}, 150, () => {
                                $bubble1.removeClass('bubble-current');
                                $bubble2.removeClass('bubble-current');

                                if (!isStop && animations[index + 1]) {
                                    _animateBubbles(animations, index + 1)
                                } else {
                                    _afterSort();
                                }
                            })
                        });
                        $bubble2.animate({left: bubble1LeftOffset}, 150);
                    });
                    $bubble2.animate({top: '90px'}, 150)
                } else {
                    $bubble1.removeClass('bubble-current');
                    $bubble2.removeClass('bubble-current');
                    if (!isStop && animations[index + 1]) {
                        _animateBubbles(animations, index + 1)
                    } else {
                        _afterSort();
                    }
                }
            });
        }

        /**
         * Метод генерации числа
         * @param min - минимальное значение
         * @param max - Максимальное значение
         * @returns {number} - случайное число от min до max
         * @private
         */
        function _getRandomNumber( min, max ) {
            return Math.floor(Math.random() * (max - min) + min);
        }
    }

    /**
     * Функция вызывается по событию document.ready
     * Вешает обработчики и инициализирует классы
     *
     */
    $(function () {
        let sort = new Sort($('.bubbles'));

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
                $('.buttons__stop').addClass('disabled');
                sort.pauseAnimations();
            }
        });

        $('.buttons__stop').click(function () {
            if (!$(this).hasClass('disabled')) {
                $(this).addClass('disabled');
                $('.buttons__resume').addClass('disabled');
                $('.buttons__stop').addClass('disabled');
                sort.stopAnimations();
            }
        });
    });
})();
