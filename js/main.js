'use strict';

(function(){
    /**
     * Класс отвечает за отображение и хранение информации о пузырьке
     */
    class Bubble {

        /**
         *
         * @param content {int} - содержимое
         * @param position {int} - номер пузырька
         * @param parent {Object} - ссылка на контейнер
         */
        constructor( content, position, parent ) {

            this.element = $('<div/>', {
                class: 'bubble',
                text: content
            }).css({
                'left': (25 + 80 * position) + 'px'
            }).appendTo( parent )[0];

            this.value = content;
        }
    }

    /**
     * Главный класс
     */
    class Sort {
        /**
         *
         * @param element - сслыка на элемент
         */
        constructor( element ) {
            this.element = element;
        }
        /**
         * Инициализация и отрисовка пузырьков
         */
        init() {
            this.element.empty().hide();
            $('.old-bubbles-js').remove();
            this.bubbles = [];
            for (let i = 0; i < 10; i++) {
                let number = this._getRandomNumber( 0, 999 ),
                    bubble = new Bubble( number, i, this.element );

                this.bubbles.push( bubble );
            }
            this.element.prepend( '<p>Сгенерированный массив:</p>' );
            this.element.fadeIn();
        }

        /**
         * Функция сортировки
         * Выолняет сортировку массива, а так же заполняет цепочку промисов,
         * выполняющих анимацию
         */
        sort(){
            this._copyContainer().then(() => {
                this.element.find( 'p' ).text( 'Идёт сортировка...' );
                let len = this.bubbles.length,
                    promise = Promise.resolve();

                for (let i = 0; i < len ; i++) {
                    for(let j = 0 ; j < len - i - 1; j++){
                        let isSwap = false,
                            $bubble1 = $(this.bubbles[j].element),
                            $bubble2 = $(this.bubbles[j + 1].element);

                        if (this.bubbles[j].value > this.bubbles[j + 1].value) {
                            let temp = this.bubbles[j];
                            this.bubbles[j] = this.bubbles[j + 1];
                            this.bubbles[j + 1] = temp;
                            isSwap = true
                        }
                       promise =  promise.then( () => { return this._swapBubbles( $bubble1, $bubble2, isSwap ) });
                    }
                }
                promise.then( () => {
                    $( '.buttons__generate' ).removeClass( 'disabled' );
                    this.element.find( 'p' ).text( 'Отсортированный массив:' );
                })
            });

        }

        /**
         * Фукнция взаимодействия пузырьков
         * @param $bubble1 - ссылка на первый пузырёк
         * @param $bubble2 - ссылка на второй пузырёк
         * @param isSwap - нужно ли менять их местами
         * @returns {Promise} - возвращается после заверешния анимации
         * @private
         */
        _swapBubbles($bubble1, $bubble2, isSwap) {
            let bubble1LeftOffset = $bubble1.css('left'),
                bubble2LeftOffset = $bubble2.css('left');

            $bubble1.addClass('bubble-current');
            $bubble2.addClass('bubble-current');

            return new Promise((resolve) => {
                setTimeout(() => {
                    if (isSwap){
                        $bubble1.animate({top: '-10px'}, 150, function() {
                            $bubble1.animate({left: bubble2LeftOffset}, 150, function() {
                                $bubble2.animate({top: '40px'}, 150);
                                $bubble1.animate({top: '40px'}, 150, function() {
                                    $bubble1.removeClass('bubble-current');
                                    $bubble2.removeClass('bubble-current');
                                    resolve();
                                })
                            });
                            $bubble2.animate({left: bubble1LeftOffset}, 150);
                        });
                        $bubble2.animate({top: '90px'}, 150)
                    } else {
                        $bubble1.removeClass('bubble-current');
                        $bubble2.removeClass('bubble-current');
                        resolve();
                    }
                }, 700);
            })

        }

        /**
         * Метод генерации числа
         * @param min - минимальное значение
         * @param max - Максимальное значение
         * @returns {number} - случайное число от min до max
         * @private
         */
        _getRandomNumber( min, max ) {
            return Math.floor( Math.random() * (max - min) + min );
        }

        _copyContainer(){
            let originalBubbles = this.element.clone();

            originalBubbles.hide()
                .addClass( 'old-bubbles-js' );
            this.element.after( originalBubbles );

            return new Promise( ( resolve, reject ) => {
                    $( '.old-bubbles-js' ).fadeIn( 500, function() {
                        resolve();
                    } )
                })
        }
    }

    /**
     * Функция вызывается по событию document.ready
     * Вешает обработчики и инициализирует классы
     *
     */
    $(function () {
        let sort = new Sort( $( '.bubbles' ) );

        $( '.buttons__generate' ).click(function () {
            if (!$(this).hasClass('disabled')) {
                $('.buttons__sort').removeClass( 'disabled' );
                sort.init();
            }
        });

        $( '.buttons__sort' ).click(function () {
            if (!$(this).hasClass( 'disabled' )){
                $(this).addClass( 'disabled' );
                $( '.buttons__generate' ).addClass( 'disabled' );
                sort.sort();
            }
        });
    });

})();
