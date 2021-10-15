/**
 * Version 2.1
 * dev: Ilyin Sergey
 * date: 01.10.2021
 */



function setCookie(name, value, options = {'path': '/'}) {
    let updatedCookie = encodeURIComponent(name) + '=' + value;
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];

        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
}

function deleteCookie(name) { // Что б удалить куку, ей нужно установить количество дней хранение, отрицательное количество дней
    const date = new Date(Date.now() - 864500e3);
    console.log("date: ", date);
    setCookie(name, "", {expires: date, path: '/', domain: 'new.seasonkrasoty.ru', secure: true});
}

/**
 * Класс для обработки избранных товаров на клиентской стороне.
 * Для добавления, удаления товаров в избранное, для создание
 * пользовательских списков и их удаления
 */
class Wish {
    constructor(allItems = [], allLists = {}, defaultWishList = {}, itemWishL = {}, userWishL = {}) {
        this.ALLITEMS = allItems;
        this.ALLLISTS = allLists;
        this.DEFAULT_WISHLIST = defaultWishList;
        this.ITEM_WISHLISTS = itemWishL;
        this.USER_WISHLIST = userWishL;
        this.itemId = null;
    }

    /**
     * Метод вызывается для неавторизованных пользователей.
     * Добавляет ID-товара в куку "wishlistIDs"
     * @param {HTMLCollection} items
     * @return {void}
     */
    notAuthChangeWishStatus(items) {
        items.forEach(elem => {
            elem.addEventListener("click", function () {

                let cookieWishlistIDs = getCookie('wishlistIDs');
                let item = this.children[0].children[0];
                let itemId = this.getAttribute('data-item-id');
                let date = new Date();
                let days = 90;

                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

                if (cookieWishlistIDs == null) { //если куки нет, то добавляем туда первое значение

                    let ids = [];
                    ids.push(itemId);

                    item.classList.remove("far")
                    item.classList.add("fas")
                    this.children[0].classList.add('wished');

                    setCookie('wishlistIDs', ids, {
                        expires: date,
                        path: '/',
                        domain: 'new.seasonkrasoty.ru',
                        secure: true
                    })
                } else { // если кука есть
                    if (!this.children[0].classList.contains("wished")) { //если сердечко пустое
                        console.log("heart is empty")
                        item.classList.remove('far')
                        item.classList.add('fas')
                        this.children[0].classList.add('wished');

                        let ids = cookieWishlistIDs.split(",")
                        ids.push(itemId);

                        setCookie('wishlistIDs', ids, {
                            expires: date,
                            path: '/',
                            domain: 'new.seasonkrasoty.ru',
                            secure: true
                        })

                    } else {//если сердечко закрашено
                        console.log("heart is not empty")
                        item.classList.add('far');
                        item.classList.remove('fas');
                        this.children[0].classList.remove('wished');

                        let newListIds = cookieWishlistIDs.split(",").filter(elem => +elem != +itemId ? elem : "");
                        console.log(newListIds);

                        if (newListIds.indexOf(itemId) === -1) {
                            console.log("Удалена:  ", itemId);
                        } else {
                            console.error('Проблема при удалении из избранного товара с id = ' + itemId);
                        }

                        if (newListIds.length === 0) {
                            deleteCookie("wishlistIDs");
                        } else {
                            setCookie('wishlistIDs', newListIds, {
                                expires: date,
                                path: '/',
                                domain: 'new.seasonkrasoty.ru',
                                secure: true
                            })
                        }
                    }
                }
            }.bind(elem))
        })
    }

    /**
     * Метод проверяет есть ли ID-товара в куке,
     * если есть то закрашивает сердечко, иначе оставляет его пустым
     * @param {HTMLCollection} items
     * @return {void}
     */
    notAuthGetWishStatus(items) {

        let idsFromCookie = getCookie("wishlistIDs");

        if (idsFromCookie == null) {
            for (let i = 0; i < items.length; i++) {
                items[i].innerHTML = '<span data-item-id="' + items[i].getAttribute('data-item-id') + '"><i class="far fa-heart fs18 fs30-xs"></i></span>';
            }
        } else {
            for (let i = 0; i < items.length; i++) {

                let search = items[i].getAttribute('data-item-id');
                let sRes = idsFromCookie.split(",").indexOf(search);

                if (sRes !== -1) {
                    items[i].innerHTML = '<span data-item-id="' + items[i].getAttribute('data-item-id') + '" class="wished"><i class="fal fa-heart fs18 fs30-xs fas"></i></span>';
                } else {
                    items[i].innerHTML = '<span data-item-id="' + items[i].getAttribute('data-item-id') + '"><i class="far fa-heart fs18 fs30-xs"></i></span>';
                }
            }
        }
    }

    /**
     * Метод описан для регистрирование сердечек (пометка как избранный товар).
     * Выводит проверяет и выводит сердечки над теми товарами, которые являются избранными
     * @param {HTMLCollection} items
     * @return {void}
     */
    authGetWishStatus(items) {
        //console.log("start authGetWishStatus: ", items)
        if (items.length === 0) {
            return
        }

        if (this.ALLITEMS == null) {
            for (let i = 0; i < items.length; i++) {
                let sp = document.createElement('span');
                items[i].setAttribute("onmouseover", "mouseover(this);");
                items[i].setAttribute("onmouseout", "mouseout(this);");
                sp.setAttribute("data-item-id", items[i].getAttribute('data-item-id'));
                sp.innerHTML = '<i class="fal fa-heart fs18 fs30-xs"></i>';
                items[i].prepend(sp);
            }
        } else {
            for (let i = 0; i < items.length; i++) {
                if (!isParent(items[i])) {

                    let search = parseInt(items[i].getAttribute('data-item-id'), 10);
                    let sRes = (Object.values(this.ALLITEMS)).includes(search);//проверяем текущий id в массиве избранных товаров текущей страницы

                    if (sRes !== false) {
                        let sp = document.createElement('span');
                        sp.setAttribute("class", "wished");
                        items[i].setAttribute("onmouseover", "mouseover(this);");
                        items[i].setAttribute("onmouseout", "mouseout(this);");
                        sp.setAttribute("data-item-id", items[i].getAttribute('data-item-id'));
                        sp.innerHTML = '<i class="fas fa-heart fs18 fs30-xs"></i>';
                        items[i].prepend(sp);
                    } else {
                        let sp = document.createElement('span');
                        items[i].setAttribute("onmouseover", "mouseover(this);");
                        items[i].setAttribute("onmouseout", "mouseout(this);");
                        sp.setAttribute("data-item-id", items[i].getAttribute('data-item-id'));
                        sp.innerHTML = '<i class="fal fa-heart fs18 fs30-xs"></i>';
                        items[i].prepend(sp);
                    }
                }
            }
        }
    }

    /**
     * Метод собирает все ".wishblock" о странице и навешивает событие, при котором открывается
     * блок с вариантами списков, в которые можно добавить избранный товар
     * @param {HTMLCollection} wList
     */
    authChangeWishStatus(wList) {
        //console.log("start authChangeWishStatus: ", wList)
        document.addEventListener('mouseup', this.closeAllOpenWishListPopup);
        wish = this

        if (wList.length > 0) { //если на странице есть сердечки
            let i = 0;
            wList.forEach(function (wDiv) {
                wDiv.addEventListener('click', function (e) {

                    wish.box_of_wishlist = document.getElementsByClassName('wishlist_box');
                    if (wish.box_of_wishlist.length > 0) {
                        for (let i = 0; i < wish.box_of_wishlist.length; i++) {
                            wish.box_of_wishlist[i].remove();
                        }
                    }
                    wish.createPopupWishlistBox(this); // и создаем
                }, true); // то при клике на любое сердечко, убераем у всех сердечек открытые popup окна со списком списков избранного
            });
        }
    }

    /**
     * Метод непосредственно создает блок с юзер списками и помечает те списки в которых товар уже есть.
     * Закрывает все блоки со списками со странице, если таковы имеются
     * @param {HTMLElement} w
     * @return {void}
     */
    createPopupWishlistBox(w) {
        let wish = this;
        this.itemId = w.getAttribute('data-item-id');
        let popup = document.createElement('div');
        popup.setAttribute("class", "wishlist_box");
        let popupHTML = '<div class="wishlist_box_wishlist_add_control"><span style="width:100%;" class="cancel_add2wishlist"><i class="fal fa-times"></i></span></div><div class="wishlist_box_name">Добавить в список избранного</div><ul class="wishlist_box_user_wishlists">';
        let f = false;
        if (typeof (this.ITEM_WISHLISTS[this.itemId]) != 'undefined') {
            for (let key in this.ITEM_WISHLISTS[this.itemId].WISHLISTS) {
                if (this.ITEM_WISHLISTS[this.itemId].WISHLISTS[key] === this.DEFAULT_WISHLIST) {
                    f = true;
                }
            }
        }
        if (f === true) {
            popupHTML += `<li><span class="choose_wishlist already_added" data-wishlist_id=${this.DEFAULT_WISHLIST}>Список по умолчанию<span data-item-id="${this.itemId}" class="wished"><i class="fas fa-heart fs14 fs18-xs"></i></span></span></li>`;
        } else {
            popupHTML += '<li><span class="choose_wishlist" data-wishlist_id="' + this.DEFAULT_WISHLIST + '">Список по умолчанию<span data-item-id="' + this.itemId + '" class=""><i class="far fa-heart fs14 fs18-xs"></i></span></span></li>';
        }

        if (Object.keys(this.USER_WISHLIST).length > 0) {
            for (let user_wishlist in this.USER_WISHLIST) {
                let f = false;
                if (typeof (this.ITEM_WISHLISTS[this.itemId]) != 'undefined') {
                    for (let key in this.ITEM_WISHLISTS[this.itemId].WISHLISTS) {
                        if (this.ITEM_WISHLISTS[this.itemId].WISHLISTS[key] == user_wishlist) {
                            f = true;
                        }
                    }
                }
                if (f === true) {
                    popupHTML += '<li><span class="choose_wishlist already_added" data-wishlist_id="' + user_wishlist + '">' + this.USER_WISHLIST[user_wishlist] + '<span data-item-id="' + this.itemId + '" class="wished"><i class="fas fa-heart fs14 fs18-xs"></i></span></span></li>';
                } else {
                    popupHTML += '<li><span class="choose_wishlist" data-wishlist_id="' + user_wishlist + '">' + this.USER_WISHLIST[user_wishlist] + '<span data-item-id="' + this.itemId + '" class=""><i class="far fa-heart fs14 fs18-xs"></i></span></span></li>';
                }
            }
        }
        popupHTML += '</ul>';
        popupHTML += '<div class="wishlist_box_create_new_user_list"><span class="choose_wishlist" data-wishlist_id="create_new_user_wishlist"><i class="fal fa-plus"></i>Создать новый список</span></div>';
        popupHTML += '</div>';
        popup.innerHTML = popupHTML;
        w.parentNode.prepend(popup);
        let popup_close_btn = popup.querySelector('.cancel_add2wishlist > i');

        popup_close_btn.addEventListener('click', wish.closePopupWishlistBox);

        let wLists = popup.querySelectorAll(".choose_wishlist"); // [span.choose_wishlist, span.choose_wishlist.already_added, span.choose_wishlist]

        if (wLists.length > 0) { //если на странице есть сердечки
            wLists.forEach(function (wElem) {
                wElem.addEventListener('click', function (e) {
                    wish.chooseWishlist(this);
                }); // то при клике на любое сердечко, убераем у всех сердечек открытые popup окна со списком списков избранного
            });
        }
    }

    /**
     * Метод добавляет или удаляет товар из списка если сердечко закрашено или не закрашено,
     * записывает в объект изменения
     * @param {HTMLElement} wElem
     * @return {void}
     */
    chooseWishlist(wElem) {
        wish = this;
        let wishlist_id = wElem.getAttribute("data-wishlist_id");

        if (wishlist_id === 'create_new_user_wishlist') {
            console.log('создаем новый список');
            this.createPopupWishlistBoxAddWishlist(wElem);
        } else {

            let added_heart = wElem.querySelector('.fa-heart');
            if (wElem.classList.contains('already_added') === false) {//если сердечко пустое
                let postData = {
                    'ACTION': 'add',
                    'ITEM_ID': wish.itemId,
                    'WISHLIST_ID': wishlist_id,
                    'WISHLIST_PRODUCTS': JSON.stringify(this.ALLLISTS[wishlist_id]['PRODUCTS'])
                };
                BX.showWait();
                BX.ajax({
                    url: '/local/components/kk/wishlist_v2/ajax.php',
                    method: 'POST',
                    data: postData,
                    dataType: 'json',
                    onsuccess: function (res) {
                        BX.closeWait();
                        if (res['ADD_STATUS'] === 'Y') {
                            console.log(res['ADD_STATUS'], " add");
                            added_heart.classList.remove('far');
                            added_heart.classList.add('fas');

                            let choose_wishlist = findAncestor(added_heart, 'choose_wishlist');
                            choose_wishlist.classList.add('already_added');

                            let popup_box = findAncestor(added_heart, 'wishlist_box');
                            let reopen_popup_box = popup_box.nextElementSibling.querySelector('.wishlistblock > span > i');

                            reopen_popup_box.classList.add('fas');
                            reopen_popup_box.classList.remove('far');
                            reopen_popup_box.parentNode.classList.add('wished');

                            //тут нужно добавить данные в Wish
                            if (wish.ALLITEMS.indexOf(+wish.itemId) === -1) {
                                wish.ALLITEMS.push(+wish.itemId);
                            }

                            if (typeof (wish.ITEM_WISHLISTS[wish.itemId]) == 'undefined') {
                                //wish.ITEM_WISHLISTS = {};
                                wish.ITEM_WISHLISTS[wish.itemId] = {};
                                wish.ITEM_WISHLISTS[wish.itemId] = {ITEM_ID: +wish.itemId, WISHLISTS: [],};
                                let WISHLISTS_length = (wish.ITEM_WISHLISTS[+wish.itemId].WISHLISTS).length;
                                wish.ITEM_WISHLISTS[wish.itemId].WISHLISTS[WISHLISTS_length] = +wishlist_id;
                            } else {
                                let WISHLISTS_length = (wish.ITEM_WISHLISTS[wish.itemId].WISHLISTS).length;
                                wish.ITEM_WISHLISTS[wish.itemId].WISHLISTS[WISHLISTS_length] = +wishlist_id;
                            }
                            (wish.ALLLISTS[wishlist_id].PRODUCTS).push(+wish.itemId);
                        } else {
                            console.log('Ошибка при добавлении в список');
                        }
                    },
                    onerror: function (err) {
                        console.log(err);
                    }
                });

            } else {
                let postData = {
                    'ACTION': 'remove',
                    'ITEM_ID': this.itemId,
                    'WISHLIST_ID': wishlist_id,
                    'WISHLIST_PRODUCTS': (this.ALLLISTS[wishlist_id].PRODUCTS)
                };
                BX.showWait();
                BX.ajax({
                    url: '/local/components/kk/wishlist_v2/ajax.php',
                    method: 'POST',
                    data: postData,
                    dataType: 'json',
                    onsuccess: function (res) {
                        BX.closeWait();
                        if (res['DELETE_STATUS'] === 'Y') {
                            console.log('Получили ответ от AJAXа удаления. Успешно удалено');
                            added_heart.classList.remove('fas');
                            added_heart.classList.add('far');
                            let choose_wishlist = findAncestor(added_heart, 'already_added');

                            choose_wishlist.classList.remove('already_added');

                            //тут нужно добавить данные в wish
                            //удаляем id списка из wish.ITEM_WISHLISTS для текущего элемента
                            let WIDSarray = Object.values(wish.ITEM_WISHLISTS[wish.itemId].WISHLISTS);

                            let WIDindex = WIDSarray.indexOf(+wishlist_id);

                            (wish.ITEM_WISHLISTS[wish.itemId].WISHLISTS).splice(WIDindex, 1);//

                            //удаляем id товара из wish.ALLLISTS[wishlist_id].PRODUCTS кликнутого списка для текущего элемента
                            let WPRODUCTSarray = Object.values(wish.ALLLISTS[wishlist_id].PRODUCTS);

                            let WPRODUCTSindex = (wish.ALLLISTS[wishlist_id].PRODUCTS).indexOf(wish.itemId);

                            WPRODUCTSarray.splice(WPRODUCTSindex, 1);
                            wish.ALLLISTS[wishlist_id].PRODUCTS = WPRODUCTSarray;

                            if ((wish.ITEM_WISHLISTS[wish.itemId].WISHLISTS).length < 1) {
                                delete wish.ITEM_WISHLISTS[wish.itemId];

                                let ALLITEMSItemArray = Object.values(wish.ALLITEMS);
                                let ALLITEMSItemIndex = wish.ALLITEMS.indexOf(wish.itemId);
                                ALLITEMSItemArray.splice(ALLITEMSItemIndex, 1);

                                wish.ALLITEMS = ALLITEMSItemArray;

                                delete wish.ALLITEMS[ALLITEMSItemIndex];
                                let popup_box = findAncestor(added_heart, 'wishlist_box');
                                let reopen_popup_box = popup_box.nextElementSibling.querySelector('.wishlistblock > span > i');
                                reopen_popup_box.classList.remove('fas');
                                reopen_popup_box.classList.add('far');
                                reopen_popup_box.parentNode.classList.remove('wished');
                            }
                        } else {
                            console.log('Ошибка при удалении из списка');
                        }
                    },
                    onerror: function (err) {
                        console.log(err);
                    }
                });
            }
        }
    }

    /**
     * Метод создает блок с формой для создания списка
     * @param {HTMLElement} elem
     * @return {void}
     */
    createPopupWishlistBoxAddWishlist(elem) {
        wish = this;
        let addBox = document.createElement('div');

        addBox.classList.add("wishlist_add_box")

        addBox.innerHTML =
            '<div>' +
            '<div class="wishlist_box_wishlist_add_control">' +
            '<span class="cancel_create_wishlist">' +
            '<i class="fal fa-arrow-left"></i>' +
            '</span>' +
            '<span class="cancel_add2wishlist">' +
            '<i class="fal fa-times"></i>' +
            '</span>' +
            '</div>' +
            '<div class="wishlist_add_box_name">Введите название списка</div>' +
            '<div class="wishlist_add_box_input_block">' +
            '<input type="text" value="" placeholder="Введите название">' +
            '</div>' +
            '<div class="btn_create_block">' +
            '<span class="btn_create disabled">Создать список</span>' +
            '</div>' +
            '</div>';

        elem.parentNode.parentNode.prepend(addBox);

        let popup_close_btn = addBox.querySelector('.cancel_add2wishlist > i');
        popup_close_btn.addEventListener('click', wish.closePopupWishlistBox);

        let cancel_create_wishlist_btn = addBox.querySelector('.cancel_create_wishlist > i');
        cancel_create_wishlist_btn.addEventListener('click', function (e) {
            wish.cancelCreateWishlist(this);
        });

        let wishlist_name_input = addBox.querySelector('.wishlist_add_box_input_block > input');
        wishlist_name_input.addEventListener('input', typeInInput);

        let btn_create = addBox.querySelector('.btn_create');
        btn_create.addEventListener('click', function (e) {
            wish.addNewWishlist(btn_create);
        });
    }

    /**
     * Создает новый список
     * @param {HTMLElement} btn
     * @return {void}
     */
    addNewWishlist(btn) {
        wish = this;

        if (btn.classList.contains('disabled') === false) {
            let add_box = findAncestor(btn, 'wishlist_add_box');
            let wishlist_name_input = add_box.querySelector('.wishlist_add_box_input_block > input');
            let re = /^[0-9a-zA-Zа-яЁёА-Я\s-_]{4,}$/;
            let new_name = wishlist_name_input.value;

            if (re.test(new_name)) {
                wishlist_name_input.value = '';
                let postData = {
                    'ACTION': 'add_and_create',
                    'ITEM_ID': wish.itemId,
                    'WISHLIST_NEW_NAME': new_name,
                };
                BX.showWait();
                BX.ajax({
                    url: '/local/components/kk/wishlist_v2/ajax.php',
                    method: 'POST',
                    data: postData,
                    dataType: 'json',
                    onsuccess: function (res) {
                        BX.closeWait();

                        if (res['ADD_STATUS'] === 'Y') {
                            let nkey = wish.ALLITEMS.length;

                            if (wish.ALLITEMS.indexOf(parseInt(res.ITEM_ID, 10)) === -1) {
                                wish.ALLITEMS[nkey] = parseInt(res.ITEM_ID, 10);
                            }

                            wish.ALLLISTS[res.WISHLIST_ID] = [];
                            wish.ALLLISTS[res.WISHLIST_ID]['IS_DEFAULT'] = null;
                            wish.ALLLISTS[res.WISHLIST_ID]['NAME'] = res.NEW_NAME;
                            wish.ALLLISTS[res.WISHLIST_ID]['PRODUCTS'] = [parseInt(res.ITEM_ID, 10)];
                            wish.USER_WISHLIST[res.WISHLIST_ID] = res.NEW_NAME;

                            if (typeof (wish.ITEM_WISHLISTS[res.ITEM_ID]) == 'undefined') {
                                wish.ITEM_WISHLISTS[wish.ITEM_ID] = {};
                                wish.ITEM_WISHLISTS[res.ITEM_ID] = {ITEM_ID: res.ITEM_ID, WISHLISTS: [],};
                                let WISHLISTS_length = (wish.ITEM_WISHLISTS[res.ITEM_ID].WISHLISTS).length;
                                wish.ITEM_WISHLISTS[res.ITEM_ID].WISHLISTS[WISHLISTS_length] = res.WISHLIST_ID;
                            } else {
                                let WISHLISTS_length = (wish.ITEM_WISHLISTS[res.ITEM_ID].WISHLISTS).length;
                                wish.ITEM_WISHLISTS[res.ITEM_ID].WISHLISTS[WISHLISTS_length] = res.WISHLIST_ID;
                            }

                            let popup_box = findAncestor(add_box, 'wishlist_box');
                            let reopen_popup_box = popup_box.nextElementSibling.querySelector('.wishlistblock > span > i');
                            popup_box.remove();
                            reopen_popup_box.classList.toggle('fas');
                            reopen_popup_box.classList.toggle('fal');

                            if (reopen_popup_box.parentNode.classList.contains('wished') === false) {
                                reopen_popup_box.parentNode.classList.add('wished');
                            }
                            reopen_popup_box.click();
                        } else {
                            console.log('Ошибка при создании списка');

                        }
                    },
                    onerror: function (err) {
                        console.log(err);
                    }
                });
            } else {
                wishlist_name_input.setAttribute("style", "border:1px solid #9f2349;");
            }
        }
    }

    /**
     * Метод удаляет все блоки со списками
     * @param {Event} e
     * @return {void}
     */
    closeAllOpenWishListPopup(e) {
        let popup_box = document.querySelector(".wishlist_box");
        if (popup_box !== null) {
            if (!popup_box.contains(e.target)) {
                popup_box.remove();
            }
        }
    }

    /**
     * Метод удаляет блок со списками
     * @param {Event} e
     * @return {void}
     */
    closePopupWishlistBox(e) {
        let popup_box = findAncestor(this, 'wishlist_box');
        popup_box.remove();
    }

    /**
     * Событие навешивается на стрелку "назад" когда открыта форма для создания списка
     * @param btn
     */
    cancelCreateWishlist(btn) {
        let add_box = findAncestor(btn, 'wishlist_add_box');
        add_box.remove();
    }
}

/**
 * @param {Event} e
 * @return {void}
 * имитируем hover при наведении на сердечко
 */
function mouseout(e) {
    if (e.children[0].classList.contains('wished') === false) {
        let i = e.children[0].children[0];
        i.classList.toggle('fal');
        i.classList.toggle('fas');
    }
}

function mouseover(e) {
    if (e.children[0].classList.contains('wished') === false) {
        let i = e.children[0].children[0];
        i.classList.toggle('fal');
        i.classList.toggle('fas');
    }
}

/**
 * @param {HTMLElement} node
 * @return {boolean}
 * является ли узел родителем
 * */
function isParent(node) {
    return node.children.length >= 1;
}

function findAncestor(el, cls) {
    while((el = el.parentElement) && !el.classList.contains(cls)) ;
    return el;
}

/**
 * @return {void}
 * Добавляет список с избранными товарами в корзину
 */
function addFullWishlist2Cart() {
    $('a.addFullWishlist2Cart').click(function () {
        let items2basket = $(this).parents('.wishlist').find('.element-product');
        let arAdd2Basket = [];
        for (let i = 0; i < items2basket.length; i++) {
            let itemid = $(items2basket[i]).data('item-id');
            arAdd2Basket.push(itemid);
        }

        let postData = {
            'ACTION': 'addFullWishlist2Cart',
            'ITEM_IDS': arAdd2Basket
        };
        BX.showWait();
        BX.ajax({
            url: '/local/components/kk/wishlist/ajax.php',
            method: 'POST',
            data: postData,
            dataType: 'json',
            onsuccess: function (result) {
                BX.closeWait();
                $('body').css({'overflow': 'hidden'});
                let popupAddToCardSuccess = $('body').append('<div class="popupAddToCardSuccess" style="display: table;background: #26262663;position: fixed;width: 100%;height: 100%;top: 0;left: 0;z-index: 999;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><div style="background: #fff;width: 400px;height: 150px;margin: 0 auto;"><div style="display:table;height:100%;width:100%;"><div style="display: flex;\n' +
                    '    flex-direction: column;\n' +
                    '    height: 100%;\n' +
                    '    width: 100%;\n' +
                    '    position: relative;\n' +
                    '    color: #262626;\n' +
                    '    font-size: 18px;\n' +
                    '    align-items: center;\n' +
                    '    justify-content: center;"><span class="close" style="position:absolute;right:10px;top:8px;"><i class="fal fa-times"></i></span><div style="margin-bottom: 15px;">Товары успешно добавлены в корзину</div><div class="mt10"><span><a class="btn black-button height-40 width-160 justify-content-xl-center" href="https://new.seasonkrasoty.ru/personal/cart/">Перейти в корзину</a></span></div></div></div></div></div></div>');
                $('.popupAddToCardSuccess .close').click(function () {
                    $('.popupAddToCardSuccess').remove();
                    $('body').css({'overflow': 'unset'});
                })
                BX.onCustomEvent('OnBasketChange');
            },
            onerror: function (err) {
                console.log(err);
            }
        });
    });
}

/**
 * @return {void}
 */
function fbshare() {
    $('span.fb_share_link').click(function (e) {
        let wpublink = $(this).data('href');
        let share_link = 'http://www.facebook.com/sharer.php?u=' + encodeURI(wpublink);
        myWin = open(share_link, "displayWindow", "width=520,height=300,left=350,top=170,status=no,toolbar=no,menubar=no");
    });
}

/**
 * @return {void}
 */
function copytext() {
    $('.link2copy').click(function () {
        let el = $(this).find('.link2copytext');
        let tooltip = $(this).find('.l2c_tooltip');
        $(tooltip).removeClass('fading').addClass('d_n');

        let $tmp = $("<input>");
        $("body").append($tmp);
        $tmp.val($(el).text()).select();
        document.execCommand("copy");
        $tmp.remove();
        $(tooltip).removeClass('d_n');
        setTimeout(function () {
            $(tooltip).addClass('fading');
        }, 800);
    });
}

/**
 * @return {void}
 */
function typeInInput() {
    let re = /^[0-9a-zA-Zа-яЁёА-Я\s-_]{4,}$/;
    let val = this.value;
    let add_box = findAncestor(this, 'wishlist_add_box');
    let btn_create = add_box.querySelector('.btn_create');

    if (re.test(val)) {
        btn_create.classList.remove('disabled');
    } else {
        btn_create.classList.add('disabled');
    }
}

let wish = new Wish();
/**
 * @return {Wish} return object class Wish
 * */
function getWish() {
    return wish;
}

/**
 * @return {Wish} return new object class Wish
 * */
function newWish() {
    return new Wish();
}
