    // Класс принимает контейнер пагинации, обертку элементов пагинации, список пагинации,
    // Количество показываемой пагинации
    // Далее с помощью метода setParamsPag и setWidthItem он рассчитывает на сколько должен прокрутиться скролл
    // и минимальную ширину каждого элемента пагинации, именно на количество __movePositionPoints сдвинутся элементы
    class Pagination {
        constructor(container, wrapper, itemList) {
            this.container = container;
            this.wrapper = wrapper;
            this.itemList = itemList;
            this.__position = 0;
            this.__paginationToShow = null
            this.__itemWidth = null; 
            this.__movePositionPoints = null;
            this.__toScroll = null;
        }
    
        getItems() { return this.itemList; };
    
        setParamsPag(paginationToShow, scroll) {
            this.__toScroll = scroll;
            this.__paginationToShow = paginationToShow
            this.__itemWidth = this.container.clientWidth / this.__paginationToShow; 
            this.__movePositionPoints = this.__toScroll * this.__itemWidth;
        }
    
        setWidthItem() {
            for (let item of this.itemList) {
                item.style.minWidth = `${this.__itemWidth}px`;
            }
        }
    
        setPosition(position) { this.wrapper.style.transform = `translateX(${position}px)`; };
    
        getPosition() { return this.__position; };
    
        getWidth() { return this.__itemWidth; };
    
        getMovePosition() { return this.__movePositionPoints; };
    
        getPaginationToShow() { return this.__paginationToShow; };
    
        getScroll() { return this.__toScroll; };
    };
