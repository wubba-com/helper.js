class InitSearchBrand {
    constructor () {
        this.fieldSearch = document.getElementById('filter-search-brand');
        this.listBrands = this.fieldSearch.parentNode.nextSibling.nextSibling.children;
        this.nameBrands = [];
        this.data = '';
    }

    // Добавляем в массив название брендов (type string)
    getlistNameBrand() {
        for(this.brand of this.listBrands) {
            const nameBrand = this.brand.children[0].lastElementChild.textContent.trim();
            this.nameBrands.push(nameBrand.toLowerCase());
        }
    }

    createSearch() {
        // Событие которые следит за вводом в инпут и конкатенирует буквы в одну строку
        this.fieldSearch.addEventListener('input', (e) => {

            this.data = this.fieldSearch.value.toLowerCase();

            // Простой фильтр, который возвращает массив с первым вхождением
            const result = this.nameBrands.filter(brand => brand.indexOf(this.data) >= 0 ? this.brand : "");

            for(this.brand of this.listBrands) {
                const nameBrand = this.brand.children[0].lastElementChild.textContent.trim();
                if (!result.includes(nameBrand.toLowerCase())) {
                    this.brand.style.display = 'none';
                } else {
                    this.brand.style.display = 'block';
                }
            }
        })

        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 8) {
                if (this.data.length > 1) {
                    this.data = this.data.substring(0, this.data.length - 1)
                } else {
                    this.data = "";
                }
            }
        })
    }
}

const searchBrands = new InitSearchBrand();

searchBrands.getlistNameBrand();
searchBrands.createSearch();
