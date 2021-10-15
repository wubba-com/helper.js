    // Класс создает свайпы по выбранному элементу, так же можно подключить пагинацию
    class Swipe {
        constructor(element, items, pagination = null) {
            this.xDown = null;
            this.yDown = null;
            this.pagination = pagination;
            this.items = items;
            this.element = typeof (element) === 'string' ? document.querySelector(element) : element;
            this.element.addEventListener('touchstart', function (event) {
                this.xDown = event.touches[0].clientX;
                this.yDown = event.touches[0].clientY;
            }.bind(this), false);
        }
    
        onLeft(callback) {
            this.onLeft = callback;
            return this;
        }
        onRight(callback) {
            this.onRight = callback;
            return this;
        }
        onUp(callback) {
            this.onUp  =  callback;
            return this;
        };
        handleTouchMove(event, items, pagination = false) {
            if (!this.xDown || !this.yDown) {
                return;
            }
            let xUp = event.touches[0].clientX;
            let yUp = event.touches[0].clientY;
            this.xDiff = this.xDown - xUp;
            this.yDiff = this.yDown - yUp;
            if (Math.abs(this.xDiff) !== 0) {
                if (this.xDiff > 2) {
                    typeof (this.onLeft) === "function" && this.onLeft(items, pagination);
                } else if (this.xDiff < -2) {
                    typeof (this.onRight) === "function" && this.onRight(items, pagination);
                }
            }
    
            if (Math.abs(this.yDiff) !==  0) {
                if (this.yDiff  >  2) {
                    typeof (this.onUp) ===  "function"  && this.onUp();
                }
            }
            // Обнуляем разницу
            this.xDown = null;
            this.yDown = null;
        }
        run() {
            this.element.addEventListener('touchmove', function (event) {
                this.handleTouchMove(event, this.items, this.pagination ? this.pagination : false);
            }.bind(this), false);
        }
    
    };
